import Image from "next/image";
import { process } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { StepTrack } from "./motion/step-track";
import { StepItem } from "./motion/step-item";

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">How we work</span>
              <h2 className="display mt-5 text-4xl md:text-5xl">
                No surprises. Working software every step.
              </h2>
              <p className="mt-6 max-w-md text-muted md:text-lg">
                A simple, transparent process that has carried projects from a kickoff call to
                national-scale deployments.
              </p>
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:block">
                <Image
                  src="/images/photos/consulting.webp"
                  alt="Planning wall during a discovery workshop"
                  fill
                  sizes="40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          <StepTrack className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.12}>
                <StepItem className="card step group h-full p-7">
                  <span className="step-num font-display text-4xl font-bold">
                    {p.step}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-bold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                </StepItem>
              </Reveal>
            ))}
          </StepTrack>
        </div>

      </div>
    </section>
  );
}
