import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { insertMessage, isDbConfigured } from "@/lib/db";
import { clientIpFrom, hit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { site } from "@/data/site";

export const runtime = "nodejs";

// Abuse limits: per-IP and a global ceiling so one botnet can't drain the email quota.
const PER_IP_LIMIT = 5; // submissions
const PER_IP_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes
const GLOBAL_LIMIT = 60; // submissions
const GLOBAL_WINDOW_MS = 60 * 60 * 1000; // per hour, site-wide
const MAX_BODY_BYTES = 32 * 1024; // the schema allows ~5 KB of text; anything bigger is junk

/**
 * POST /api/contact
 * Validates the form, stores it in Postgres (for /admin) and emails a copy via Resend.
 *
 * Env vars (see .env.example):
 *   DATABASE_URL       – Postgres connection string
 *   RESEND_API_KEY     – from https://resend.com/api-keys
 *   RESEND_FROM_EMAIL  – a sender on a domain you verified in Resend,
 *                        or "onboarding@resend.dev" while testing
 *   CONTACT_TO_EMAIL   – where submissions should land
 *   TURNSTILE_SECRET_KEY (optional) – enables CAPTCHA verification
 */
export async function POST(req: Request) {
  const ip = clientIpFrom(req.headers);

  // 0) Cheap rejections first: oversized bodies and rate limits.
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 413 });
  }
  const perIp = hit(`contact:${ip}`, PER_IP_LIMIT, PER_IP_WINDOW_MS);
  const global = hit("contact:global", GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
  if (!perIp.ok || !global.ok) {
    const retry = perIp.ok ? (global as { retryAfterSeconds: number }).retryAfterSeconds : perIp.retryAfterSeconds;
    return NextResponse.json(
      { ok: false, error: "Too many messages sent recently. Please try again later or email us directly." },
      { status: 429, headers: { "Retry-After": String(retry) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Invalid input" },
      { status: 422 },
    );
  }

  const { turnstileToken, ...data } = parsed.data;

  // Honeypot triggered → pretend success so bots don't learn anything.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // CAPTCHA (only enforced when TURNSTILE_SECRET_KEY is set).
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  // 1) Save to the database (shows up in /admin). Skipped if DATABASE_URL isn't set.
  let saved = false;
  if (isDbConfigured()) {
    try {
      await insertMessage(data);
      saved = true;
    } catch (err) {
      console.error("[contact] DB insert failed:", err);
    }
  }

  // 2) Email a copy via Resend. Skipped if keys aren't set.
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? site.contact.email;

  if (!apiKey || !from) {
    if (!saved) {
      // Nothing configured yet: log a minimal line (no message body → no PII in logs).
      console.warn(`[contact] No DATABASE_URL or RESEND keys set. Dropped inquiry from ${data.email}`);
    }
    return NextResponse.json({ ok: true, saved, emailed: false });
  }

  const resend = new Resend(apiKey);
  const subject = `New inquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`;

  const text = [
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    data.service ? `Service: ${data.service}` : null,
    `IP:      ${ip}`,
    "",
    data.message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px">
      <div style="background:#ffe319;padding:14px 18px;border-radius:12px 12px 0 0">
        <strong style="color:#0b0b0c">New website inquiry</strong>
      </div>
      <div style="border:1px solid #eee;border-top:0;padding:18px;border-radius:0 0 12px 12px">
        <p><b>Name:</b> ${escape(data.name)}</p>
        <p><b>Email:</b> <a href="mailto:${escape(data.email)}">${escape(data.email)}</a></p>
        ${data.company ? `<p><b>Company:</b> ${escape(data.company)}</p>` : ""}
        ${data.service ? `<p><b>Service:</b> ${escape(data.service)}</p>` : ""}
        <hr style="border:0;border-top:1px solid #eee;margin:16px 0" />
        <p style="white-space:pre-wrap">${escape(data.message)}</p>
        <p style="margin-top:16px;color:#888;font-size:12px">Sent from ${escape(ip)}</p>
      </div>
    </div>`;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    if (saved) return NextResponse.json({ ok: true, saved, emailed: false });
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, saved, emailed: true });
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
