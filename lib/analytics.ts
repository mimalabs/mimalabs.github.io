"use client";

declare global {
  interface Window {
    plausible?: ((eventName: string, options?: { props?: Record<string, string | number> }) => void) & {
      q?: unknown[];
      init?: (options?: Record<string, unknown>) => void;
      o?: Record<string, unknown>;
    };
  }
}

export function trackEvent(eventName: string, props?: Record<string, string | number>) {
  if (typeof window === "undefined" || !window.plausible) return;
  window.plausible(eventName, props ? { props } : undefined);
}
