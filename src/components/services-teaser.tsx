import { Code2, Layers, GraduationCap, Compass, Cpu, ArrowUpRight } from "lucide-react";
import { services } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { TiltCard } from "./motion/tilt-card";
import { TransitionLink } from "./motion/route-transition";

const icons = { code: Code2, layers: Layers, graduation: GraduationCap, compass: Compass, cpu: Cpu };

/** Compact services strip for the home page — the full breakdown lives on /services. */
export function ServicesTeaser() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">What we do</span>
            <h2 className="display mt-5 max-w-2xl text-4xl md:text-5xl lg:text-6xl">
              Five service lines. One accountable team.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <TransitionLink href="/services" label="Services" className="btn btn-ghost">
              All services <ArrowUpRight size={16} />
            </TransitionLink>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.id} delay={i * 0.07}>
                <TiltCard className="h-full rounded-[1.5rem]" max={6}>
                  <TransitionLink
                    href={`/services#${s.id}`}
                    label="Services"
                    className="card group flex h-full flex-col p-6 !rounded-[1.5rem]"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cream text-ink transition duration-500 group-hover:-rotate-6 group-hover:bg-brand">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-display mt-5 text-lg font-bold tracking-tight">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.tagline}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-ink/70 transition group-hover:text-ink">
                      Learn more
                      <ArrowUpRight size={14} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </TransitionLink>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
