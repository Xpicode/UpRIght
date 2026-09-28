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

const snapshot = () => phase;

const COVER_MS = 420;
/** Hold the curtain down at least this long so the reveal never flashes past. */
const MIN_HOLD_MS = 900;
const EASE = [0.22, 1, 0.36, 1] as const;
let coverAt = 0;

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
      coverAt = Date.now();
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
    const left = Math.max(0, MIN_HOLD_MS - (Date.now() - coverAt));
    const id = window.setTimeout(() => setPhase("reveal"), left);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Safety net: never leave the curtain down for more than 8s (failed navigation etc.).
  useEffect(() => {
    if (p !== "cover") return;
    const id = window.setTimeout(() => setPhase("reveal"), 8000);
    return () => window.clearTimeout(id);
  }, [p]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] flex flex-col items-center justify-center bg-cream"
      initial={false}
      animate={p}
      variants={{
        idle: { y: "100%", transition: { duration: 0 } },
        cover: { y: "0%", transition: { duration: COVER_MS / 1000, ease: EASE } },
        reveal: { y: "-100%", transition: { duration: 0.7, ease: EASE } },
      }}
      onAnimationComplete={(def) => {
        if (def === "reveal") setPhase("idle", "");
      }}
    >
      <div className="grid-bg absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-1 bg-brand" />

      <motion.div
        className="relative flex w-[min(28rem,82vw)] flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        animate={p === "idle" ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: p === "cover" ? 0.18 : 0, ease: EASE }}
      >
        <Image
          src="/images/logo-wordmark.png"
          alt=""
          width={909}
          height={190}
          priority
          className="logo-sweep h-auto w-[11rem] md:w-[13rem]"
        />

        {/* the page name rises out from behind a mask each time */}
        <span className="mt-7 block overflow-hidden pb-1">
          <motion.span
            key={target}
            className="font-display block text-center text-3xl font-bold tracking-tight text-ink md:text-4xl"
            initial={{ y: "110%" }}
            animate={{ y: p === "idle" ? "110%" : "0%" }}
            transition={{ duration: 0.65, delay: p === "cover" ? 0.26 : 0, ease: EASE }}
          >
            {label}
          </motion.span>
        </span>

        {/* indeterminate hairline */}
        <div className="relative mt-6 h-px w-full overflow-hidden bg-ink/15">
          <motion.span
            className="absolute inset-y-0 w-1/3 bg-brand"
            animate={p === "idle" ? { x: "-100%" } : { x: ["-100%", "300%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
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
