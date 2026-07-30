import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";
import { verifyUserSessionToken, USER_SESSION_COOKIE } from "@/lib/user-auth";
import { isEffectivelyPremium } from "@/lib/premium";
import type { User } from "@/lib/types";

/**
 * Dipakai di server components (bukan API routes) untuk mengambil user
 * yang sedang login, lengkap dengan status premium efektif.
 */
export async function getCurrentUser(): Promise<
  (Pick<User, "id" | "email" | "full_name" | "premium_plan" | "premium_expires_at"> & {
    is_premium: boolean;
  }) | null
> {
  const token = cookies().get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifyUserSessionToken(token);
  if (!session) return null;

  const supabase = supabaseServer();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, full_name, is_premium, premium_plan, premium_expires_at")
    .eq("id", session.sub)
    .maybeSingle();

  if (error || !user) return null;

  return {
    ...user,
    is_premium: isEffectivelyPremium(user),
  };
}
