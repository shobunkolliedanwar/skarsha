import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireUserSession } from "@/lib/require-user-session";
import { createClosedTransaction } from "@/lib/tripay";
import { PREMIUM_PRICING } from "@/lib/pricing";
import type { PremiumPlan } from "@/lib/types";

function getAppUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

export async function POST(request: NextRequest) {
  const session = await requireUserSession(request);
  if (!session) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const { plan, method } = await request.json().catch(() => ({}));

  if (plan !== "monthly" && plan !== "lifetime") {
    return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
  }
  if (!method || typeof method !== "string") {
    return NextResponse.json(
      { error: "Metode pembayaran wajib dipilih" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { data: user } = await supabase
    .from("users")
    .select("id, email, full_name")
    .eq("id", session.sub)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
  }

  const selectedPlan = plan as PremiumPlan;
  const amount = PREMIUM_PRICING[selectedPlan];
  const merchantRef = `SKARSHA-${selectedPlan.toUpperCase()}-${Date.now()}-${user.id.slice(0, 8)}`;
  const appUrl = getAppUrl(request);

  // Simpan dulu sebagai pending SEBELUM hit Tripay, biar ada jejak walau
  // request ke Tripay gagal di tengah jalan.
  const { error: insertError } = await supabase.from("premium_transactions").insert({
    user_id: user.id,
    plan: selectedPlan,
    amount,
    status: "pending",
    tripay_merchant_ref: merchantRef,
    payment_method: method,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  try {
    const tx = await createClosedTransaction({
      method,
      merchantRef,
      amount,
      customerName: user.full_name || user.email,
      customerEmail: user.email,
      orderItems: [
        {
          sku: `PREMIUM-${selectedPlan.toUpperCase()}`,
          name: `SKARSHA Premium — ${selectedPlan === "monthly" ? "Bulanan" : "Lifetime"}`,
          price: amount,
          quantity: 1,
        },
      ],
      callbackUrl: `${appUrl}/api/premium/webhook`,
      returnUrl: `${appUrl}/akun`,
    });

    await supabase
      .from("premium_transactions")
      .update({ tripay_reference: tx.reference })
      .eq("tripay_merchant_ref", merchantRef);

    return NextResponse.json({ checkout_url: tx.checkout_url });
  } catch (err) {
    await supabase
      .from("premium_transactions")
      .update({ status: "failed" })
      .eq("tripay_merchant_ref", merchantRef);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal membuat transaksi" },
      { status: 502 }
    );
  }
}
