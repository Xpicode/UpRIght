"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowDown, Award } from "lucide-react";
import { clients, site, stats } from "@/data/site";
import { HeaderBackdrop } from "./motion/header-backdrop";
import { Reveal } from "./motion/reveal";
import { SplitText } from "./motion/split-text";
import { CountUp } from "./motion/count-up";
import { Magnetic } from "./motion/magnetic";
import { useIntroDone } from "./motion/intro";
import { TransitionLink } from "./motion/route-transition";

export function Hero() {
  const reduce = useReducedMotion();
  const play = useIntroDone();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax: collage tiles drift at different speeds as you scroll.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBig = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [80, -100]);
  const yCard = useTransform(scrollYProgress, [0, 1], [120, -40]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section id="top" className="relative overflow-hidden pt-32 md:pt-40">
      {/* backdrop — animated photo behind the headline area only, fading into the page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[52rem] md:h-[58rem]">
        <HeaderBackdrop src="/images/photos/building.webp" position="right 40%" />
      </div>
      <div className="blob pointer-events-none absolute -right-32 top-10 -z-10 h-[34rem] w-[34rem] bg-brand/10 blur-[110px]" />

      <div className="container-x">
        <div className="max-w-4xl">
          <motion.span
            className="eyebrow"
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={play ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            IT solutions · Philippines · since {site.established}
          </motion.span>

          <SplitText
            as="h1"
            play={play}
            delay={0.2}
            className="display mt-6 text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            Software and systems that <span className="highlight">quietly</span>{" "}
            keep your business moving.
          </SplitText>

          <Reveal delay={0.7} play={play}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
              Upright designs, builds and supports custom software,
              integrations, learning platforms and infrastructure for
              enterprises and government — from Manila and Cavite to the rest of
              Southeast Asia.
            </p>
          </Reveal>

          <Reveal delay={0.85} play={play}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <TransitionLink href="/contact" label="Contact" className="btn btn-ink btn-swap">
                  <span data-text="Talk to our team">
                    <span className="label">Talk to our team</span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </TransitionLink>
              </Magnetic>
              <Magnetic>
                <TransitionLink href="/work" label="Work" className="btn btn-ghost btn-swap">
                  <span data-text="See our work">
                    <span className="label">See our work</span>
                  </span>
                </TransitionLink>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* photo collage with parallax */}
        <div
          ref={ref}
          className="mt-14 grid gap-4 md:mt-20 md:h-[34rem] md:grid-cols-12 md:grid-rows-2"
        >
          <motion.div
            style={reduce ? undefined : { y: yBig }}
            className="md:col-span-8 md:row-span-2"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 60, scale: 0.98 }}
              animate={play ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.98 }}
              transition={{
                duration: 0.9,
                delay: 0.5,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="relative aspect-[16/10] h-full overflow-hidden rounded-[1.75rem] bg-ink md:aspect-auto"
            >
              <motion.div
                style={reduce ? undefined : { scale: imgScale }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/photos/conference.webp"
                  alt="The Upright team on site at the Crew Forward Conference"
                  fill
                  priority
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  On the ground
                </p>
                <p className="font-display mt-1 text-xl font-bold text-white md:text-2xl">
                  A team that shows up — from conference floors to server rooms.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: ySmall }}
            className="md:col-span-4"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{
                duration: 0.9,
                delay: 0.65,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="shine relative aspect-[4/3] h-full overflow-hidden rounded-[1.75rem] bg-ink md:aspect-auto"
            >
              <Image
                src="/images/photos/phone.webp"
                alt="Upright mobile application"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: yCard }}
            className="md:col-span-4"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{
                duration: 0.9,
                delay: 0.8,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="relative h-full overflow-hidden rounded-[1.75rem] bg-ink p-6 text-white"
            >
              <div className="pulse-ring absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/30 blur-3xl" />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                <Award size={14} className="text-brand" /> Flagship
              </div>
              <p className="font-display mt-2 text-2xl font-bold">
                One Health Pass
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Border health verification that processed ~4 million travellers
                and helped the Philippines reopen to the world.
              </p>
              <a
                href="#work"
                className="link-underline mt-4 inline-block text-sm font-semibold text-brand"
              >
                Read the story →
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* stats — count up on scroll */}
        <Reveal delay={0.1}>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="bg-white p-6 md:p-8"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <dt className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  <CountUp value={s.value} />
                </dt>
                <dd className="mt-2 text-sm leading-snug text-muted">
                  {s.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* client marquee — two rows, opposite directions */}
      <div className="mt-14 border-y border-line bg-cream/60 py-6 md:mt-20">
        <div className="container-x mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Trusted by
          </p>
          <ArrowDown size={16} className="bounce-y text-muted" aria-hidden />
        </div>
        <div className="space-y-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          {[false, true].map((reverse) => (
            <div
              key={String(reverse)}
              className={[
                "marquee items-center",
                reverse ? "marquee-reverse" : "",
              ].join(" ")}
            >
              {[...clients, ...clients].map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  className="flex h-12 items-center opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                >
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={140}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
