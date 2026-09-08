import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { events } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { TransitionLink } from "./motion/route-transition";

/** Three-up event cards (image, date, title, reading time, read more) → /events/[slug]. */
export function EventCards() {
  // Chronological, oldest first — like the original site.
  const list = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-5 md:grid-cols-3">
          {list.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.1}>
              <TransitionLink
                href={`/events/${e.slug}`}
                label={e.title}
                className="card group flex h-full flex-col overflow-hidden !border-0"
              >
                <div className="relative aspect-square overflow-hidden bg-ink">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition duration-[1.3s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 font-display text-xs font-bold text-ink">
                    {e.year}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep">
                    {e.date}
                  </p>
                  <h3 className="font-display mt-3 text-xl font-bold uppercase leading-tight tracking-tight md:text-2xl">
                    {e.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm text-muted">{e.summary}</p>
                </div>

                <div className="flex items-center justify-between border-t border-line px-6 py-4 text-sm md:px-7">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                    <Clock size={13} /> Reading time: {e.readingTime} min
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wide text-ink transition group-hover:text-brand-deep">
                    Read more
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </div>
              </TransitionLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
