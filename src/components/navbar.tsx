"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site } from "@/data/site";
import { useIntroDone } from "./motion/intro";
import { TransitionLink } from "./motion/route-transition";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const play = useIntroDone();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Pages whose header is dark: use light nav text until the bar gets its white background.
  const onDark = !scrolled && !open && ["/contact", "/faq"].some((p) => pathname.startsWith(p));
  const close = () => setOpen(false);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4"
      initial={reduce ? false : { y: -80, opacity: 0 }}
      animate={play ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="container-x">
        <div
          className={[
            "flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 md:px-5",
            scrolled || open
              ? "border-line bg-white/85 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.3)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          ].join(" ")}
        >
          <TransitionLink
            href="/"
            label="Home"
            className="flex items-center"
            aria-label={site.name}
            onClick={close}
          >
            <Image
              src="/images/logo-wordmark.png"
              alt="Upright Solutions and Systems Consultancy Corp."
              width={909}
              height={190}
              priority
              className="h-9 w-auto md:h-10"
            />
          </TransitionLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  className={[
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition",
                    onDark
                      ? active ? "text-ink" : "text-white/75 hover:text-white"
                      : active ? "text-ink" : "text-ink/70 hover:text-ink",
                  ].join(" ")}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className={["absolute inset-0 rounded-full", onDark ? "bg-brand" : "bg-cream"].join(" ")}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </TransitionLink>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <TransitionLink
              href="/contact"
              label="Contact"
              className="btn btn-brand !py-2.5 !px-5 text-sm"
            >
              Start a project <ArrowUpRight size={16} />
            </TransitionLink>
          </div>

          <button
            className={["rounded-full p-2 md:hidden", onDark ? "text-white" : ""].join(" ")}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-3xl border border-line bg-white/95 p-3 shadow-xl backdrop-blur-xl md:hidden"
            >
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <TransitionLink
                    href={item.href}
                    label={item.label}
                    onClick={close}
                    className={[
                      "block rounded-2xl px-4 py-3 text-base font-medium",
                      isActive(item.href) ? "bg-cream" : "hover:bg-cream",
                    ].join(" ")}
                  >
                    {item.label}
                  </TransitionLink>
                </motion.div>
              ))}
              <TransitionLink
                href="/contact"
                label="Contact"
                onClick={close}
                className="btn btn-brand mt-2 w-full"
              >
                Start a project <ArrowUpRight size={16} />
              </TransitionLink>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
