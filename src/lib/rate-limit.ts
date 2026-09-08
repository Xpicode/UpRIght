import { headers } from "next/headers";

/**
 * Small in-memory sliding-window rate limiter.
 *
 * Good enough for a single Node process (the Docker deployment) and still useful
 * per-instance on Vercel. If the site ever runs on many instances and abuse becomes
 * a problem, swap `hit()` for a Redis/Upstash-backed version — the callers stay the same.
 */
type Bucket = { hits: number[]; };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000; // hard cap so a flood of IPs can't grow memory without bound

function prune(now: number, windowMs: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [k, b] of buckets) {
    b.hits = b.hits.filter((t) => now - t < windowMs);
    if (b.hits.length === 0) buckets.delete(k);
  }
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * Record one hit for `key` and report whether it is within `limit` hits per `windowMs`.
 */
export function hit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  prune(now, windowMs);
  const b = buckets.get(key) ?? { hits: [] };
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= limit) {
    const oldest = b.hits[0];
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }
  b.hits.push(now);
  buckets.set(key, b);
  return { ok: true };
}

/** Best-effort client IP from proxy headers (Vercel, nginx, Caddy, Traefik). */
export function clientIpFrom(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? h.get("cf-connecting-ip") ?? "unknown";
}

/** Same as `clientIpFrom` but for server actions, where there is no Request object. */
export async function clientIp(): Promise<string> {
  return clientIpFrom(await headers());
}
