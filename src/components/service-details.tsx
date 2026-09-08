import { Check, ArrowRight } from "lucide-react";
import { services } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { TransitionLink } from "./motion/route-transition";
import { LottieFrame } from "./motion/lottie-frame";

/** One row per service, alternating image/text, each anchored by its id (#software …). */
export function ServiceDetails() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-x space-y-20 md:space-y-28">
        {services.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={s.id}
              id={s.id}
              className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <Reveal className={["lg:col-span-6", flip ? "lg:order-2" : ""].join(" ")}>
                <LottieFrame name={s.id} index={`0${i + 1}`} />
              </Reveal>

              <Reveal delay={0.1} className={["lg:col-span-6", flip ? "lg:order-1" : ""].join(" ")}>
                <span className="eyebrow">{s.tagline}</span>
                <h3 className="display mt-4 text-3xl md:text-4xl lg:text-5xl">{s.title}</h3>
                <p className="mt-5 max-w-lg leading-relaxed text-muted md:text-lg">{s.description}</p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm font-medium">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
                        <Check size={12} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <TransitionLink
                  href="/contact"
                  label="Contact"
                  className="link-underline mt-7 inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  Ask about {s.title.toLowerCase()} <ArrowRight size={15} />
                </TransitionLink>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
