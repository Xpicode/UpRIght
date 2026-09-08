"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { markIntroDone } from "./intro";

const WORDS = ["Software", "Systems", "Learning", "Support"];
const SESSION_KEY = "upright:preloaded";

/**
 * Brand intro: yellow curtain, logo + cycling words, then the curtain wipes
 * upward to reveal the page. Plays once per browser session (~1.6s).
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    if (reduce || seen) {
      markIntroDone();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    let wordTimer: ReturnType<typeof setInterval> | undefined;
    let done: ReturnType<typeof setTimeout> | undefined;

    // Defer the first state update so it happens after paint (keeps the React
    // compiler lint rule happy and avoids a hydration flash).
    const start = requestAnimationFrame(() => {
      setShow(true);
      wordTimer = setInterval(() => setI((v) => (v + 1) % WORDS.length), 320);
      done = setTimeout(() => {
        clearInterval(wordTimer);
        setShow(false);
        markIntroDone();
        document.documentElement.style.overflow = "";
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }, 1600);
    });

    return () => {
      cancelAnimationFrame(start);
      clearInterval(wordTimer);
      clearTimeout(done);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cream"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="grid-bg absolute inset-0" />
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
          >
            <Image src="/images/logo.svg" alt="" width={72} height={48} priority className="h-12 w-auto" />
            <div className="font-display mt-6 flex items-center gap-2 text-2xl font-bold leading-none tracking-tight text-ink md:text-3xl">
              <span className="text-ink/60">Upright</span>
              <span className="relative inline-block h-[1em] w-[5.2em] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={WORDS[i]}
                    className="absolute left-0 top-0 leading-none"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    {WORDS[i]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </motion.div>

          {/* bottom progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-brand"
            initial={{ width: "0%" }}
            animate={{ width: "100%", transition: { duration: 1.4, ease: "easeInOut" } }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
