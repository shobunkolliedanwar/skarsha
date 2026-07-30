import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nama, email, dan pesan wajib diisi" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject ?? null,
    message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
