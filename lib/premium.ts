import type { User } from "./types";

/**
 * Menentukan apakah user benar-benar premium saat ini.
 * Plan "lifetime" selalu premium selama is_premium true.
 * Plan "monthly" dianggap premium hanya jika premium_expires_at masih di masa depan.
 * Ini adalah pengecekan lazy (dihitung saat dibaca), bukan cron job terpisah.
 */
export function isEffectivelyPremium(
  user: Pick<User, "is_premium" | "premium_plan" | "premium_expires_at">
): boolean {
  if (!user.is_premium) return false;
  if (user.premium_plan === "lifetime") return true;
  if (!user.premium_expires_at) return false;
  return new Date(user.premium_expires_at).getTime() > Date.now();
}
