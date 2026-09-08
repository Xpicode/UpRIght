import type { Metadata } from "next";
import { ArrowRight, Home } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TransitionLink } from "@/components/motion/route-transition";
import { Reveal } from "@/components/motion/reveal";
import { nav } from "@/data/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/** Branded 404 — rendered inside the site chrome (navbar, footer, transitions). */
export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Error 404"
        title="That page has moved on."
        intro="The link may be out of date, or the page may have been renamed. Here's where to go instead."
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <TransitionLink href="/" label="Home" className="btn btn-brand">
            <Home size={16} /> Back to home
          </TransitionLink>
          <TransitionLink href="/contact" label="Contact" className="btn btn-ghost">
            Contact us <ArrowRight size={16} />
          </TransitionLink>
        </div>
      </PageHeader>
      <section className="pb-24">
        <div className="container-x">
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    label={item.label}
                    className="card group flex items-center justify-between p-5"
                  >
                    <span className="font-display text-lg font-bold">{item.label}</span>
                    <ArrowRight size={18} className="text-muted transition group-hover:translate-x-1 group-hover:text-ink" />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
