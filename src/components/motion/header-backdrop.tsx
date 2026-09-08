"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Props = {
  src: string;
  alt?: string;
  /** Where the photo should be anchored when cropped (CSS object-position). */
  position?: string;
  /** Slide the whole photo sideways (e.g. "14%") to keep its subject clear of the headline. */
  shiftX?: string;
  /** Dark headers: overlays fade to ink instead of white. */
  dark?: boolean;
};

/**
 * Photo backdrop for page headers: slow Ken Burns drift, parallax on scroll,
 * a passing light sweep, and white gradients so the headline stays readable.
 */
export function HeaderBackdrop({ src, alt = "", position = "center", shiftX = "0%", dark = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={["pointer-events-none absolute inset-0 -z-10 overflow-hidden", dark ? "bg-ink" : "bg-white"].join(" ")}
    >
      {/* parallax layer */}
      <motion.div style={reduce ? undefined : { y, scale }} className="absolute -inset-[6%]">
        {/* Ken Burns: gentle zoom + sideways drift, back and forth */}
        <motion.div
          className="absolute inset-y-0"
          style={{ left: shiftX, right: `calc(${shiftX} * -1)` }}
          initial={reduce ? false : { scale: 1.1, x: "1.5%" }}
          animate={reduce ? undefined : { scale: 1, x: "-1.5%" }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
            style={{ objectPosition: position }}
          />
        </motion.div>
      </motion.div>

      {/* readability: strong tint on the text side, soft haze on the right, fade into the page below */}
      {dark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink" />
        </>
      ) : (
        <>
          {/* slight darkening so the photo reads as a photo, not a glow */}
          <div className="absolute inset-0 bg-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />
        </>
      )}

      {/* passing light sweep */}
      {!reduce && (
        <motion.div
          className={[
            "absolute -inset-y-1/2 w-[22vw] rotate-12 bg-gradient-to-r from-transparent to-transparent blur-2xl",
            dark ? "via-brand/15" : "via-white/35",
          ].join(" ")}
          initial={{ x: "-30vw" }}
          animate={{ x: "130vw" }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
        />
      )}
    </div>
  );
}
