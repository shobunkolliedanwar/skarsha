import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireUserSession } from "@/lib/require-user-session";
import { isEffectivelyPremium } from "@/lib/premium";

export async function GET(request: NextRequest) {
  const session = await requireUserSession(request);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const supabase = supabaseServer();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, full_name, is_premium, premium_plan, premium_expires_at")
    .eq("id", session.sub)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      ...user,
      is_premium: isEffectivelyPremium(user),
    },
  });
}
