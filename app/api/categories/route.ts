import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireSession } from "@/lib/require-session";

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("categories")
    .select("*, links(count)")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { name, slug, description, icon, accent_color, sort_order } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Nama dan slug kategori wajib diisi" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
      description: description ?? null,
      icon: icon ?? "sparkles",
      accent_color: accent_color ?? "#C9A24C",
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
