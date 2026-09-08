import { notFound } from "next/navigation";

/**
 * Catch-all so every unmatched URL renders the branded 404 in (site)/not-found.tsx
 * (with navbar + footer) instead of Next's plain default page.
 */
export default function CatchAll() {
  notFound();
}
