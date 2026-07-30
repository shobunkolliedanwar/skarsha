import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { verifyUserSessionToken, USER_SESSION_COOKIE } from "@/lib/user-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/login";
  const isUserPath = pathname === "/akun" || pathname.startsWith("/akun/");
  const isUserAuthPage = pathname === "/masuk" || pathname === "/daftar";

  // Pengaman tambahan: middleware ini HANYA boleh memproses path di bawah ini.
  // Semua halaman publik lain (termasuk "/") harus lolos tanpa disentuh.
  if (!isAdminPath && !isLoginPage && !isUserPath && !isUserAuthPage) {
    return NextResponse.next();
  }

  // --- Sesi admin (CMS) ---
  if (isAdminPath || isLoginPage) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session && isAdminPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // --- Sesi user publik (akun/premium) ---
  const userToken = request.cookies.get(USER_SESSION_COOKIE)?.value;
  const userSession = userToken ? await verifyUserSessionToken(userToken) : null;

  if (!userSession && isUserPath) {
    const loginUrl = new URL("/masuk", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (userSession && isUserAuthPage) {
    return NextResponse.redirect(new URL("/akun", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/akun/:path*", "/masuk", "/daftar"],
};
