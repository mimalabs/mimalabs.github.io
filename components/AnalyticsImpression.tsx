"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsImpression({ children, eventName, props }: { children: ReactNode; eventName: string; props: Record<string, string | number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || sent.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55 && !sent.current) {
          sent.current = true;
          trackEvent(eventName, props);
          observer.disconnect();
        }
      },
      { threshold: [0.55] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eventName, props]);

  return <div ref={ref} className="h-full">{children}</div>;
}
