/**
 * Cloudflare Turnstile (free CAPTCHA alternative).
 *
 * Optional, like every backend feature here: set both
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY   – shown to the browser (renders the widget)
 *   TURNSTILE_SECRET_KEY             – server-side verification
 * from https://dash.cloudflare.com → Turnstile. When either is missing the form
 * works without the widget and only the honeypot + rate limit protect it.
 */
export function isTurnstileConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → nothing to verify
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip === "unknown" ? undefined : ip }),
      // Don't let a slow Cloudflare call hang the form.
      signal: AbortSignal.timeout(5000),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    console.error("[turnstile] verification failed:", err);
    return false;
  }
}
