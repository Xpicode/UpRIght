"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

/** <li> that gets `is-active` once it's in the middle of the viewport. */
export function StepItem({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { margin: "-35% 0px -35% 0px" });
  return (
    <li ref={ref} className={[className, active ? "is-active" : ""].filter(Boolean).join(" ")}>
      {children}
    </li>
  );
}
