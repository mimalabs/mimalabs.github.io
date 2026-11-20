import { infoSlugs, locales, type Locale } from '../shared/model.js';
import { siteUrl } from './config.js';

/** English's preferred homepage is /; /en/ remains usable but is not canonical. */
export function canonicalPath(locale: Locale, path = ''): string {
  if (!path && locale === 'en') return '/';
  return `/${locale}/${path}`;
}

export function canonicalHref(locale: Locale, path = ''): string {
  return siteUrl + canonicalPath(locale, path);
}

/** Every language version publishes the same reciprocal set of hreflang links. */
export function languageAlternates(path = ''): { language: string; href: string }[] {
  const alternatives = locales.map((locale) => ({ language: locale, href: canonicalHref(locale, path) }));
  return [...alternatives, { language: 'x-default', href: canonicalHref('en', path) }];
}

/** Sitemap contains canonical URLs only: the root, five other homes, and all information pages. */
export function sitemapRoutes(): string[] {
  return [
    ...locales.map((locale) => canonicalPath(locale)),
    ...locales.flatMap((locale) => infoSlugs.map((slug) => canonicalPath(locale, `${slug}/`))),
  ];
}
