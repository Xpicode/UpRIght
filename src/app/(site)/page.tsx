import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { ServicesTeaser } from "@/components/services-teaser";
import { AboutTeaser } from "@/components/about-teaser";
import { Process } from "@/components/process";
import { CtaBand } from "@/components/cta-band";
import { TeamTeaser } from "@/components/team-teaser";
import { AwardsTeaser } from "@/components/awards-teaser";
import { Offices } from "@/components/offices";
import { Reveal } from "@/components/motion/reveal";
import { HoverLabel } from "@/components/motion/hover-label";
import { TransitionLink } from "@/components/motion/route-transition";
import { projects } from "@/data/site";

export default function Home() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const more = projects.filter((p) => p !== featured).slice(0, 2);

  return (
    <>
      <Hero />
      <AboutTeaser />
      <ServicesTeaser />

      {/* featured work */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <span className="eyebrow">Selected work</span>
              <h2 className="display mt-5 max-w-2xl text-4xl md:text-5xl lg:text-6xl">
                Built for scale, trusted by government and industry.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <TransitionLink href="/work" label="Work" className="btn btn-ghost">
                All projects <ArrowUpRight size={16} />
              </TransitionLink>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <TransitionLink href={`/work/${featured.slug}`} label={featured.title} className="card group flex h-full flex-col overflow-hidden !border-0">
                <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">
                    {featured.category}
                  </span>
                  <HoverLabel />
                </div>
                <div className="p-7 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{featured.client}</p>
                  <h3 className="font-display mt-2 text-2xl font-bold tracking-tight md:text-3xl">{featured.title}</h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">{featured.summary}</p>
                </div>
              </TransitionLink>
            </Reveal>

            <div className="grid gap-4 lg:col-span-4">
              {more.map((p, i) => (
                <Reveal key={p.title} delay={0.08 * (i + 1)}>
                  <TransitionLink href={`/work/${p.slug}`} label={p.title} className="card group flex h-full flex-col overflow-hidden !border-0">
                    <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                      <Image src={p.image} alt={p.title} fill sizes="33vw" className="object-cover transition duration-[1.2s] group-hover:scale-[1.05]" />
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{p.category}</p>
                      <h3 className="font-display mt-1 text-lg font-bold tracking-tight">{p.title}</h3>
                    </div>
                  </TransitionLink>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Process />
      <TeamTeaser />
      <AwardsTeaser />
      <Offices />
      <CtaBand />
    </>
  );
}
