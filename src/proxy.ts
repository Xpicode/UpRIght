import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Protects /admin/* (except /admin/login) — redirects to login when the
 * session cookie is missing or invalid. Next.js 16 calls this file `proxy.ts`
 * (it replaces the older `middleware.ts`).
 */
const SESSION_COOKIE = "upright_admin";

async function isValid(token: string | undefined) {
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await isValid(token);

  if (pathname === "/admin/login") {
    return authed
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (!authed) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
