import Image from "next/image";
import { founder, site, teamPhotos } from "@/data/site";
import { Reveal } from "./motion/reveal";

export function AboutStory() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div id="story" className="scroll-mt-24">
          <div className="grid gap-4 lg:grid-cols-12">
            {/* story */}
            <Reveal className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-line bg-cream p-8 md:p-10">
                <div className="space-y-4 text-muted md:text-lg">
                  <p>
                    Founded in {site.established} as Upright Maritime Learning and Review Center,
                    we grew from building training content for seafarers into a full IT
                    consultancy — system design, software development, data processing, digital
                    learning platforms, contract programming and hardware maintenance.
                  </p>
                  <p>
                    Today we serve enterprises and government agencies from offices in Manila and
                    Cavite.
                  </p>
                </div>

                <div className="mt-10 border-t border-line pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Led by
                  </p>
                  <div className="mt-4 flex items-start gap-4">
                    <Image
                      src={founder.photo}
                      alt={founder.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-display text-lg font-bold tracking-tight">
                        {founder.name}
                      </p>
                      <p className="text-sm text-brand-deep font-medium">{founder.role}</p>
                      <p className="mt-2 text-sm text-muted">{founder.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* photo grid */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-7">
              {teamPhotos.map((p, i) => (
                <Reveal key={p.src} delay={0.05 * i}>
                  <div className="shine group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-ink">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="object-cover transition duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
