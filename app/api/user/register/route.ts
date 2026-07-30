import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";
import {
  createUserSessionToken,
  userSessionCookieOptions,
  USER_SESSION_COOKIE,
} from "@/lib/user-auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const { email, password, full_name } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
  }

  if (String(password).length < 8) {
    return NextResponse.json(
      { error: "Password minimal 8 karakter" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Email sudah terdaftar. Coba masuk." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: normalizedEmail,
      password_hash: passwordHash,
      full_name: full_name || null,
    })
    .select("id, email")
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "Gagal membuat akun. Coba lagi." },
      { status: 500 }
    );
  }

  const token = await createUserSessionToken({ sub: user.id, email: user.email });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(USER_SESSION_COOKIE, token, userSessionCookieOptions);
  return response;
}
