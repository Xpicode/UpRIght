"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Wraps the process steps: a yellow track on the left fills as you scroll
 * through the list, and each step number turns yellow when it's in view.
 */
export function StepTrack({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="relative lg:col-span-7">
      <div className="absolute -left-6 top-0 hidden h-full w-[3px] rounded-full bg-line lg:block">
        <motion.div style={{ scaleY }} className="h-full w-full origin-top rounded-full bg-brand" />
      </div>
      <ol ref={ref} className={className?.replace("lg:col-span-7", "")}>
        {children}
      </ol>
    </div>
  );
}
