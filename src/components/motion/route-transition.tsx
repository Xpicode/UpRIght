"use client";

import { useCallback, useEffect, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * Yellow curtain page transition.
 *
 *  click <TransitionLink>  →  curtain rises from the bottom (label of the target page shown)
 *  →  router.push()        →  new page mounts, <PageEnter> lifts the curtain off the top
 *
 * Reduced-motion users get instant navigation.
 */

type Phase = "idle" | "cover" | "reveal";
let phase: Phase = "idle";
let label = "";
let target = "";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const setPhase = (p: Phase, l = label, href = target) => {
  phase = p;
  label = l;
  target = href;
  emit();
};

/** Cover shown on the curtain while each section loads (`logo` = wordmark card instead of a photo). */
type Cover = { match: RegExp; src: string; logo?: boolean };
const COVERS: Cover[] = [
  { match: /^\/services/, src: "/images/photos/phone.webp" },
  { match: /^\/work/, src: "/images/projects/onehealthpass.webp" },
  { match: /^\/about/, src: "/images/photos/team-6.webp" },
  { match: /^\/events/, src: "/images/photos/event-crew-forward-1.webp" },
  { match: /^\/contact/, src: "/images/photos/building.webp" },
  { match: /^\/faq/, src: "/images/photos/hands.webp" },
  { match: /^\/$/, src: "/images/logo-wordmark.png", logo: true },
];
const coverFor = (href: string): Cover =>
  COVERS.find((c) => c.match.test(href)) ?? { match: /./, src: "/images/photos/conference.webp" };
const snapshot = () => phase;

const COVER_MS = 520;

export function useTransitionNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return useCallback(
    (href: string, text = "") => {
      if (href === pathname) return;
      if (reduce) {
        router.push(href);
        return;
      }
      setPhase("cover", text, href);
      router.prefetch(href);
      window.setTimeout(() => router.push(href), COVER_MS);
    },
    [router, pathname, reduce],
  );
}

type TLProps = LinkProps & {
  children: ReactNode;
  className?: string;
  /** Word shown on the curtain while navigating (defaults to the link text). */
  label?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
};

export function TransitionLink({ href, children, label: lbl, onClick, ...rest }: TLProps) {
  const navigate = useTransitionNavigate();
  const hrefStr = typeof href === "string" ? href : (href.pathname ?? "/");
  const isInternal = hrefStr.startsWith("/") && !hrefStr.startsWith("//");

  return (
    <Link
      href={href}
      // Don't pre-load every linked page in the background — only the one that is
      // actually clicked gets fetched (while the curtain covers the screen).
      prefetch={false}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || !isInternal || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(hrefStr, lbl ?? (typeof children === "string" ? children : ""));
      }}
    >
      {children}
    </Link>
  );
}

/** Mount once in the root layout. */
export function RouteCurtain() {
  const p = useSyncExternalStore(subscribe, snapshot, () => "idle" as Phase);
  const pathname = usePathname();

  // The URL changed → the new page is rendering → lift the curtain.
  // (Done here rather than only in PageEnter because template.tsx doesn't always
  // remount when navigating between sibling routes, e.g. /events → /events/[slug].)
  useEffect(() => {
    if (phase !== "cover") return;
    const id = window.setTimeout(() => setPhase("reveal"), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Safety net: never leave the curtain down for more than 8s (failed navigation etc.).
  useEffect(() => {
    if (p !== "cover") return;
    const id = window.setTimeout(() => setPhase("reveal"), 8000);
    return () => window.clearTimeout(id);
  }, [p]);

  const cover = coverFor(target);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-cream"
      initial={false}
      animate={p}
      variants={{
        idle: { y: "100%", transition: { duration: 0 } },
        cover: { y: "0%", transition: { duration: COVER_MS / 1000, ease: [0.76, 0, 0.24, 1] } },
        reveal: { y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
      }}
      onAnimationComplete={(def) => {
        if (def === "reveal") setPhase("idle", "");
      }}
    >
      {/* subtle grid + yellow leading edge so it reads as part of the site, not a flash */}
      <div className="grid-bg absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-1 bg-brand" />

      {/* cover photo of the page being opened — slow zoom while it loads */}
      <motion.div
        className={[
          "relative w-[min(34rem,84vw)] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgba(11,11,12,0.5)]",
          cover.logo ? "bg-white" : "bg-ink",
        ].join(" ")}
        animate={p === "cover" ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.45, delay: p === "cover" ? 0.15 : 0, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="relative aspect-[16/10]">
          {cover.logo && <div className="grid-bg absolute inset-0" aria-hidden />}
          {target && cover.logo ? (
            /* wordmark card: the logo eases up and settles while the page loads */
            <motion.div
              key={target}
              className="absolute inset-0 grid place-items-center p-10 md:p-14"
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: p === "cover" ? 1 : 0.96, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Image src={cover.src} alt="" width={909} height={190} className="h-auto w-full max-w-[13rem] md:max-w-[15rem]" priority />
            </motion.div>
          ) : (
            target && (
              <motion.div
                key={target}
                className="absolute inset-0"
                initial={{ scale: 1.08 }}
                animate={{ scale: p === "cover" ? 1.18 : 1.08 }}
                transition={{ duration: 6, ease: "linear" }}
              >
                <Image src={cover.src} alt="" fill sizes="34rem" className="object-cover" />
              </motion.div>
            )
          )}
          <div
            className={[
              "absolute inset-x-0 bottom-0 p-5",
              cover.logo ? "" : "bg-gradient-to-t from-ink/85 to-transparent",
            ].join(" ")}
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> Opening
            </span>
            <span
              className={[
                "font-display mt-1 block text-2xl font-bold tracking-tight md:text-3xl",
                cover.logo ? "text-ink" : "text-white",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        </div>
        {/* indeterminate progress bar */}
        <div className="relative h-1 w-full overflow-hidden bg-ink">
          <motion.span
            className="absolute inset-y-0 w-1/3 rounded-full bg-brand"
            animate={p === "cover" ? { x: ["-100%", "300%"] } : { x: "-100%" }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 flex items-center gap-3"
        animate={p === "cover" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Image src="/images/logo-wordmark.png" alt="" width={909} height={190} className="h-7 w-auto opacity-80" />
      </motion.div>
    </motion.div>
  );
}

/** Used by app/(site)/template.tsx — plays the enter animation on every navigation. */
export function PageEnter({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
