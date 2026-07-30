import { NextRequest } from "next/server";
import { verifyUserSessionToken, USER_SESSION_COOKIE } from "./user-auth";

export async function requireUserSession(request: NextRequest) {
  const token = request.cookies.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifyUserSessionToken(token);
}
