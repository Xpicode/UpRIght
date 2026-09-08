import Image from "next/image";
import { Award } from "lucide-react";
import { projects, recognition } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { HoverLabel } from "./motion/hover-label";
import { TransitionLink } from "./motion/route-transition";

export function Projects() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <section id="work" className="scroll-mt-24 bg-cream py-20 md:py-28">
      <div className="container-x">
        <Reveal>
          <span className="eyebrow">Selected projects</span>
          <h2 className="display mt-5 max-w-2xl text-3xl md:text-5xl">
            Built for scale, trusted by government and industry.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {/* featured */}
          <Reveal className="lg:col-span-7">
            <TransitionLink href={`/work/${featured.slug}`} label={featured.title} className="card group flex h-full flex-col overflow-hidden !border-0">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
                />
                <span className="absolute left-5 top-5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">
                  {featured.category}
                </span>
                <HoverLabel />
              </div>
              <div className="p-7 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {featured.client}
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">
                  {featured.summary}
                </p>
              </div>
            </TransitionLink>
          </Reveal>

          {/* stack */}
          <div className="grid gap-4 lg:col-span-5">
            {rest.map((p, i) => (
              <Reveal key={p.title} delay={0.05 * (i + 1)}>
                <TransitionLink href={`/work/${p.slug}`} label={p.title} className="card group flex gap-5 p-4 !border-0">
                  <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink md:h-28 md:w-36">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="144px"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="min-w-0 py-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {p.category}
                    </p>
                    <h3 className="font-display mt-1 text-lg font-bold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {p.summary}
                    </p>
                    <p className="mt-2 text-xs font-medium text-ink/60">
                      {p.client}
                    </p>
                  </div>
                </TransitionLink>
              </Reveal>
            ))}
          </div>
        </div>

        {/* recognition strip */}
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-col gap-5 rounded-[1.75rem] bg-ink p-7 text-white md:flex-row md:items-center md:p-8">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/5">
              <Image
                src="/images/photos/plaque.webp"
                alt="Plaque of Appreciation awarded to Upright"
                fill
                sizes="80px"
                className="object-cover"
              />
              <span className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-ink">
                <Award size={14} />
              </span>
            </div>
            <div className="flex-1">
              <p className="font-display text-lg font-bold">
                {recognition.title}
              </p>
              <p className="mt-1 text-sm text-white/65">{recognition.text}</p>
            </div>
            <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
              {recognition.date}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
