import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireSession } from "@/lib/require-session";

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("category_id");
  const supabase = supabaseServer();

  let query = supabase
    .from("links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
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
  const { category_id, name, slug, url, description, icon, thumbnail_url, sort_order } = body;

  if (!category_id || !name || !slug || !url) {
    return NextResponse.json(
      { error: "Kategori, nama, slug, dan URL wajib diisi" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("links")
    .insert({
      category_id,
      name,
      slug,
      url,
      description: description ?? null,
      icon: icon ?? "link",
      thumbnail_url: thumbnail_url ?? null,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
