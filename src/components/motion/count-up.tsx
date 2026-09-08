"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type Props = {
  /** e.g. "4M+", "10+", "5", "2" — digits are animated, the rest is kept. */
  value: string;
  className?: string;
  duration?: number;
};

/** Counts a number up from 0 when it scrolls into view. */
export function CountUp({ value, className, duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();

  const match = value.match(/^([^0-9]*)([0-9][0-9.,]*)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseFloat(match[2].replace(/,/g, "")) : NaN;
  const suffix = match?.[3] ?? "";
  const decimals = match?.[2].includes(".") ? match[2].split(".")[1].length : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || Number.isNaN(target)) return;
    if (reduce) {
      el.textContent = value;
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, target, prefix, suffix, decimals, duration, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {Number.isNaN(target) || reduce ? value : `${prefix}0${suffix}`}
    </span>
  );
}
