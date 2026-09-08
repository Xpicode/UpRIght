import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 * - 'unsafe-inline' for scripts is required by Next.js's inline hydration payload
 *   without a per-request nonce (which would force every page to render dynamically).
 * - MapLibre needs blob: workers and fetches CARTO / OpenStreetMap tiles.
 * - Cloudflare Turnstile (optional CAPTCHA) needs its script + iframe.
 * If you add a new third-party script, image host or API, add it here too.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://tile.openstreetmap.org",
  "font-src 'self' data:",
  `connect-src 'self' https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://tile.openstreetmap.org https://challenges.cloudflare.com${isDev ? " ws: wss:" : ""}`,
  "worker-src 'self' blob:",
  "child-src 'self' blob: https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Browsers ignore HSTS over plain HTTP, so it is safe to always send.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // The Dockerfile sets DOCKER_BUILD=1 to produce a self-contained server in
  // .next/standalone. Local `npm run build` + `npm start` keep the default output.
  output: process.env.DOCKER_BUILD ? "standalone" : undefined,
  // Don't advertise the framework.
  poweredByHeader: false,
  // Allow opening the dev server from other devices on the local network
  // (e.g. http://192.168.x.x:3001 from a phone). Without this, Next blocks the
  // dev scripts cross-origin and the page renders blank.
  allowedDevOrigins: ["192.168.0.113", "localhost", "127.0.0.1"],
  images: {
    // Testimonial portraits (stock photos carried over from the previous site).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
    // Quality values used by <Image quality={...}> across the site (Next 16 requires listing them).
    qualities: [75, 85],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Admin pages must never be cached by shared caches or indexed.
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
