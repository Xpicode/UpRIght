import Image from "next/image";
import {
  Code2,
  Layers,
  GraduationCap,
  Compass,
  Cpu,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { services, type Service } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { TiltCard } from "./motion/tilt-card";

const icons = {
  code: Code2,
  layers: Layers,
  graduation: GraduationCap,
  compass: Compass,
  cpu: Cpu,
};

const span: Record<Service["size"], string> = {
  lg: "md:col-span-2 md:row-span-2",
  md: "md:col-span-2 lg:col-span-1 lg:row-span-2",
  sm: "md:col-span-1 lg:col-span-2",
};

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 pb-24 pt-4 md:pb-32 md:pt-8">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <span className="eyebrow">At a glance</span>
            <h2 className="display mt-5 max-w-2xl text-3xl md:text-5xl">
              Pick a service, or hand us the whole stack.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-muted md:text-lg">
              Whether you need a product built from scratch, systems that
              finally talk to each other, or someone to keep the lights on — we
              cover it end to end.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(11rem,auto)]">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            const isLg = s.size === "lg";
            return (
              <Reveal key={s.id} delay={i * 0.08} className={span[s.size]}>
                <TiltCard className="h-full rounded-[1.75rem]" max={5}>
                  <a
                    href={`#${s.id}`}
                    aria-label={`Read more about ${s.title}`}
                    className={[
                      "card group relative flex h-full flex-col overflow-hidden p-7",
                      s.size === "sm"
                        ? "lg:flex-row lg:gap-8 lg:items-start"
                        : "",
                      isLg ? "bg-ink text-white md:p-9" : "",
                    ].join(" ")}
                  >
                    {isLg && (
                      <>
                        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl transition group-hover:bg-brand/40" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block">
                          <Image
                            src="/images/photos/tablet.webp"
                            alt=""
                            fill
                            sizes="30vw"
                            className="object-contain object-right-bottom p-4 opacity-90 transition duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      </>
                    )}
                    {s.image && !isLg && (
                      <div className="relative -mx-7 -mt-7 mb-6 aspect-[16/8] overflow-hidden rounded-t-[1.75rem]">
                        <Image
                          src={s.image}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 25vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    )}
                    <div
                      className={[
                        "relative flex flex-1 flex-col",
                        isLg ? "md:max-w-[54%]" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={[
                            "inline-flex h-11 w-11 items-center justify-center rounded-2xl transition duration-500 group-hover:-rotate-6 group-hover:scale-110",
                            isLg ? "bg-brand text-ink" : "bg-cream text-ink",
                          ].join(" ")}
                        >
                          <Icon size={20} />
                        </span>
                        <ArrowUpRight
                          size={18}
                          className={[
                            "transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                            isLg ? "text-white/40" : "text-muted",
                          ].join(" ")}
                        />
                      </div>
                      <h3
                        className={[
                          "font-display mt-6 font-bold tracking-tight",
                          isLg ? "text-3xl md:text-4xl" : "text-xl",
                        ].join(" ")}
                      >
                        {s.title}
                      </h3>
                      <p
                        className={[
                          "mt-2 text-sm font-medium",
                          isLg ? "text-brand" : "text-ink/60",
                        ].join(" ")}
                      >
                        {s.tagline}
                      </p>
                      <p
                        className={[
                          "mt-3 text-sm leading-relaxed",
                          isLg ? "text-white/70 md:text-base" : "text-muted",
                        ].join(" ")}
                      >
                        {s.description}
                      </p>
                      {s.size !== "sm" && (
                        <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                          {s.points.map((p) => (
                            <li
                              key={p}
                              className={[
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                                isLg
                                  ? "border-white/15 bg-white/5 text-white/80"
                                  : "border-line bg-cream/70 text-ink/80",
                              ].join(" ")}
                            >
                              <Check
                                size={12}
                                className={
                                  isLg ? "text-brand" : "text-brand-deep"
                                }
                              />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </a>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
