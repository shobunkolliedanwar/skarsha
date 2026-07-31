import type { PremiumPlan } from "./types";

/**
 * Harga premium dalam Rupiah. Satu sumber kebenaran dipakai baik oleh
 * halaman /premium (tampilan) maupun /api/premium/checkout (perhitungan
 * amount yang dikirim ke Tripay) — supaya ga pernah mismatch.
 */
export const PREMIUM_PRICING: Record<PremiumPlan, number> = {
  monthly: 15000,
  lifetime: 75000,
};

export function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
