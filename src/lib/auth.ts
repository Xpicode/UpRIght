import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";

/**
 * Minimal single-admin auth.
 *   ADMIN_EMAIL     – login email
 *   ADMIN_PASSWORD  – login password (keep .env.local private / set in Vercel as a secret)
 *   AUTH_SECRET     – random 32+ char string used to sign the session cookie
 *
 * Want multiple admins later? Swap `verifyCredentials` for a lookup in an `admin_users`
 * table with bcrypt-hashed passwords — the rest of this file stays the same.
 */
export const SESSION_COOKIE = "upright_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 16 characters");
  }
  return new TextEncoder().encode(s);
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);
}

export function verifyCredentials(email: string, password: string) {
  const e = process.env.ADMIN_EMAIL ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!e || !p) return false;
  return safeEqual(email.trim().toLowerCase(), e.trim().toLowerCase()) && safeEqual(password, p);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ sub: email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function verifyToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin" ? { email: String(payload.sub) } : null;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}
