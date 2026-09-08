import type { ReactNode } from "react";
import { SplitText } from "./motion/split-text";
import { Reveal } from "./motion/reveal";
import { HeaderBackdrop } from "./motion/header-backdrop";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  /** Optional photo behind the header (animated, with readability overlays). */
  image?: string;
  imagePosition?: string;
  imageShiftX?: string;
  children?: ReactNode;
};

/** Hero-style header used at the top of every inner page. */
export function PageHeader({ eyebrow, title, intro, dark, image, imagePosition, imageShiftX, children }: Props) {
  return (
    <section
      className={[
        "relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24",
        // with a photo the backdrop paints its own base colour (a section bg would hide it)
        dark ? (image ? "text-white" : "bg-ink text-white") : "",
      ].join(" ")}
    >
      {image ? (
        <HeaderBackdrop src={image} position={imagePosition} shiftX={imageShiftX} dark={dark} />
      ) : (
        !dark && <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      )}
      <div
        className={[
          "blob pointer-events-none absolute -right-32 -top-20 -z-10 h-[30rem] w-[30rem] blur-[110px]",
          dark ? "bg-brand/25" : image ? "hidden" : "bg-brand/45",
        ].join(" ")}
      />
      <div className="container-x">
        <Reveal>
          <span className={["eyebrow", dark ? "on-dark" : ""].join(" ")}>{eyebrow}</span>
        </Reveal>
        <SplitText as="h1" delay={0.1} className="display mt-6 max-w-4xl text-4xl sm:text-5xl lg:text-7xl">
          {title}
        </SplitText>
        {intro && (
          <Reveal delay={0.45}>
            <p className={["mt-7 max-w-2xl text-lg leading-relaxed md:text-xl", dark ? "text-white/65" : "text-muted"].join(" ")}>
              {intro}
            </p>
          </Reveal>
        )}
        {children && <Reveal delay={0.55}>{children}</Reveal>}
      </div>
    </section>
  );
}
