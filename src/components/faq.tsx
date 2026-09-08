"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Mail, MessageCircle, Phone, Search, X } from "lucide-react";
import { faqCategories, type FaqCategory } from "@/data/faq";
import { site } from "@/data/site";
import { Reveal } from "./motion/reveal";
import { Magnetic } from "./motion/magnetic";
import { TransitionLink } from "./motion/route-transition";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/* ---------- one accordion row ---------- */
function FaqRow({
  q,
  a,
  index,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      className={[
        "overflow-hidden rounded-2xl border transition-colors",
        open ? "border-ink/15 bg-white shadow-[0_24px_48px_-32px_rgba(11,11,12,0.35)]" : "border-line bg-white hover:border-ink/20",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <span
          className={[
            "font-display hidden w-8 shrink-0 text-sm font-bold tabular-nums transition-colors sm:block",
            open ? "text-brand-deep" : "text-ink/30",
          ].join(" ")}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-display flex-1 text-base font-bold tracking-tight md:text-lg">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0, backgroundColor: open ? "#ffe319" : "rgba(11,11,12,0)" }}
          transition={{ duration: 0.3, ease: EASE }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="px-6 pb-6 sm:pl-[4.5rem]">
              <div className="border-l-2 border-brand pl-4 leading-relaxed text-muted md:text-[1.05rem]">{a}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- category block ---------- */
function CategoryBlock({
  cat,
  openKey,
  setOpenKey,
}: {
  cat: FaqCategory;
  openKey: string | null;
  setOpenKey: (k: string | null) => void;
}) {
  return (
    <section id={`faq-${cat.id}`} className="scroll-mt-32">
      <Reveal>
        <div className="mb-5 flex items-end gap-4">
          <span className="h-9 w-1.5 rounded-full bg-brand" />
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{cat.title}</h2>
            <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
          </div>
        </div>
      </Reveal>
      <div className="space-y-3">
        {cat.items.map((it, i) => {
          const k = `${cat.id}-${i}`;
          return (
            <FaqRow
              key={k}
              q={it.q}
              a={it.a}
              index={i}
              open={openKey === k}
              onToggle={() => setOpenKey(openKey === k ? null : k)}
            />
          );
        })}
      </div>
    </section>
  );
}

/* ---------- the page body ---------- */
export function Faq() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(faqCategories[0].id);

  // search filter (question + answer)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqCategories;
    return faqCategories
      .map((c) => ({ ...c, items: c.items.filter((it) => (it.q + " " + it.a).toLowerCase().includes(q)) }))
      .filter((c) => c.items.length > 0);
  }, [query]);
  const total = filtered.reduce((n, c) => n + c.items.length, 0);

  // scroll-spy for the sticky category nav
  useEffect(() => {
    const els = faqCategories
      .map((c) => document.getElementById(`faq-${c.id}`))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveCat(visible[0].target.id.replace("faq-", ""));
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  const office = site.offices[0];

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="container-x">
          {/* search */}
          <Reveal>
            <label className="relative mx-auto block max-w-2xl">
              <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions — e.g. pricing, LMS, support hours…"
                className="w-full rounded-full border border-line bg-white py-4 pl-13 pr-12 text-base text-ink shadow-[0_20px_50px_-30px_rgba(11,11,12,0.35)] outline-none transition placeholder:text-muted/70 focus:border-ink/30 focus:ring-4 focus:ring-brand/40"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-ink"
                >
                  <X size={16} />
                </button>
              )}
            </label>
            <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
              {query ? `${total} result${total === 1 ? "" : "s"} for “${query}”` : `${faqCategories.reduce((n, c) => n + c.items.length, 0)} answers across ${faqCategories.length} topics`}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* sticky topic nav */}
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-32">
                <p className="eyebrow">Topics</p>
                <ul className="mt-5 space-y-1">
                  {faqCategories.map((c) => {
                    const on = c.id === activeCat;
                    const disabled = query && !filtered.some((f) => f.id === c.id);
                    return (
                      <li key={c.id}>
                        <a
                          href={`#faq-${c.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(`faq-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                          className={[
                            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                            on ? "text-ink" : "text-muted hover:text-ink",
                            disabled ? "pointer-events-none opacity-30" : "",
                          ].join(" ")}
                        >
                          {on && (
                            <motion.span
                              layoutId="faq-topic-pill"
                              className="absolute inset-0 rounded-xl bg-cream"
                              transition={{ type: "spring", stiffness: 400, damping: 34 }}
                            />
                          )}
                          <span className={["relative h-1.5 w-1.5 rounded-full", on ? "bg-brand" : "bg-ink/20"].join(" ")} />
                          <span className="relative">{c.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* questions */}
            <div className="space-y-16 lg:col-span-9">
              <AnimatePresence mode="popLayout">
                {filtered.length ? (
                  filtered.map((cat) => (
                    <motion.div key={cat.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CategoryBlock cat={cat} openKey={openKey} setOpenKey={setOpenKey} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-line p-10 text-center text-muted"
                  >
                    Nothing matches “{query}”. Try another word, or{" "}
                    <TransitionLink href="/contact" label="Contact" className="font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4">
                      ask us directly
                    </TransitionLink>
                    .
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* still have questions */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-brand px-8 py-12 text-center text-ink md:px-14 md:py-16">
              <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-brand-deep/60 blur-3xl" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="display text-3xl md:text-5xl">Still have questions?</h2>
                <p className="mt-4 text-ink/70 md:text-lg">
                  Can&apos;t find the answer you&apos;re looking for? Reach out and we&apos;ll get back to you within one business day.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Magnetic>
                    <TransitionLink href="/contact" label="Contact" className="btn btn-ink">
                      <MessageCircle size={16} /> Contact us
                    </TransitionLink>
                  </Magnetic>
                  <a href={`mailto:${site.contact.email}`} className="btn border border-ink/20 bg-white/70 text-ink hover:bg-white">
                    <Mail size={16} /> Email us
                  </a>
                  <a href={office.telHref} className="btn border border-ink/20 bg-white/70 text-ink hover:bg-white">
                    <Phone size={16} /> Call us
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
