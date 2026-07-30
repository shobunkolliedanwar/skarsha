import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase/server";
import {
  createUserSessionToken,
  userSessionCookieOptions,
  USER_SESSION_COOKIE,
} from "@/lib/user-auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi" },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const supabase = supabaseServer();

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 }
    );
  }

  const token = await createUserSessionToken({ sub: user.id, email: user.email });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(USER_SESSION_COOKIE, token, userSessionCookieOptions);
  return response;
}
