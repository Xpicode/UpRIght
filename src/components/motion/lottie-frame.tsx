"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "framer-motion";
import type { LottieRefCurrentProps } from "lottie-react";

// Lottie needs the DOM, so it's loaded on the client only.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Props = {
  /** File under /public/animations, e.g. "software" → /animations/software.json */
  name: string;
  /** Index label shown in the corner, e.g. "01". */
  index?: string;
  /** Optional colour shift in degrees (CSS hue-rotate) — used to move the yellow-toned
   *  illustrations to the indigo palette of the others. */
  hue?: number;
  className?: string;
};

/**
 * Framed Lottie illustration — the bracketed "blueprint" card from the original
 * services page. The JSON is fetched on demand (they're big) and playback only
 * runs while the frame is on screen.
 */
export function LottieFrame({ name, index, hue, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [data, setData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/animations/${name}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [name]);

  useEffect(() => {
    const l = lottieRef.current;
    if (!l) return;
    if (reduce) {
      l.goToAndStop(0, true);
      return;
    }
    if (inView) l.play();
    else l.pause();
  }, [inView, reduce, data]);

  return (
    <div
      ref={ref}
      className={[
        "group relative overflow-hidden rounded-[1.75rem] border border-line bg-[#f7f8fa] p-5 shadow-[0_24px_48px_-32px_rgba(11,11,12,0.35)] md:p-7",
        className ?? "",
      ].join(" ")}
    >
      {/* faint grid only — no colour wash, so the illustration's own palette reads cleanly */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

      {/* inner bordered stage with corner brackets */}
      <div className="relative aspect-[4/3] rounded-xl border border-ink/15 bg-white">
        <span className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-ink/70" />
        <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-ink/70" />

        <div
          className="absolute inset-0 flex items-center justify-center p-6 md:p-10"
          style={hue ? { filter: `hue-rotate(${hue}deg) saturate(0.9)` } : undefined}
        >
          {data ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={data}
              loop
              autoplay={false}
              className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            />
          ) : failed ? (
            <span className="text-xs text-muted">Illustration unavailable</span>
          ) : (
            <span className="h-10 w-10 animate-pulse rounded-full bg-brand/40" />
          )}
        </div>
      </div>

      {index && (
        <span className="absolute bottom-3 right-5 font-display text-xs font-bold tracking-widest text-muted md:bottom-4 md:right-7">
          {index}
        </span>
      )}
    </div>
  );
}
