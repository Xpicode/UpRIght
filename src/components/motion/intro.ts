"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared "intro finished" flag that the hero and navbar wait on.
 * The preloader is no longer mounted (see (site)/layout.tsx), so this starts
 * as done and the entrance animations play as soon as the page mounts.
 * If you re-add <Preloader />, set this back to `false`.
 */
let done = true;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useIntroDone() {
  // On the server (and first client render) report `true` so SSR markup is
  // visible; the preloader covers the page during the real intro anyway.
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => true,
  );
}
