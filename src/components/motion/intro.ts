"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny shared flag so hero animations wait for the preloader to finish.
 * `markIntroDone()` is called by the Preloader (or immediately if it's skipped).
 */
let done = false;
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
