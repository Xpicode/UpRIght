"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

/** Branded error boundary for the public site. Details stay in the server log, not on screen. */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site] render error:", error);
  }, [error]);

  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="container-x">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="display mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-7xl">
          We hit a snag loading this page.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          It&apos;s on our side, not yours. Try again, or head back home.
          {error.digest ? (
            <span className="mt-2 block text-sm text-muted/70">Reference: {error.digest}</span>
          ) : null}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-brand">
            <RefreshCw size={16} /> Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            <Home size={16} /> Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
