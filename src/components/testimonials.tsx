"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/site";
import { Reveal } from "./motion/reveal";

type Testimonial = (typeof testimonials)[number] & { photo?: string };

/** Round client photo with a brand ring; falls back to initials when there is no photo. */
function Avatar({ t, isActive }: { t: Testimonial; isActive: boolean }) {
  // If the picture can't load (offline, blocked host) show initials instead of a broken image.
  const [broken, setBroken] = useState(false);
  const photo = broken ? undefined : t.photo;
  const initials =
    t.name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("") || "“";
  return (
    <motion.span
      className={[
        "relative inline-flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full ring-[3px] ring-offset-2",
        isActive ? "ring-brand ring-offset-ink" : "ring-line ring-offset-white",
        photo ? "" : isActive ? "bg-brand text-ink" : "bg-cream text-ink",
      ].join(" ")}
      animate={{ scale: isActive ? 1 : 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {photo ? (
        <Image src={photo} alt={t.name || "Client"} fill sizes="64px" className="object-cover" onError={() => setBroken(true)} />
      ) : (
        <span className="font-display text-lg font-bold">{initials}</span>
      )}
    </motion.span>
  );
}

/**
 * Fanned testimonial carousel: the active card sits centred, dark and upright;
 * the others spread out to the sides with a slight tilt, like a hand of cards.
 * Arrows, keyboard ←/→, drag, and a gentle auto-advance (paused on hover).
 */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;

  const go = useCallback((d: number) => setActive((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (paused || reduce || n < 2) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, reduce, go, n]);

  useEffect(() => {
    // Only react to arrow keys while the pointer is over the carousel, so the
    // keys keep scrolling the page everywhere else.
    if (!paused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, paused]);

  return (
    <section
      className="overflow-hidden bg-cream py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-x text-center">
        <Reveal>
          <h2 className="display text-4xl md:text-5xl lg:text-6xl">Client Testimonials</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted md:text-xl">
            Trusted by organisations across the Philippines.
          </p>
        </Reveal>
      </div>

      {/* card fan */}
      <Reveal delay={0.2}>
        <div className="relative mx-auto mt-14 h-[26rem] w-full max-w-7xl md:h-[24rem]">
          <motion.div
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            {testimonials.map((t, i) => {
              // signed distance from the active card, wrapped so the fan is symmetric
              let d = i - active;
              if (d > n / 2) d -= n;
              if (d < -n / 2) d += n;
              const isActive = d === 0;
              const abs = Math.abs(d);
              const visible = abs <= 3;

              return (
                <motion.article
                  key={i}
                  className={[
                    "absolute left-1/2 top-1/2 w-[19rem] cursor-pointer select-none rounded-2xl p-7 shadow-[0_30px_60px_-30px_rgba(11,11,12,0.45)] md:w-[22rem]",
                    isActive ? "bg-ink text-white" : "border border-line bg-white text-ink",
                  ].join(" ")}
                  style={{ zIndex: 10 - abs, pointerEvents: visible ? "auto" : "none" }}
                  animate={{
                    x: `calc(-50% + ${d * (reduce ? 0 : 1) * 15.5}rem)`,
                    y: `calc(-50% + ${isActive ? -1.5 : abs % 2 ? 1.5 : 0}rem)`,
                    rotate: isActive ? 0 : d * -3,
                    scale: isActive ? 1.06 : 1 - abs * 0.04,
                    opacity: visible ? (isActive ? 1 : 1 - abs * 0.18) : 0,
                  }}
                  transition={{ type: "spring", stiffness: 210, damping: 26 }}
                  onClick={() => !isActive && setActive(i)}
                  aria-hidden={!isActive}
                >
                  <div className="flex items-center gap-4">
                    <Avatar t={t} isActive={isActive} />
                    <div className="min-w-0 flex-1">
                      {/* Attribution is hidden while the entries are placeholders — fill in
                          `name` (and role/company) in src/data/site.ts and it shows up here. */}
                      {t.name && (
                        <>
                          <p className="font-display truncate text-base font-bold tracking-tight">{t.name}</p>
                          <p className={["truncate text-xs", isActive ? "text-white/60" : "text-muted"].join(" ")}>
                            {t.role}
                            {t.company ? ` · ${t.company}` : ""}
                          </p>
                        </>
                      )}
                    </div>
                    <Quote size={26} className={isActive ? "text-brand" : "text-brand-deep"} />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={isActive ? "on" : "off"}
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: 1 }}
                      className="mt-5 text-lg leading-snug md:text-xl"
                    >
                      &ldquo;{t.quote}&rdquo;
                    </motion.p>
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </Reveal>

      {/* controls */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
          className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 bg-white transition hover:bg-brand"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-1.5 px-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                "h-2 rounded-full transition-all",
                i === active ? "w-6 bg-ink" : "w-2 bg-ink/25 hover:bg-ink/50",
              ].join(" ")}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => go(1)}
          className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 bg-white transition hover:bg-brand"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
