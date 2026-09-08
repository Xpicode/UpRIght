"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession,
  destroySession,
  getSession,
  isAuthConfigured,
  verifyCredentials,
} from "@/lib/auth";
import { deleteMessage, updateStatus, type MessageStatus } from "@/lib/db";
import { clientIp, hit } from "@/lib/rate-limit";

export type LoginState = { error?: string; email?: string };

// Brute-force protection: a handful of attempts per IP, then a cool-down.
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET." };
  }
  const ip = await clientIp();
  const limited = hit(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
  if (!limited.ok) {
    console.warn(`[auth] login rate-limited ip=${ip}`);
    const mins = Math.ceil(limited.retryAfterSeconds / 60);
    return { error: `Too many attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!verifyCredentials(email, password)) {
    console.warn(`[auth] failed login ip=${ip} email=${email.slice(0, 64)}`);
    // Slow down guessing a little more, with jitter so timing reveals nothing.
    await sleep(400 + Math.random() * 400);
    return { error: "Incorrect email or password.", email };
  }
  console.info(`[auth] admin login ip=${ip}`);
  await createSession(email);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

const STATUSES: MessageStatus[] = ["new", "read", "replied", "archived"];

export async function setMessageStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as MessageStatus;
  if (!Number.isInteger(id) || !STATUSES.includes(status)) return;
  await updateStatus(id, status);
  revalidatePath("/admin");
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteMessage(id);
  revalidatePath("/admin");
}
