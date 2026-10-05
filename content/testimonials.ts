import type { Testimonial } from "@/types/content";

// DEVELOPMENT-ONLY DEMOS. Replace with genuine customer testimonials before enabling in production.
// Prefer self-hosted MP4/WebM files in /public/testimonials to avoid third-party video tracking.
export const testimonials: readonly Testimonial[] = [
  { id: "demo-parent-1", author: "Demo parent", scoreOutOf10: 10, quoteKey: "demo1" },
  { id: "demo-parent-2", author: "Demo parent", scoreOutOf10: 9, quoteKey: "demo2" },
  { id: "demo-parent-3", author: "Demo parent", scoreOutOf10: 9, quoteKey: "demo3" },
] as const;
