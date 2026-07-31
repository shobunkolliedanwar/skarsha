import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { verifyCallbackSignature, type TripayCallbackPayload } from "@/lib/tripay";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  // WAJIB pakai raw text body untuk verifikasi signature, bukan request.json()
  // dulu baru di-stringify ulang — urutan key bisa beda dan signature gagal match.
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-callback-signature");
  const eventHeader = request.headers.get("x-callback-event");

  if (!verifyCallbackSignature(rawBody, signatureHeader)) {
    return NextResponse.json(
      { success: false, message: "Invalid signature" },
      { status: 403 }
    );
  }

  if (eventHeader !== "payment_status") {
    return NextResponse.json(
      { success: false, message: `Unrecognized event: ${eventHeader}` },
      { status: 400 }
    );
  }

  const payload = JSON.parse(rawBody) as TripayCallbackPayload;
  const supabase = supabaseServer();

  const { data: trx } = await supabase
    .from("premium_transactions")
    .select("id, user_id, plan, status")
    .eq("tripay_merchant_ref", payload.merchant_ref)
    .maybeSingle();

  if (!trx) {
    return NextResponse.json(
      { success: false, message: "Transaksi tidak ditemukan" },
      { status: 404 }
    );
  }

  // Idempotency: kalau udah pernah diproses jadi "paid", jangan diproses ulang
  // (Tripay bisa mengirim callback yang sama lebih dari sekali).
  if (trx.status === "paid") {
    return NextResponse.json({ success: true });
  }

  const newStatus =
    payload.status === "PAID"
      ? "paid"
      : payload.status === "EXPIRED"
        ? "expired"
        : payload.status === "FAILED" || payload.status === "REFUND"
          ? "failed"
          : "pending";

  await supabase
    .from("premium_transactions")
    .update({
      status: newStatus,
      tripay_reference: payload.reference,
      payment_method: payload.payment_method_code || payload.payment_method,
      paid_at: payload.status === "PAID" ? new Date().toISOString() : null,
    })
    .eq("id", trx.id);

  if (payload.status === "PAID") {
    const premiumExpiresAt =
      trx.plan === "monthly" ? new Date(Date.now() + THIRTY_DAYS_MS).toISOString() : null;

    await supabase
      .from("users")
      .update({
        is_premium: true,
        premium_plan: trx.plan,
        premium_expires_at: premiumExpiresAt,
      })
      .eq("id", trx.user_id);
  }

  return NextResponse.json({ success: true });
}
