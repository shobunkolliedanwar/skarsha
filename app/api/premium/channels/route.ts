import { NextResponse } from "next/server";
import { getPaymentChannels } from "@/lib/tripay";

export async function GET() {
  try {
    const channels = await getPaymentChannels();
    const active = channels
      .filter((c) => c.active)
      .map((c) => ({ code: c.code, name: c.name, type: c.type }));
    return NextResponse.json({ data: active });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengambil channel" },
      { status: 500 }
    );
  }
}
