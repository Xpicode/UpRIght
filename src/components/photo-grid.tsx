"use client";

import Image from "next/image";
import { Lightbox, type LightboxPhoto } from "./motion/lightbox";
import { Reveal } from "./motion/reveal";

/** Clickable photo grid that opens the full-screen viewer. */
export function PhotoGrid({ photos, cols = 2 }: { photos: LightboxPhoto[]; cols?: 2 | 4 }) {
  return (
    <Lightbox photos={photos}>
      {(open) => (
        <div className={["grid gap-3", cols === 4 ? "grid-cols-2 md:grid-cols-4 md:gap-4" : "grid-cols-2"].join(" ")}>
          {photos.map((p, i) => (
            <Reveal key={p.src} delay={0.06 * i}>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`View ${p.alt}`}
                className="shine group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[1.25rem] bg-ink"
              >
                <Image src={p.src} alt={p.alt} fill sizes="25vw" className="object-cover transition duration-[1.2s] group-hover:scale-[1.06]" />
                <span className="absolute inset-0 transition group-hover:bg-ink/20" />
              </button>
            </Reveal>
          ))}
        </div>
      )}
    </Lightbox>
  );
}
