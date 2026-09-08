"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  /** When provided, the reveal waits for this to become true instead of scroll position. */
  play?: boolean;
};

/** Fade + slide-up when the element scrolls into view. */
export function Reveal({ children, delay = 0, className, y = 24, play }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      {...(play === undefined
        ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } }
        : { animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y } })}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
