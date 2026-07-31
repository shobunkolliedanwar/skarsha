import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireUserSession } from "@/lib/require-user-session";
import { isEffectivelyPremium } from "@/lib/premium";

async function getSessionUser(request: NextRequest) {
  const session = await requireUserSession(request);
  if (!session) return null;

  const supabase = supabaseServer();
  const { data: user } = await supabase
    .from("users")
    .select("id, is_premium, premium_plan, premium_expires_at")
    .eq("id", session.sub)
    .maybeSingle();

  return user ?? null;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, link_id, created_at, links(id, name, description, url, icon, category_id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  if (!isEffectivelyPremium(user)) {
    return NextResponse.json(
      { error: "Fitur bookmark khusus untuk pengguna Premium", requiresPremium: true },
      { status: 403 }
    );
  }

  const { link_id } = await request.json().catch(() => ({}));
  if (!link_id) {
    return NextResponse.json({ error: "link_id wajib diisi" }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { error } = await supabase
    .from("bookmarks")
    .upsert({ user_id: user.id, link_id }, { onConflict: "user_id,link_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const { link_id } = await request.json().catch(() => ({}));
  if (!link_id) {
    return NextResponse.json({ error: "link_id wajib diisi" }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("link_id", link_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
