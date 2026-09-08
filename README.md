# Upright Systems — Landing Page

Modern one-page site for Upright Solutions and Systems Consultancy Corp., built with
**Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript**, with a contact form that saves to
Postgres and emails you, and a login-protected **/admin** inbox to manage inquiries.

```
src/
  app/
    layout.tsx            ← fonts + metadata (root)
    globals.css           ← brand colours, buttons, cards, keyframes
    (site)/               ← public pages, share navbar/footer/preloader/page transition
      layout.tsx, template.tsx
      page.tsx            ← Home
      services/  work/  about/  events/  contact/   ← one page.tsx each
    api/contact/route.ts  ← form handler: saves to DB + emails via Resend
    admin/                ← /admin inbox, /admin/login (no site chrome)
  components/             ← page sections (hero, services, projects, team-gallery, events, awards, offices-map …)
  components/motion/      ← animation primitives + route-transition (yellow curtain)
  data/site.ts            ← ALL text content: nav, services, projects, team photos, events, awards, offices
  lib/db.ts               ← Postgres queries
  lib/auth.ts             ← admin session (cookie + JWT)
  proxy.ts                ← protects /admin routes
public/images/            ← logo, client logos, project + team photos
schema.sql                ← database table
Dockerfile, docker-compose.yml
```

---

## Running it — http://localhost:3000

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) (and Node 20+ for editing).

```bash
npm run start:all    # builds the site and starts it + database + DB viewer in Docker
```

- Site: <http://localhost:3000>
- Admin inbox: <http://localhost:3000/admin> — login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local` (login stays disabled until both are set)
- Database viewer: <http://localhost:8085> (Adminer) — System **PostgreSQL**, Server `db`, Username/Password/Database `upright`
- `npm run stop` stops everything. The site shows up in Docker Desktop under **upright → web-1**.

The Docker site is a built snapshot: after editing code, run `npm run start:all` again to rebuild it (1–3 min).
For live editing with instant reload, run `npm run dev` — that's a second copy at <http://localhost:3001>
that uses the same Docker database.

## Option C — Configure the backend (`.env.local`)

Copy `.env.example` to `.env.local` and fill in what you need. Every block is optional and
independent — you can enable one, two or all three.

| Feature | Variables | Where to get them |
|---|---|---|
| **Database** — store messages, powers `/admin` | `DATABASE_URL` | Docker: already set. Cloud: free Postgres at [neon.tech](https://neon.tech) → *Connect* → copy string, then run `schema.sql` in Neon's SQL editor. Supabase / Railway / any Postgres also works. |
| **Admin login** — protects `/admin` | `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` | Use a long random password (20+ chars). Generate password and secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| **Spam protection** (optional) — CAPTCHA on the form | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Free at [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile). Without it the form still has a honeypot + rate limiting. |
| **Email notifications** — emails you each inquiry | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Free account at [resend.com](https://resend.com) → *API Keys*. For testing keep `RESEND_FROM_EMAIL=onboarding@resend.dev` (delivers only to your Resend signup email). For production verify `uprightsystems.com` under *Domains* and use e.g. `website@uprightsystems.com`. |

What happens with each combination:

| DB | Email | Result |
|---|---|---|
| ✗ | ✗ | Form shows "sent", submission is logged to the server console only |
| ✓ | ✗ | Saved → visible in `/admin` |
| ✗ | ✓ | Emailed to `CONTACT_TO_EMAIL` |
| ✓ | ✓ | Both |

## Deploying

**Vercel (recommended, same as the current site):** push to GitHub → *Import project* on
vercel.com → add the variables from `.env.local` under *Settings → Environment Variables*.
Use Neon for the database (Vercel can't reach a Docker container).

**Any server with Docker:** copy the project, create `.env.local` with `POSTGRES_PASSWORD`,
`ADMIN_EMAIL`, a strong `ADMIN_PASSWORD`, `AUTH_SECRET` and your real `NEXT_PUBLIC_SITE_URL`,
then `npm run prod` (uses `docker-compose.prod.yml`: no Adminer, database not exposed, web bound
to 127.0.0.1). Put a reverse proxy (Caddy, nginx, Traefik) in front for HTTPS. `npm run prod:stop`
stops it. The plain `docker-compose.yml` is for local development only.

> Note: the build fetches the Inter and Sora fonts from Google Fonts, so it needs internet
> access the first time.

## Animations

All motion lives in `src/components/motion/` and respects `prefers-reduced-motion`:

| Where | What |
|---|---|
| First visit | Yellow curtain preloader with cycling words, wipes up (once per browser session) |
| Page change | Click any nav link → yellow curtain rises with the page name, new page slides in, curtain lifts (`TransitionLink` / `RouteCurtain` in `motion/route-transition.tsx`) |
| Whole page | Lenis smooth scrolling, anchor links glide, yellow scroll-progress bar at the top |
| Navbar | Slides in after the intro; pill highlight follows the section you're reading |
| Hero | Headline words rise out of a mask, photos parallax at different speeds, morphing yellow blob, magnetic buttons with label-swap hover, count-up stats, two-way logo marquee |
| Services | 3D tilt + cursor spotlight on each card, icon wiggle |
| Work | Slow image zoom, "View" badge follows the cursor, shine sweep on photos |
| Process | Yellow track fills as you scroll, step numbers light up in view |
| About | Team photo wall tiles rotate/slide in with hover captions; award card tilts with spotlight |
| Events | Featured event with count-up stats, hover "Look" badge, timeline of past events |
| Offices | Interactive 3D-tilted map (MapLibre + free CARTO dark tiles, no API key), cinematic fly-to between Manila and Cavite, pulsing markers, glass info card that blurs in/out |
| Contact | Animated checkmark drawn on success |

Tweak timings in each component; disable any piece by removing it from `src/app/page.tsx` or the section that uses it.

## Editing content

- **Text, services, projects, stats, offices, photos:** `src/data/site.ts`
- **Colours / radius / fonts:** top of `src/app/globals.css` (`--brand` is the yellow)
- **Photos:** drop files into `public/images/photos/` and reference them in `site.ts`
- **Office pins:** `site.offices[].coordinates` in `site.ts`; map look in `src/components/offices-map.tsx` (`STYLE_DARK` — swap for `positron-gl-style` for a light map)
- **Founder note:** `founder.note` in `site.ts` — replace with a real quote if you have one

## Extending later

- **More admins:** replace `verifyCredentials()` in `src/lib/auth.ts` with a lookup in an
  `admin_users` table (bcrypt-hashed passwords). Everything else stays the same.
- **Reply from the dashboard:** add a server action that calls Resend with the message id.
- **Spam protection:** built in — honeypot, per-IP + site-wide rate limits (`src/lib/rate-limit.ts`),
  and optional Cloudflare Turnstile (set the two `TURNSTILE` variables). Login attempts are rate-limited too.
- **Security headers:** CSP, HSTS, frame/MIME protections live in `next.config.ts`. If you add a
  third-party script or image host, add its domain to the CSP there.

## Security checklist (before going live)

1. `ADMIN_PASSWORD` is 20+ random characters and `AUTH_SECRET` is a fresh 64-hex string.
2. `RESEND_API_KEY` was created for this deployment (rotate any key that was ever shared or emailed).
3. `NEXT_PUBLIC_SITE_URL` is the real `https://` domain (drives OpenGraph, sitemap, robots).
4. HTTPS is terminated by Vercel or your reverse proxy — the app sends HSTS and a CSP already.
5. Turnstile keys set (optional but recommended once the form is public).
6. Docker: use `npm run prod`, never the dev compose, on a server.
7. Keep `.env.local` out of zips, chats and screenshots. It is git-ignored for a reason.
