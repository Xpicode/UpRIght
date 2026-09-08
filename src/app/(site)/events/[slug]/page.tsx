import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Users, Check } from "lucide-react";
import { events } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { CountUp } from "@/components/motion/count-up";
import { TransitionLink } from "@/components/motion/route-transition";
import { CtaBand } from "@/components/cta-band";
import { PhotoGrid } from "@/components/photo-grid";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const idx = events.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const e = events[idx];
  const next = events[(idx + 1) % events.length];

  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink pt-32 text-white">
        <Image src={e.image} alt={e.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="container-x relative pb-14 md:pb-20">
          <Reveal>
            <TransitionLink href="/events" label="Events" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={16} /> All events
            </TransitionLink>
          </Reveal>
          <SplitText as="h1" delay={0.1} className="display mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-7xl">
            {e.title}
          </SplitText>
          <Reveal delay={0.4}>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
              <li className="inline-flex items-center gap-1.5"><Calendar size={15} className="text-brand" /> {e.date}</li>
              {e.location && <li className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-brand" /> {e.location}</li>}
              <li className="inline-flex items-center gap-1.5"><Clock size={15} className="text-brand" /> {e.readingTime} min read</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* body */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl">{e.summary}</p>
            </Reveal>
            {e.description.map((d, i) => (
              <Reveal key={d} delay={0.05 * (i + 1)}>
                <p className="mt-6 leading-relaxed text-muted md:text-lg">{d}</p>
              </Reveal>
            ))}
            {e.highlights && (
              <Reveal delay={0.1}>
                <h2 className="font-display mt-10 text-2xl font-bold tracking-tight">Participants are encouraged to</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {e.highlights.map((h) => (
                    <li key={h} className="card flex items-start gap-3 p-4 text-sm">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-ink"><Check size={12} /></span>
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {e.mission && (
              <Reveal delay={0.1}>
                <h2 className="font-display mt-10 text-2xl font-bold tracking-tight">Our mission</h2>
                {e.mission.map((m) => (
                  <p key={m} className="mt-4 leading-relaxed text-muted">{m}</p>
                ))}
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="rounded-[1.75rem] border border-line bg-cream p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Organised</p>
                <dl className="mt-3 space-y-3 text-sm">
                  <div><dt className="text-muted">Led by</dt><dd className="mt-0.5 font-semibold">{e.leadBy}</dd></div>
                  <div><dt className="text-muted">In coordination with</dt><dd className="mt-0.5 font-semibold">{e.withPartner}</dd></div>
                </dl>
                {e.stats && (
                  <dl className="mt-6 grid grid-cols-2 gap-3">
                    {e.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl bg-white p-4">
                        <dt className="font-display text-3xl font-bold"><CountUp value={s.value} /></dt>
                        <dd className="mt-1 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted"><Users size={12} /> {s.label}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </Reveal>
            {e.gallery && (
              <div className="mt-4">
                <PhotoGrid
                  photos={[e.image, ...e.gallery].map((src, i) => ({ src, alt: `${e.title} — photo ${i + 1}`, caption: e.title }))}
                />
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* next event */}
      <section className="pb-8">
        <div className="container-x">
          <Reveal>
            <TransitionLink
              href={`/events/${next.slug}`}
              label={next.title}
              className="card group flex items-center gap-5 overflow-hidden p-4 !border-0 md:p-5"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink">
                <Image src={next.image} alt={next.title} fill sizes="112px" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Next event</p>
                <p className="font-display truncate text-lg font-bold">{next.title}</p>
              </div>
              <ArrowRight className="shrink-0 transition group-hover:translate-x-1" />
            </TransitionLink>
          </Reveal>
        </div>
      </section>
      <CtaBand title="Planning an event or programme?" text="We handle coordination, execution and the systems behind it." />
    </>
  );
}
