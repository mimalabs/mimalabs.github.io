/** Translations are data, never separate implementations. */
export const locales = ['en', 'de', 'es', 'fr', 'it', 'ca'] as const;
export type Locale = (typeof locales)[number];
export const languageLabels: Record<Locale, string> = {
  en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français', it: 'Italiano', ca: 'Català',
};
export const infoSlugs = ['about', 'faq', 'privacy', 'cookies', 'legal', 'terms', 'accessibility'] as const;
export type InfoSlug = (typeof infoSlugs)[number];
export interface BookTranslation {
  title: string;
  theme: string;
  description: string;
}
export interface Book {
  /** Stable URL and cover-folder slug; do not rename after publishing. */
  id: string;
  age: string;
  /** Only these three optional slots are shown as interactive artwork in the hero. */
  heroPosition?: 'left' | 'center' | 'right';
  /** Placeholder lets you announce a draft book before its cover is ready. */
  coverMode?: 'localized' | 'shared' | 'placeholder';
  urls: Partial<Record<Locale, string>>;
  translations: Record<Locale, BookTranslation>;
}
export interface InfoPage {
  title: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
}
export interface LocaleContent {
  meta: { title: string; description: string };
  nav: { products: string; about: string; contact: string };
  common: { age: string; viewAmazon: string; externalLink: string; backToTop: string };
  hero: { slide1: { title: string; body: string } };
  products: { title: string; intro: string };
  experience: {
    menu: string; closeMenu: string; language: string; skip: string; back: string;
    eyebrow: string; features: string[]; discover: string; new: string;
    introLabel: string; collectionLabel: string; detailLabel: string; availability: string;
    coming: string; aboutEyebrow: string; aboutTitle: string; aboutLink: string;
    contactEyebrow: string; footerPrompt: string; footerDisclaimer: string;
  };
  contact: { title: string; body: string; cta: string };
  footer: {
    links: Record<InfoSlug, string>;
    exploreLabel: string;
    legalLabel: string;
  };
  cookieConsent: {
    title: string; body: string; essentialOnly: string; acceptAll: string;
    learnMore: string; manage: string;
  };
  infoPages: Record<InfoSlug, InfoPage>;
}
