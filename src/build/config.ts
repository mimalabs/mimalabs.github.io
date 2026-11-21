import { locales, type Locale } from '../shared/model.js';

export const socials = {
  Instagram: 'https://www.instagram.com/mimalabsworld/',
  TikTok: 'https://www.tiktok.com/@mimalabs.studio',
  'Amazon shop': 'https://www.amazon.com/stores/MIMA-LABS/author/B0HK8LMHW3',
} as const;
/** Production canonical origin. DNS and GitHub Pages binding are configured at go-live. */
export const siteUrl = 'https://www.mimalabsworld.com';
/** One source of truth for contact links, structured metadata and translated legal notices. */
export const businessEmail = 'info.mimalabs@gmail.com';
/** Public city-level location. A legal postal address must be reviewed separately. */
export const publicLocations: Record<Locale, string> = {
  en: 'Zug, Switzerland',
  de: 'Zug, Schweiz',
  es: 'Zug, Suiza',
  fr: 'Zoug, Suisse',
  it: 'Zug, Svizzera',
  ca: 'Zug, Suïssa',
};
export const allLocales: readonly Locale[] = locales;
