import { SignJWT, jwtVerify } from "jose";
import type { UserSession } from "./types";

export const USER_SESSION_COOKIE = "skarsha_user_session";
const USER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 hari

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET belum di-set atau terlalu pendek (minimal 16 karakter). Cek .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createUserSessionToken(payload: UserSession) {
  return await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${USER_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyUserSessionToken(
  token: string
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export const userSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: USER_SESSION_MAX_AGE_SECONDS,
};
