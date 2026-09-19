"use client";

import { useSyncExternalStore } from "react";

/**
 * Reading browser-only state without an effect.
 *
 * The instinct is `useState(false)` plus an effect that reads the real value after
 * mount. React 19's lint rules reject that, correctly: it renders once with a value
 * known to be wrong and then immediately renders again. `useSyncExternalStore` exists
 * for exactly this — a server snapshot, a client snapshot, and a subscription.
 */

/** Whether the viewer has asked the system for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // The server cannot know, and assuming motion is fine is the safer default to
    // render: it matches what a viewer without the preference sees, and the client
    // corrects it before anything animates.
    () => false,
  );
}

/**
 * A boolean remembered per viewer in localStorage.
 *
 * Every access is wrapped: in a private window or with site data blocked, reading or
 * writing can throw, and a rail that cannot remember its width is not a reason to take
 * the page down. Nothing outside this browser depends on the value.
 */
function createStoredFlag(key: string, fallback: boolean) {
  const listeners = new Set<() => void>();
  let cached: boolean | undefined;

  function read(): boolean {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? fallback : stored === "true";
    } catch {
      return fallback;
    }
  }

  return {
    subscribe(onChange: () => void) {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    // Cached because getSnapshot must return a stable value between renders —
    // reading localStorage each time is stable in practice, but caching makes it so
    // by construction and avoids a synchronous read on every render.
    getSnapshot(): boolean {
      cached ??= read();
      return cached;
    },
    getServerSnapshot(): boolean {
      return fallback;
    },
    set(value: boolean) {
      cached = value;
      try {
        window.localStorage.setItem(key, String(value));
      } catch {
        /* Not persisting is not worth surfacing. */
      }
      for (const listener of listeners) listener();
    },
  };
}

const railCollapsed = createStoredFlag("lawxygen.rail.collapsed", false);

export function useRailCollapsed(): [boolean, (value: boolean) => void] {
  const collapsed = useSyncExternalStore(
    railCollapsed.subscribe,
    railCollapsed.getSnapshot,
    railCollapsed.getServerSnapshot,
  );
  return [collapsed, railCollapsed.set];
}
