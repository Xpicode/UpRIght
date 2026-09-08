"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * A round "View" badge that follows the cursor while hovering the parent
 * (parent must be `relative` + `group`). Hidden on touch / reduced motion.
 */
export function HoverLabel({ text = "View" }: { text?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 26, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 300, damping: 26, mass: 0.3 });

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent || reduce) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const move = (e: MouseEvent) => {
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);
    parent.addEventListener("mousemove", move);
    parent.addEventListener("mouseenter", enter);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mousemove", move);
      parent.removeEventListener("mouseenter", enter);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [reduce, x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ x: sx, y: sy }}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="pointer-events-none absolute left-0 top-0 z-10 -ml-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-brand text-xs font-bold uppercase tracking-wider text-ink shadow-xl"
    >
      {text} <ArrowUpRight size={14} className="ml-0.5" />
    </motion.div>
  );
}
