"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
  /** Show a soft spotlight that follows the cursor. */
  spotlight?: boolean;
  spotlightColor?: string;
};

/**
 * 3D tilt on hover + cursor spotlight. Wrap any card with it (add `group` to the
 * wrapper or a parent so the spotlight fades in on hover).
 * Renders a plain div when the user prefers reduced motion.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  spotlight = true,
  spotlightColor = "rgba(255, 227, 25, 0.22)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 200, damping: 22, mass: 0.4 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const spotX = useTransform(sx, [0, 1], [0, 100]);
  const spotY = useTransform(sy, [0, 1], [0, 100]);
  const spot = useMotionTemplate`radial-gradient(420px circle at ${spotX}% ${spotY}%, ${spotlightColor}, transparent 60%)`;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={["group relative will-change-transform", className].filter(Boolean).join(" ")}
    >
      {children}
      {spotlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundImage: spot }}
        />
      )}
    </motion.div>
  );
}
