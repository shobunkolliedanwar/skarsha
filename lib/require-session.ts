import { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "./auth";

export async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
