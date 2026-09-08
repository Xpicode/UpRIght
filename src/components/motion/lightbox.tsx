"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxPhoto = { src: string; alt: string; caption?: string };

type Props = {
  photos: LightboxPhoto[];
  /** Render prop: gets an `open(index)` function to attach to any element. */
  children: (open: (index: number) => void) => ReactNode;
};

/**
 * Full-screen photo viewer. Wrap a gallery with it and call `open(i)` on click.
 * Keyboard: ← → to move, Esc to close. Click the dark backdrop to close.
 */
export function Lightbox({ photos, children }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, step]);

  const photo = index === null ? null : photos[index];

  return (
    <>
      {children(open)}
      <AnimatePresence>
        {photo && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={photo.alt}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.figure
              key={photo.src}
              className="relative flex max-h-full w-full max-w-6xl flex-col items-center"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[70vh] w-full overflow-hidden rounded-[1.25rem] bg-black shadow-2xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-4 flex w-full items-center justify-between gap-4 text-sm text-white/70">
                <span className="truncate">{photo.caption ?? photo.alt}</span>
                <span className="shrink-0 font-mono text-xs text-white/40">
                  {index! + 1} / {photos.length}
                </span>
              </figcaption>
            </motion.figure>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => { e.stopPropagation(); step(-1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-brand hover:text-ink md:left-6"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => { e.stopPropagation(); step(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition hover:bg-brand hover:text-ink md:right-6"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-brand hover:text-ink"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
