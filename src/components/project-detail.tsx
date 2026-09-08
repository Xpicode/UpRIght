"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, Check } from "lucide-react";
import type { Project } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { SplitText } from "./motion/split-text";
import { TiltCard } from "./motion/tilt-card";
import { TransitionLink } from "./motion/route-transition";

/**
 * Dark project page: screenshot pinned on the left (parallax + tilt), copy on the right,
 * "Back to main page" tab in the top-right corner — same layout as the original site.
 */
export function ProjectDetail({ project: p, next }: { project: Project; next: Project }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={ref} className="relative bg-[#1c1c1f] text-white">
      {/* corner tab */}
      <motion.div
        className="fixed right-0 top-[4.75rem] z-40 md:top-[5.5rem]"
        initial={reduce ? false : { y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <TransitionLink
          href="/work"
          label="Work"
          className="group inline-flex items-center gap-2 bg-brand px-6 py-5 text-xs font-bold uppercase tracking-[0.18em] text-ink shadow-lg transition hover:bg-brand-deep md:px-7 md:py-4 rounded-l-2xl"
        >
          <ArrowLeft size={14} className="transition group-hover:-translate-x-1" /> Back to main page
        </TransitionLink>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { top: glowY }}
        className="pointer-events-none absolute left-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[140px]"
      />

      <div className="container-x grid gap-12 pb-24 pt-32 md:pt-40 lg:grid-cols-12 lg:gap-16">
        {/* image */}
        <div className="lg:col-span-6">
          <motion.div style={reduce ? undefined : { y: imgY }} className="lg:sticky lg:top-32">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -40, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <TiltCard className="rounded-[1.25rem]" max={5} spotlightColor="rgba(255,227,25,0.15)">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-white/10 bg-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </TiltCard>
            </motion.div>
            <Reveal delay={0.6}>
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Client</dt>
                  <dd className="mt-1 font-medium">{p.client}</dd>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                    {p.partner ? "Partner" : "Category"}
                  </dt>
                  <dd className="mt-1 font-medium">{p.partner ?? p.category}</dd>
                </div>
              </dl>
            </Reveal>
          </motion.div>
        </div>

        {/* copy */}
        <div className="lg:col-span-6">
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-brand"
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {p.kind}
          </motion.p>
          <SplitText as="h1" delay={0.35} className="display mt-4 text-4xl uppercase sm:text-5xl lg:text-6xl xl:text-7xl">
            {p.title}
          </SplitText>
          <Reveal delay={0.7}>
            <p className="mt-7 text-xl leading-relaxed text-white/85 md:text-2xl">{p.summary}</p>
          </Reveal>

          <Reveal delay={0.8}>
            <h2 className="font-display mt-14 text-2xl font-bold uppercase tracking-tight md:text-3xl">
              Project overview
            </h2>
          </Reveal>
          {p.description.map((d, i) => (
            <Reveal key={d} delay={0.85 + i * 0.05}>
              <p className="mt-5 leading-relaxed text-white/65 md:text-lg">{d}</p>
            </Reveal>
          ))}

          <Reveal delay={0.1}>
            <h2 className="font-display mt-14 text-2xl font-bold uppercase tracking-tight md:text-3xl">
              Key highlights
            </h2>
            <ul className="mt-6 space-y-3">
              {p.highlights.map((h, i) => (
                <motion.li
                  key={h}
                  className="flex items-start gap-3 text-white/85"
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
                    <Check size={13} />
                  </span>
                  {h}
                </motion.li>
              ))}
            </ul>
          </Reveal>

          {p.recognition && (
            <Reveal delay={0.1}>
              <TransitionLink
                href="/about#awards"
                label="About"
                className="mt-12 flex items-start gap-4 rounded-2xl border border-brand/30 bg-brand/10 p-5 transition hover:bg-brand/15"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-ink">
                  <Award size={18} />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Recognition</span>
                  <span className="mt-1 block text-sm text-white/85">{p.recognition}</span>
                </span>
              </TransitionLink>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <TransitionLink
              href={`/work/${next.slug}`}
              label={next.title}
              className="group mt-14 flex items-center gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
                <Image src={next.image} alt={next.title} fill sizes="96px" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">Next project</p>
                <p className="font-display truncate text-lg font-bold">{next.title}</p>
              </div>
              <ArrowRight className="shrink-0 text-brand transition group-hover:translate-x-1" />
            </TransitionLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
