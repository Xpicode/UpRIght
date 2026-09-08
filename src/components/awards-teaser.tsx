"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { awards } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { TransitionLink } from "./motion/route-transition";

/**
 * Home-page awards block: two tilted, overlapping photos (plaque + certificate) that
 * drift apart on scroll and straighten on hover; copy on the right.
 */
export function AwardsTeaser() {
  const a = awards[0];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yFront = useTransform(scrollYProgress, [0, 1], [80, -60]);

  return (
    <section className="overflow-hidden bg-cream py-24 md:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* photo pair */}
        <div ref={ref} className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem] lg:col-span-6 lg:h-[34rem] lg:max-w-none">
          <motion.div
            style={reduce ? undefined : { y: yBack }}
            initial={reduce ? false : { opacity: 0, rotate: -12, x: -40 }}
            whileInView={{ opacity: 1, rotate: -6, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            whileHover={{ rotate: 0, scale: 1.02, zIndex: 3 }}
            className="absolute left-0 top-0 w-[62%] cursor-pointer overflow-hidden rounded-xl border-[6px] border-white bg-white shadow-[0_30px_60px_-20px_rgba(11,11,12,0.45)]"
          >
            <div className="relative aspect-[3/4]">
              <Image src={a.photo} alt="Plaque of Appreciation" fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            </div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: yFront }}
            initial={reduce ? false : { opacity: 0, rotate: 12, x: 40 }}
            whileInView={{ opacity: 1, rotate: 5, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            whileHover={{ rotate: 0, scale: 1.02, zIndex: 3 }}
            className="absolute bottom-0 right-0 z-[2] w-[64%] cursor-pointer overflow-hidden rounded-xl border-[6px] border-white bg-white shadow-[0_30px_60px_-20px_rgba(11,11,12,0.45)]"
          >
            <div className="relative aspect-[362/512]">
              <Image src={a.image} alt={`${a.title} certificate`} fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            </div>
          </motion.div>

          <motion.span
            aria-hidden
            className="absolute left-[58%] top-[42%] z-[4] inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-ink shadow-lg"
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={16} className="-rotate-45" />
          </motion.span>
        </div>

        {/* copy */}
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex rounded-full border border-ink px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">
              Awards &amp; recognition
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-6 text-3xl font-bold uppercase leading-tight tracking-tight md:text-4xl lg:text-5xl">
              {a.issuer.replace(" (One Health Pass)", "")}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl leading-relaxed text-muted md:text-lg">{a.description}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <TransitionLink
              href="/about#awards"
              label="About"
              className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide"
            >
              Learn more about this award <ArrowRight size={16} />
            </TransitionLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
