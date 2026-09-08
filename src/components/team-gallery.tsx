"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { teamGallery } from "@/data/site";
import { Reveal } from "./motion/reveal";

/**
 * "Meet the team" photo wall: masonry-ish grid, each tile slides in with a
 * slight rotation and reveals its caption on hover.
 */
export function TeamGallery() {
  const reduce = useReducedMotion();

  return (
    <section id="team" className="scroll-mt-24 bg-cream py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">Meet the team</span>
            <h2 className="display mt-5 max-w-2xl text-4xl md:text-5xl lg:text-6xl">
              The people behind the systems.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-muted md:text-lg">
              Developers, engineers, trainers and coordinators — a small team that would rather
              ship something reliable than something loud.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[12rem] grid-cols-2 gap-3 md:auto-rows-[15rem] md:grid-cols-4 md:gap-4">
          {teamGallery.map((p, i) => (
            <motion.figure
              key={p.src}
              className={[
                "group relative overflow-hidden rounded-[1.25rem] bg-ink md:rounded-[1.5rem]",
                p.wide ? "col-span-2" : "",
                i === 0 ? "row-span-2" : "",
              ].join(" ")}
              initial={reduce ? false : { opacity: 0, y: 40, rotate: i % 2 ? 2 : -2, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-4 pt-10 text-sm font-medium text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {p.caption}
              </figcaption>
              <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-brand opacity-0 shadow-[0_0_0_3px_rgba(11,11,12,0.6)] transition duration-500 group-hover:opacity-100" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
