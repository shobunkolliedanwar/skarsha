import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireSession } from "@/lib/require-session";
import { isEffectivelyPremium } from "@/lib/premium";

export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, is_premium, premium_plan, premium_expires_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = (data ?? []).map((u) => ({
    ...u,
    is_premium: isEffectivelyPremium(u),
  }));

  return NextResponse.json({ data: users });
}
