import type { Locale } from "@/i18n/config";
import type { ProductEdition, ProductFamily } from "@/types/content";

function editions(urls: Partial<Record<Locale, string>>): Partial<Record<Locale, ProductEdition>> {
  return Object.fromEntries(
    Object.entries(urls).map(([locale, amazonUrl]) => [
      locale,
      { locale: locale as Locale, amazonUrl },
    ]),
  ) as Partial<Record<Locale, ProductEdition>>;
}

// Availability is intentionally data-driven:
// - add a locale + Amazon URL when that edition is publicly available;
// - omit the locale while it is not live.
// The UI then automatically disables the cover and renders the localized
// “Coming soon” state without any component changes.
//
// V37 availability state: only locales with a confirmed Amazon link are live.
// Locales omitted below remain disabled and render the existing “Coming soon” state.
// Add a locale + URL here when a new edition becomes publicly available;
// the cover and CTA will enable automatically everywhere.
export const products: readonly ProductFamily[] = [
  {
    id: "farm",
    ageRange: "1–3",
    activityTypes: ["color", "imagine"],
    editionByLocale: editions({
      en: "https://a.co/d/0iP4hcyy",
      de: "https://amzn.eu/d/00xUxhrS",
      es: "https://amzn.eu/d/05qXy8OT",
      fr: "https://amzn.eu/d/08l6Mo86",
    }),
  },
  {
    id: "halloween",
    ageRange: "1–3",
    activityTypes: ["color", "imagine"],
    editionByLocale: editions({
      en: "https://a.co/d/0gFSO2ly",
      de: "https://amzn.eu/d/0d2elJIz",
      es: "https://amzn.eu/d/0fwmAeCM",
      fr: "https://amzn.eu/d/01JWLne6",
      ca: "https://amzn.eu/d/05Iedfz4",
    }),
  },
  {
    id: "christmas",
    ageRange: "1–3",
    activityTypes: ["color", "imagine"],
    editionByLocale: editions({
      en: "https://a.co/d/07YIv6b3",
      de: "https://amzn.eu/d/0712zJ9S",
      es: "https://amzn.eu/d/0edtUioA",
      fr: "https://amzn.eu/d/03cW13Kj",
    }),
  },
] as const;
