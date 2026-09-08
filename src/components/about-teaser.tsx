"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, Check } from "lucide-react";
import { recognition, site } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { SplitText } from "./motion/split-text";
import { CountUp } from "./motion/count-up";
import { TransitionLink } from "./motion/route-transition";

// Full years since the founding date (30 Oct 2015) — ticks over on each anniversary.
const years = (() => {
  const now = new Date();
  const anniversaryPassed = now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() >= 30);
  return now.getFullYear() - site.established - (anniversaryPassed ? 0 : 1);
})();

const MILESTONES = [
  { year: "2015", text: "Founded as Upright Maritime Learning and Review Center Corp." },
  { year: "2022", text: "Recognised nationally for the One Health Pass systems at Philippine airports." },
  { year: "Today", text: "Upright Solutions and Systems Consultancy Corp. — part of the Oceanwide Group." },
];

const CAPABILITIES = [
  "System design & integration",
  "Software development",
  "Data processing",
  "Digital learning platforms",
  "Professional IT services",
];

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Rotating "seal" with the years counting up in the middle. */
function YearsBadge() {
  const reduce = useReducedMotion();
  const label = "SINCE OCTOBER 2015 · TRUSTED PARTNER · ";
  return (
    <div className="relative grid h-36 w-36 shrink-0 place-items-center">
      <motion.svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full text-brand"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        aria-hidden
      >
        <defs>
          <path id="years-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
        <text fontSize="9.5" fontWeight="700" letterSpacing="2.2" fill="currentColor">
          <textPath href="#years-ring">{label}{label}</textPath>
        </text>
      </motion.svg>
      <div className="text-center leading-none text-white">
        <span className="font-display block text-5xl font-bold tracking-tight">
          <CountUp value={String(years)} />
        </span>
        <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">Years</span>
      </div>
    </div>
  );
}

/** Home "Who we are": dark statement panel + clean, readable story panel. */
export function AboutTeaser() {
  const reduce = useReducedMotion();

  return (
    <section id="who-we-are" className="py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* ───── left: the statement (dark) ───── */}
          <Reveal className="lg:col-span-5">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-ink p-8 text-white md:p-10">
              {/* soft brand glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />

              <span className="eyebrow on-dark relative">Who we are</span>

              <h2 className="display relative mt-8 text-5xl md:text-6xl">
                <span className="block text-white">
                  <SplitText>{`${years} Years of`}</SplitText>
                </span>
                <span className="block italic text-brand">
                  <SplitText delay={0.25}>Excellence.</SplitText>
                </span>
              </h2>

              <div className="relative mt-8 flex flex-wrap items-center gap-6">
                <YearsBadge />
                <div className="flex items-center gap-3">
                  {/* Philippine flag */}
                  <svg viewBox="0 0 60 30" className="h-8 w-14 rounded-md shadow-lg" aria-hidden>
                    <rect width="60" height="15" fill="#0038a8" />
                    <rect y="15" width="60" height="15" fill="#ce1126" />
                    <path d="M0,0 L26,15 L0,30 Z" fill="#fff" />
                    <circle cx="9" cy="15" r="3.6" fill="#fcd116" />
                    <circle cx="3" cy="3.5" r="1.1" fill="#fcd116" />
                    <circle cx="3" cy="26.5" r="1.1" fill="#fcd116" />
                    <circle cx="21" cy="15" r="1.1" fill="#fcd116" />
                  </svg>
                  <div>
                    <p className="text-xs text-white/55">Based in the</p>
                    <p className="font-display text-lg font-bold tracking-tight">Philippines</p>
                  </div>
                </div>
              </div>

              {/* milestones — the line draws itself in, the dots pop in order */}
              <div className="relative mt-10 border-t border-white/10 pt-8">
                <ol className="relative space-y-6 pl-7">
                  <motion.span
                    aria-hidden
                    className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px origin-top bg-gradient-to-b from-brand via-brand/60 to-white/10"
                    initial={reduce ? false : { scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 1.2, ease: EASE }}
                  />
                  {MILESTONES.map((m, i) => (
                    <motion.li
                      key={m.year}
                      className="relative"
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-15% 0px" }}
                      transition={{ duration: 0.6, delay: 0.25 + i * 0.3, ease: EASE }}
                    >
                      <span
                        className={[
                          "absolute -left-7 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-ink",
                          i === MILESTONES.length - 1 ? "bg-brand ring-4 ring-brand/25" : "bg-white/80",
                        ].join(" ")}
                      />
                      <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brand">{m.year}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/75">{m.text}</p>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>

          {/* ───── right: the story (clean, readable) ───── */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Reveal delay={0.1} className="flex-1">
              <div className="h-full rounded-[1.75rem] border border-line bg-white p-8 md:p-10">
                <h3 className="display text-3xl md:text-4xl">
                  Delivering integrated IT solutions and{" "}
                  <span className="highlight">professional technology services</span>.
                </h3>

                <div className="mt-8 max-w-2xl space-y-5 text-[1.05rem] leading-[1.75] text-ink/75 md:text-lg">
                  <p>
                    <strong className="font-semibold text-ink">Upright Solutions and Systems Consultancy Corp.</strong>{" "}
                    was established on October 30, {site.established}, and has built over a decade of experience
                    in the IT industry. Originally known as{" "}
                    <strong className="font-semibold text-ink">Upright Maritime Learning and Review Center Corp.</strong>,
                    the company evolved to meet the growing demands of digital transformation across industries.
                  </p>
                  <p>
                    As part of the <strong className="font-semibold text-ink">Oceanwide Group</strong>, we build the
                    systems, software and learning platforms that keep enterprises and government agencies moving.
                  </p>
                </div>

                {/* capabilities — chips stagger in */}
                <ul className="mt-8 flex flex-wrap gap-2">
                  {CAPABILITIES.map((c, i) => (
                    <motion.li
                      key={c}
                      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE }}
                      whileHover={{ y: -2 }}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-cream px-3.5 py-1.5 text-sm font-medium text-ink"
                    >
                      <Check size={14} className="text-brand-deep" strokeWidth={3} /> {c}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <TransitionLink href="/about" label="About" className="btn btn-ink">
                    About us
                  </TransitionLink>
                  <TransitionLink href="/work" label="Work" className="btn btn-ghost">
                    Our projects <ArrowUpRight size={16} />
                  </TransitionLink>
                </div>
              </div>
            </Reveal>

            {/* recognition — yellow card with a shine sweep on hover */}
            <Reveal delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="shine flex flex-col gap-4 rounded-[1.75rem] bg-brand p-7 text-ink md:flex-row md:items-center md:gap-6 md:p-8"
              >
                <motion.span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-brand"
                  initial={reduce ? false : { rotate: -12, scale: 0.8, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
                >
                  <Award size={24} />
                </motion.span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70">
                    Nationally recognised · {recognition.date}
                  </p>
                  <p className="font-display mt-1 text-lg font-bold leading-snug tracking-tight md:text-xl">
                    {recognition.title}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/80 md:text-[15px]">
                    {recognition.text}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
