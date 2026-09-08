"use client";

import Image from "next/image";
import { Calendar, MapPin, Users, Check } from "lucide-react";
import { events } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { CountUp } from "./motion/count-up";
import { HoverLabel } from "./motion/hover-label";
import { TransitionLink } from "./motion/route-transition";
import { ArrowRight } from "lucide-react";
import { Lightbox } from "./motion/lightbox";

/** Featured event (first in the list) — big photo, stats, gallery strip. */
export function EventFeature() {
  const e = events[0];
  const photos = [
    { src: e.image, alt: e.title, caption: `${e.title} — ${e.date}` },
    ...(e.gallery ?? []).map((g, i) => ({
      src: g,
      alt: `${e.title} — photo ${i + 1}`,
      caption: e.title,
    })),
  ];
  return (
    <Lightbox photos={photos}>
      {(open) => (
        <section className="bg-cream py-20 md:py-28">
          <div className="container-x">
            <Reveal>
              <span className="eyebrow">Featured event</span>
              <h2 className="display mt-5 max-w-2xl text-3xl md:text-5xl">
                Inside {e.title}.
              </h2>
            </Reveal>
            <div className="mt-12" />
            <div className="grid gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <button
                  type="button"
                  onClick={() => open(0)}
                  aria-label={`View photo: ${e.title}`}
                  className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[1.75rem] bg-ink text-left"
                >
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover transition duration-[1.4s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]"
                  />
                  <HoverLabel text="Look" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6 md:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                      Featured
                    </p>
                    <h2 className="font-display mt-1 text-2xl font-bold text-white md:text-4xl">
                      {e.title}
                    </h2>
                  </div>
                </button>
              </Reveal>

              <div className="flex flex-col gap-4 lg:col-span-5">
                <Reveal delay={0.1}>
                  <div className="rounded-[1.75rem] border border-line bg-white p-7">
                    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                      <li className="inline-flex items-center gap-1.5">
                        <Calendar size={15} className="text-brand-deep" />{" "}
                        {e.date}
                      </li>
                      {e.location && (
                        <li className="inline-flex items-center gap-1.5">
                          <MapPin size={15} className="text-brand-deep" />{" "}
                          {e.location}
                        </li>
                      )}
                      <li className="inline-flex items-center gap-1.5">
                        <Users size={15} className="text-brand-deep" /> Led by{" "}
                        {e.leadBy}
                      </li>
                    </ul>
                    <p className="mt-4 leading-relaxed text-ink/80">
                      {e.summary}
                    </p>
                    {e.description.map((d) => (
                      <p
                        key={d}
                        className="mt-3 text-sm leading-relaxed text-muted"
                      >
                        {d}
                      </p>
                    ))}
                    <TransitionLink
                      href={`/events/${e.slug}`}
                      label={e.title}
                      className="link-underline mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
                    >
                      Read the full story <ArrowRight size={15} />
                    </TransitionLink>
                  </div>
                </Reveal>

                {e.stats && (
                  <Reveal delay={0.2}>
                    <dl className="grid grid-cols-4 gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line">
                      {e.stats.map((s) => (
                        <div key={s.label} className="bg-white p-4 text-center">
                          <dt className="font-display text-2xl font-bold md:text-3xl">
                            <CountUp value={s.value} />
                          </dt>
                          <dd className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted">
                            {s.label}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                )}
              </div>
            </div>

            {e.highlights && (
              <Reveal delay={0.15}>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {e.highlights.map((h, i) => (
                    <li
                      key={h}
                      className="card flex items-start gap-3 p-5 text-sm"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
                        <Check size={13} />
                      </span>
                      <span>
                        <span className="font-display font-bold text-brand-deep">
                          0{i + 1}
                        </span>{" "}
                        · {h}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {e.gallery && (
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {e.gallery.map((g, i) => (
                  <Reveal key={g} delay={0.06 * i}>
                    <button
                      type="button"
                      onClick={() => open(i + 1)}
                      aria-label={`View photo ${i + 1}`}
                      className="shine group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[1.25rem] bg-ink"
                    >
                      <Image
                        src={g}
                        alt={`${e.title} — photo ${i + 1}`}
                        fill
                        sizes="25vw"
                        className="object-cover transition duration-[1.2s] group-hover:scale-[1.06]"
                      />
                      <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/20" />
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </Lightbox>
  );
}
