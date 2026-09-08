import Image from "next/image";
import { nav, site } from "@/data/site";
import { TransitionLink } from "./motion/route-transition";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink pb-10 pt-12 text-white">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image
              src="/images/logo-wordmark-dark.png"
              alt={site.name}
              width={909}
              height={190}
              className="h-10 w-auto"
            />
            <p className="mt-1 text-sm text-white/55">{site.contact.address}</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            {nav.map((n) => (
              <TransitionLink key={n.href} href={n.href} label={n.label} className="text-white/70 hover:text-white">
                {n.label}
              </TransitionLink>
            ))}
            <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">
              LinkedIn
            </a>
            <a href={site.socials.facebook} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">
              Facebook
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {site.name} All rights reserved.</p>
          <p>Established {site.established} · Manila & Cavite, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
