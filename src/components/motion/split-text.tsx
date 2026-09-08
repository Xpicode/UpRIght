"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type Props = {
  /** Plain string or an array mixing strings and React nodes (e.g. a highlighted word). */
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Seconds between each word. */
  stagger?: number;
  once?: boolean;
  /** When provided, plays when true instead of when scrolled into view. */
  play?: boolean;
};

const container: Variants = {
  hidden: {},
  show: (custom: { delay: number; stagger: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const word: Variants = {
  hidden: { y: "110%", rotate: 3, opacity: 0 },
  show: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/**
 * Splits text into words and slides each one up out of a clipping mask —
 * a "curtain" reveal. Non-string children (like a highlighted <span>) stay intact.
 */
export function SplitText({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
  play,
}: Props) {
  const reduce = useReducedMotion();
  // Widen the tag type: three.js's JSX augmentation can otherwise collapse the
  // generic ElementType children prop to `never`.
  const T = Tag as ElementType<{ className?: string; children?: ReactNode }>;

  if (reduce) {
    return <T className={className}>{children}</T>;
  }

  const nodes = Array.isArray(children) ? children : [children];
  const parts: ReactNode[] = [];
  nodes.forEach((n) => {
    if (typeof n === "string") {
      n.split(/\s+/).forEach((w) => {
        if (w) parts.push(w);
      });
    } else if (n != null) {
      parts.push(n);
    }
  });

  return (
    <T className={className}>
      <motion.span
        style={{ display: "inline" }}
        variants={container}
        custom={{ delay, stagger }}
        initial="hidden"
        {...(play === undefined
          ? { whileInView: "show", viewport: { once, margin: "-10% 0px" } }
          : { animate: play ? "show" : "hidden" })}
      >
        {parts.map((p, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
              <motion.span className="inline-block" variants={word}>
                {p}
              </motion.span>
            </span>
            {i < parts.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </T>
  );
}
