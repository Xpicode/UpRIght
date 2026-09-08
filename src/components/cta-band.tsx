import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion/reveal";
import { Magnetic } from "./motion/magnetic";
import { TransitionLink } from "./motion/route-transition";
import { site } from "@/data/site";

type Props = {
  title?: string;
  text?: string;
};

/** Yellow call-to-action band used at the bottom of most pages. */
export function CtaBand({
  title = "Have something that needs to keep moving?",
  text = "Tell us what you're building or fixing — we reply within one business day with a clear next step.",
}: Props) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-brand px-8 py-12 text-ink md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-brand-deep/60 blur-3xl" />
            <div className="relative grid items-center gap-8 md:grid-cols-12">
              <div className="md:col-span-8">
                <h2 className="display text-3xl md:text-5xl">{title}</h2>
                <p className="mt-4 max-w-xl text-ink/70 md:text-lg">{text}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
                <Magnetic>
                  <TransitionLink href="/contact" label="Contact" className="btn btn-ink btn-swap">
                    <span data-text="Start a project">
                      <span className="label">Start a project</span>
                    </span>
                    <ArrowRight size={18} />
                  </TransitionLink>
                </Magnetic>
                <a href={site.contact.phoneHref} className="btn border border-ink/20 hover:bg-ink/5">
                  Call {site.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
