export const locales = ["en", "de", "es", "fr", "it", "ca"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; short: string; amazonHost: string }> = {
  en: { label: "English", short: "EN", amazonHost: "amazon.com" },
  de: { label: "Deutsch", short: "DE", amazonHost: "amazon.de" },
  es: { label: "Español", short: "ES", amazonHost: "amazon.es" },
  fr: { label: "Français", short: "FR", amazonHost: "amazon.fr" },
  it: { label: "Italiano", short: "IT", amazonHost: "amazon.it" },
  ca: { label: "Català", short: "CA", amazonHost: "amazon.es" },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
