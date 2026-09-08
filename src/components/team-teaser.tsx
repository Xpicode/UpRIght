"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { teamGallery, teamStats } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { CountUp } from "./motion/count-up";
import { TransitionLink } from "./motion/route-transition";

type Card =
  | { type: "photo"; src: string; alt: string; name: string; role: string }
  | { type: "stat"; value: string; label: string; tone: "brand" | "ink" | "cream" };

const TONES = {
  brand: "bg-gradient-to-br from-brand to-brand-deep text-ink",
  ink: "bg-gradient-to-br from-ink-soft to-ink text-white",
  cream: "bg-gradient-to-br from-white to-cream text-ink border border-line",
} as const;

/**
 * Home "Meet the Team": a staggered horizontal strip that mixes photo cards
 * (gradient overlay, name, role pill) with stat cards, alternating high/low
 * like the original site. Scrolls sideways on its own, pauses on hover.
 */
export function TeamTeaser() {
  const reduce = useReducedMotion();

  // Interleave: photo, stat, photo, photo, stat …
  const cards: Card[] = [];
  let s = 0;
  teamGallery.forEach((p, i) => {
    cards.push({ type: "photo", src: p.src, alt: p.alt, name: p.name ?? "Team Member", role: p.role ?? p.caption });
    if (i % 2 === 0 && teamStats[s]) {
      cards.push({ type: "stat", ...teamStats[s], tone: (["brand", "ink", "cream"] as const)[s % 3] });
      s++;
    }
  });
  const strip = [...cards, ...cards];

  return (
    <section id="meet-the-team" className="overflow-hidden py-24 md:py-32">
      <div className="container-x text-center">
        <Reveal>
          <h2 className="display text-4xl md:text-5xl lg:text-6xl">Meet the Team</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-lg text-muted md:text-xl">Dedicated professionals working for your success.</p>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
          <div className={["marquee team-strip items-start gap-5 px-4 py-6", reduce ? "!animate-none" : ""].join(" ")}>
            {strip.map((c, i) => {
              const lift = i % 2 === 0 ? "mt-0" : "mt-20 md:mt-28";
              if (c.type === "stat") {
                return (
                  <motion.div
                    key={`s-${i}`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={[
                      "flex h-[21rem] w-[17rem] shrink-0 flex-col items-center justify-center rounded-[1.5rem] p-8 text-center shadow-[0_24px_48px_-28px_rgba(11,11,12,0.5)]",
                      TONES[c.tone],
                      lift,
                    ].join(" ")}
                  >
                    <span className="font-display text-6xl font-bold tracking-tight">
                      <CountUp value={c.value} />
                    </span>
                    <span className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] opacity-80">
                      {c.label}
                    </span>
                  </motion.div>
                );
              }
              return (
                <motion.figure
                  key={`p-${i}`}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={[
                    "group relative h-[31rem] w-[17rem] shrink-0 overflow-hidden rounded-[1.5rem] bg-ink shadow-[0_24px_48px_-28px_rgba(11,11,12,0.5)]",
                    lift,
                  ].join(" ")}
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    // Tall portrait crop of a landscape photo: the browser needs a source
                    // roughly 2× the card width to cover the height sharply.
                    sizes="(min-width: 768px) 40vw, 90vw"
                    quality={85}
                    loading={i < cards.length ? "eager" : "lazy"}
                    className="object-cover transition duration-[1.4s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="font-display text-2xl font-bold italic tracking-tight">{c.name}</p>
                    <span className="mt-2 inline-block rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                      {c.role}
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 text-center">
          <TransitionLink href="/about#team" label="About" className="btn btn-ghost">
            Meet everyone <ArrowUpRight size={16} />
          </TransitionLink>
        </div>
      </Reveal>
    </section>
  );
}
