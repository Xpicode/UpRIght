"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { services, site } from "@/data/site";
import { contactSchema } from "@/lib/contact-schema";
import { Reveal } from "./motion/reveal";
import { motion } from "framer-motion";

type Status = "idle" | "sending" | "sent" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme?: "light" | "dark" | "auto" }) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

/** Cloudflare Turnstile widget — only rendered when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. */
function TurnstileWidget({ siteKey }: { siteKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: string | undefined;
    const render = () => {
      if (ref.current && window.turnstile && !id) {
        id = window.turnstile.render(ref.current, { sitekey: siteKey, theme: "dark" });
      }
    };
    if (window.turnstile) render();
    else window.onTurnstileLoad = render;
    return () => {
      if (id) window.turnstile?.remove(id);
    };
  }, [siteKey]);
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
        strategy="afterInteractive"
      />
      <div ref={ref} className="sm:col-span-2" />
    </>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const { "cf-turnstile-response": turnstileToken, ...raw } = Object.fromEntries(
      new FormData(form).entries(),
    );
    const parsed = contactSchema.safeParse({ ...raw, turnstileToken: turnstileToken || undefined });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        window.turnstile?.reset();
        throw new Error(json.error ?? "Something went wrong");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-ink pb-24 pt-4 text-white md:pb-32 md:pt-8">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow on-dark">Inquiry form</span>
              <h2 className="display mt-5 text-4xl md:text-5xl">
                Send us a <span className="text-brand">message.</span>
              </h2>
              <p className="mt-6 max-w-md text-white/65 md:text-lg">
                Or reach us directly — phone, email, or drop by either office.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-10 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 text-brand" />
                  <a href={`mailto:${site.contact.email}`} className="hover:underline">
                    {site.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-brand" />
                  <a href={site.contact.phoneHref} className="hover:underline">
                    {site.contact.phone}
                  </a>
                </li>
                {site.offices.map((o) => (
                  <li key={o.name} className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                    <a
                      href={o.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/75 hover:underline"
                    >
                      <span className="font-semibold text-white">{o.name}</span> — {o.address}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
              {status === "sent" ? (
                <motion.div
                  className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.span
                    className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand text-ink"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  >
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
                      <motion.path
                        d="M8 18.5l7 7L28 11"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                      />
                    </svg>
                  </motion.span>
                  <p className="font-display mt-6 text-2xl font-bold">Message sent</p>
                  <p className="mt-2 max-w-sm text-white/65">
                    Thanks — we&apos;ve got it and will be in touch shortly.
                  </p>
                  <button
                    className="btn btn-ghost mt-8 !border-white/20 !text-white hover:!bg-white/10"
                    onClick={() => setStatus("idle")}
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-white/70">Name</span>
                    <input name="name" className="input" placeholder="Juan dela Cruz" required />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-white/70">Email</span>
                    <input
                      name="email"
                      type="email"
                      className="input"
                      placeholder="you@company.com"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-white/70">Company (optional)</span>
                    <input name="company" className="input" placeholder="Company name" />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-white/70">I&apos;m interested in</span>
                    <select name="service" className="input appearance-none" defaultValue="">
                      <option value="" className="text-ink">
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="text-ink">
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm sm:col-span-2">
                    <span className="text-white/70">Project details</span>
                    <textarea
                      name="message"
                      rows={5}
                      className="input resize-y"
                      placeholder="What are you trying to build or fix?"
                      required
                    />
                  </label>

                  {/* honeypot */}
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden
                  />

                  {TURNSTILE_SITE_KEY && <TurnstileWidget siteKey={TURNSTILE_SITE_KEY} />}

                  {error && (
                    <p className="text-sm text-red-300 sm:col-span-2" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/40">
                      We only use your details to reply to this inquiry.
                    </p>
                    <button
                      type="submit"
                      className="btn btn-brand btn-swap"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? (
                        <>
                          Sending <Loader2 size={16} className="animate-spin" />
                        </>
                      ) : (
                        <>
                          <span data-text="Send message">
                            <span className="label">Send message</span>
                          </span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
