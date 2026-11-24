import type { Book, Locale, LocaleContent, InfoSlug } from '../shared/model.js';
import { businessEmail, socials, siteUrl } from './config.js';
import { anchor, escapeHtml as e, image } from './html.js';
import { shell } from './layout.js';
import { coverAssetPath } from './images.js';
import { markup, view } from './view.js';

function cover(prefix: string, book: Book, locale: Locale): string {
  const path = coverAssetPath(book, locale);
  if (!path) throw new Error('Cannot feature a placeholder cover in hero: ' + book.id);
  return prefix + path;
}

/** All languages use the same templates; only the content data changes. */
export function homePage(locale: Locale, copy: LocaleContent, books: Book[], root = false): string {
  const ex = copy.experience;
  const hero = copy.hero.slide1;
  const prefix = root ? '' : '../';
  const heroBooks = books.filter((book) => book.heroPosition).map((book) => {
    const title = book.translations[locale].title;
    return anchor('#book-' + book.id, image(cover(prefix, book, locale), title, 318, 414, '', book.heroPosition === 'center'), 'hero-book hero-book-' + book.heroPosition, false,
      ` aria-label="${e(title)} — ${e(copy.nav.products)}"`);
  }).join('');
  const features = ex.features.map((label, index) => view('partials/feature', {
    symbol: ['✦', '◒', '♡'][index % 3] ?? '✦', label,
  })).join('');
  const top = view('pages/hero', {
    eyebrow: ex.eyebrow, heroTitle: hero.title, heroBody: hero.body,
    discoverLink: markup(anchor('#books', e(ex.discover) + '<span aria-hidden="true">↗</span>', 'button button-dark')),
    newLabel: ex.new, productsTitle: copy.products.title,
    heroBooks: markup(heroBooks), introLabel: ex.introLabel, features: markup(features),
  });

  const cards = books.map((book, index) => {
    const text = book.translations[locale];
    const amazon = book.urls[locale];
    const buy = amazon
      ? view('pages/book-available', {
        buyLink: markup(anchor(amazon, e(copy.common.viewAmazon) + '<span aria-hidden="true">↗</span>', 'book-buy-link', true,
          ` aria-label="${e(copy.common.viewAmazon + ' — ' + text.title + '. ' + copy.common.externalLink)}"`)),
        availability: ex.availability,
      })
      : view('pages/book-unavailable', { comingSoon: ex.coming });
    const imgHtml = book.coverMode === 'placeholder'
      ? view('pages/book-placeholder', { altText: text.title + ' — ' + ex.coming, theme: text.theme })
      : image(cover(prefix, book, locale), text.title + ' — ' + locale.toUpperCase() + ' cover', 310, 403);
    // Never link unavailable editions to Amazon.
    const clickableCover = amazon
      ? anchor(amazon, imgHtml, 'book-cover-link', true, ` aria-label="${e(copy.common.viewAmazon + ' — ' + text.title)}"`)
      : imgHtml;
    const heading = amazon ? anchor(amazon, e(text.title), '', true) : e(text.title);
    return view('pages/book-card', {
      bookId: book.id, panelTheme: ['sage', 'peach', 'sun'][index % 3] ?? 'sage',
      coverHtml: markup(clickableCover), theme: text.theme, detailLabel: ex.detailLabel, age: book.age,
      headingHtml: markup(heading), description: text.description, buyHtml: markup(buy),
    });
  }).join('');
  const products = view('pages/books', {
    collectionLabel: ex.collectionLabel, title: copy.products.title, intro: copy.products.intro,
    bookCount: books.length, cards: markup(cards),
  });
  const about = view('pages/about', {
    logoImage: markup(image(prefix + 'assets/brand/mima-labs-logo.webp', '', 248, 248)),
    eyebrow: ex.aboutEyebrow, title: ex.aboutTitle,
    intro: copy.infoPages.about.sections[0]?.body ?? '',
    aboutLink: markup(anchor(root ? 'en/about/index.html' : 'about/index.html', e(ex.aboutLink) + '<span aria-hidden="true">↗</span>', 'text-link')),
  });
  const contact = view('pages/contact', {
    eyebrow: ex.contactEyebrow, title: copy.contact.title, body: copy.contact.body,
    mailLink: markup(anchor('mailto:' + businessEmail, e(copy.contact.cta) + '<span aria-hidden="true">↗</span>', 'button button-light')),
  });

  const structured = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'MIMA LABS', url: siteUrl + '/',
      logo: siteUrl + '/assets/brand/mima-labs-logo.webp', email: businessEmail,
      address: { '@type': 'PostalAddress', addressLocality: 'Zug', addressCountry: 'CH' }, sameAs: Object.values(socials) },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: 'MIMA LABS books',
      itemListElement: books.map((book, index) => ({
        '@type': 'ListItem', position: index + 1,
        item: { '@type': 'Book', name: book.translations[locale].title, inLanguage: locale,
          url: book.urls[locale] || siteUrl + '/' + locale + '/#book-' + book.id,
          ...(coverAssetPath(book, locale) ? { image: siteUrl + '/' + coverAssetPath(book, locale) } : {}),
          publisher: { '@type': 'Organization', name: 'MIMA LABS' } },
      })),
    },
  ];
  const body = view('pages/home', {
    hero: markup(top), books: markup(products), about: markup(about), contact: markup(contact),
  });
  return shell({ locale, copy, prefix, root }, copy.meta.title, copy.meta.description, '', body, structured);
}

export function infoPage(locale: Locale, copy: LocaleContent, slug: InfoSlug): string {
  const page = copy.infoPages[slug];
  const sections = page.sections.map((section) => view('pages/info-section', {
    heading: section.heading, body: section.body,
  })).join('');
  const fallback = '../index.html#' + (slug === 'about' ? 'about' : 'footer');
  const back = anchor(fallback, '← ' + e(copy.experience.back), 'text-link info-back', false, ' data-return-to-previous');
  const body = view('pages/info', {
    backLink: markup(back), title: page.title, intro: page.intro, sections: markup(sections),
  });
  return shell({ locale, copy, prefix: '../../', slug }, page.title + ' | MIMA LABS', page.intro, slug + '/', body);
}
