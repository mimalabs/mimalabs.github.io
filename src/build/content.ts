import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { infoSlugs, locales, type Book, type Locale, type LocaleContent } from '../shared/model.js';
import { businessEmail, publicLocations } from './config.js';
import { coverAssetPath } from './images.js';

/** Fail the build if a translation is incomplete or a purchase link isn't Amazon. */
export function readContent(root: string): { books: Book[]; translations: Record<Locale, LocaleContent> } {
  const content = join(root, 'content');
  const books = JSON.parse(readFileSync(join(content, 'products.json'), 'utf8')) as Book[];
  if (!Array.isArray(books) || books.length === 0) throw new Error('Add at least one product to content/products.json');
  if (new Set(books.map((book) => book.id)).size !== books.length) throw new Error('Each product ID must be unique');
  const heroPositions = new Set<string>();
  for (const book of books) {
    if (!/^[a-z][a-z0-9-]*$/.test(book.id)) throw new Error('Invalid product ID: ' + book.id);
    if (!book.age || typeof book.age !== 'string') throw new Error('Missing age label for ' + book.id);
    if (!book.urls || typeof book.urls !== 'object') throw new Error('Missing Amazon URLs object for ' + book.id);
    if (book.coverMode && !['localized', 'shared', 'placeholder'].includes(book.coverMode)) throw new Error('Invalid cover mode for ' + book.id);
    if (book.coverMode === 'placeholder' && (book.heroPosition || Object.keys(book.urls).length)) {
      throw new Error('A placeholder cover is only for Coming soon books outside the hero: ' + book.id);
    }
    if (book.heroPosition) {
      if (!['left', 'center', 'right'].includes(book.heroPosition) || heroPositions.has(book.heroPosition)) {
        throw new Error('Hero positions must be unique left / center / right: ' + book.id);
      }
      heroPositions.add(book.heroPosition);
    }
    for (const locale of locales) {
      const translation = book.translations?.[locale];
      if (!translation?.title?.trim() || !translation?.theme?.trim() || !translation?.description?.trim()) {
        throw new Error('Missing product translation ' + book.id + '/' + locale + ' in content/products.json');
      }
      const cover = coverAssetPath(book, locale);
      if (cover) {
        const path = join(root, 'site', cover);
        if (!existsSync(path)) throw new Error('Missing cover ' + path + ' — import it using npm run images:import or set coverMode to placeholder for a draft');
      }
    }
    for (const [locale, href] of Object.entries(book.urls)) {
      if (!locales.includes(locale as Locale)) throw new Error('Unknown Amazon locale: ' + locale);
      const url = new URL(href);
      if (url.protocol !== 'https:' || !['a.co', 'amzn.eu', 'amazon.com', 'amazon.de', 'amazon.fr', 'amazon.it', 'amazon.es', 'www.amazon.com', 'www.amazon.de', 'www.amazon.fr', 'www.amazon.it', 'www.amazon.es'].includes(url.hostname)) {
        throw new Error('Non-Amazon purchase URL for ' + book.id + '/' + locale);
      }
    }
  }
  const translations = {} as Record<Locale, LocaleContent>;
  for (const locale of locales) {
    const localizedTemplate = readFileSync(join(content, locale + '.json'), 'utf8');
    const data = JSON.parse(localizedTemplate
      .replaceAll('{{businessEmail}}', businessEmail)
      .replaceAll('{{businessLocation}}', publicLocations[locale])) as LocaleContent;
    if (!data.hero?.slide1?.title || !data.cookieConsent?.acceptAll) throw new Error('Incomplete translations: ' + locale);
    for (const slug of infoSlugs) {
      if (!data.infoPages?.[slug]?.title || !data.footer?.links?.[slug]) throw new Error('Missing page translation: ' + locale + '/' + slug);
    }
    translations[locale] = data;
  }
  return { books, translations };
}
