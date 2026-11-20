import type { Book, Locale } from '../shared/model.js';

/** Keep cover filenames predictable: no image URLs in page templates or translation files. */
export function coverAssetPath(book: Book, locale: Locale): string | null {
  if (book.coverMode === 'placeholder') return null;
  const filename = book.coverMode === 'shared' ? 'shared.webp' : locale + '.webp';
  return 'assets/covers/' + book.id + '/' + filename;
}
