import type { Locale } from "@/i18n/config";

export type ProductFamilyId = "farm" | "halloween" | "christmas";

export type ProductEdition = {
  locale: Locale;
  amazonUrl: string;
};

export type ProductFamily = {
  id: ProductFamilyId;
  ageRange: string;
  activityTypes: readonly ("color" | "imagine" | "draw")[];
  /**
   * A locale is intentionally optional. Omit an entry while that edition is
   * unavailable; the UI automatically renders a localized "Coming soon" state.
   * Add the Amazon URL later and the CTA appears without component changes.
   */
  editionByLocale: Partial<Record<Locale, ProductEdition>>;
  coverImage?: string;
};

export type Testimonial = {
  id: string;
  author: string;
  scoreOutOf10: number;
  videoUrl?: string;
  posterUrl?: string;
  quoteKey: "demo1" | "demo2" | "demo3";
};
