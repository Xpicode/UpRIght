import Image from "next/image";
import { Award, Calendar, MapPin, Check } from "lucide-react";
import { awards } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { TiltCard } from "./motion/tilt-card";

export function Awards() {
  return (
    <section id="awards" className="scroll-mt-24 bg-ink py-24 text-white md:py-32">
      <div className="container-x">
        <Reveal>
          <span className="eyebrow on-dark">Awards & recognition</span>
          <h2 className="display mt-5 max-w-2xl text-4xl md:text-5xl lg:text-6xl">
            Work that was <span className="text-brand">recognised.</span>
          </h2>
        </Reveal>

        {awards.map((a) => (
          <div key={a.title} className="mt-12 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <TiltCard className="h-full rounded-[1.75rem]" max={4} spotlightColor="rgba(255,227,25,0.18)">
                <div className="group relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/25 blur-3xl transition group-hover:bg-brand/35" />
                  <div className="relative mx-auto aspect-[362/512] max-w-[18rem] overflow-hidden rounded-xl shadow-2xl">
                    <Image src={a.image} alt={`${a.title} certificate`} fill sizes="288px" className="object-cover" />
                  </div>
                  <div className="relative mt-5 flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                      <Image src={a.photo} alt="Plaque of appreciation" fill sizes="56px" className="object-cover" />
                    </div>
                    <p className="text-sm text-white/60">Plaque presented at {a.location}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7">
              <div className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 md:p-9">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-ink">
                  <Award size={22} />
                </span>
                <h3 className="font-display mt-5 text-2xl font-bold tracking-tight md:text-3xl">{a.title}</h3>
                <p className="mt-2 text-brand">{a.issuer}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
                  <li className="inline-flex items-center gap-1.5"><Calendar size={15} className="text-brand" /> {a.date}</li>
                  <li className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-brand" /> {a.location}</li>
                </ul>
                <p className="mt-5 leading-relaxed text-white/75">{a.description}</p>
                <ul className="mt-6 space-y-3">
                  {a.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-white/85">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
                        <Check size={12} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
