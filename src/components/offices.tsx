"use client";

import dynamic from "next/dynamic";
import { site } from "@/data/site";
import { Reveal } from "./motion/reveal";

// MapLibre touches `window`, so load it on the client only.
const OfficesMap = dynamic(() => import("./offices-map").then((m) => m.OfficesMap), {
  ssr: false,
  loading: () => (
    <div className="h-[34rem] animate-pulse rounded-[1.75rem] bg-ink md:h-[38rem]" />
  ),
});

export function Offices() {
  return (
    <section id="offices" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">Where we are</span>
            <h2 className="display mt-5 max-w-2xl text-4xl md:text-5xl lg:text-6xl">
              Two offices. One team on call.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-muted md:text-lg">
              Headquartered in Manila with a training site in Bacoor, Cavite. Drop by, or
              we&apos;ll come to you.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-12">
          <OfficesMap />
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {site.offices.map((o, i) => (
            <Reveal key={o.id} delay={0.05 * i}>
              <a
                href={o.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="card group flex items-start gap-4 p-5"
              >
                <span className="office-marker is-active shrink-0 !h-10 !w-10">
                  <span className="office-marker__ring" />
                  <span className="office-marker__dot !shadow-none" />
                </span>
                <span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {o.label}
                  </span>
                  <span className="font-display mt-0.5 block text-lg font-bold tracking-tight">
                    {o.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{o.address}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
