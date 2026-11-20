import type { Book, Locale, LocaleContent, InfoSlug } from '../shared/model.js';
import { businessEmail, socials, siteUrl } from './config.js';
import { anchor, escapeHtml as e, image } from './html.js';
import { shell } from './layout.js';
import { coverAssetPath } from './images.js';

function cover(prefix: string, book: Book, locale: Locale): string {
  const path = coverAssetPath(book, locale);
  if (!path) throw new Error('Cannot feature a placeholder cover in hero: ' + book.id);
  return prefix + path;
}

/** Single rendering path for every language; HTML is localized at build time. */
export function homePage(locale: Locale, copy: LocaleContent, books: Book[], root = false): string {
  const ex = copy.experience;
  const hero = copy.hero.slide1;
  const prefix = root ? '' : '../';
  const heroBooks = books.filter((book) => book.heroPosition).map((book) => {
    const title = book.translations[locale].title;
    return anchor('#book-' + book.id, image(cover(prefix, book, locale), title, 318, 414, '', book.heroPosition === 'center'), 'hero-book hero-book-' + book.heroPosition, false,
      ` aria-label="${e(title)} — ${e(copy.nav.products)}"`);
  }).join('');
  const meta = ex.features.map((label, index) =>
    `<span><span class="meta-symbol" aria-hidden="true">${['✳', '◒', '♡'][index % 3]}</span>${e(label)}</span>`).join('');

  const top = `<section id="home" class="hero-section" aria-labelledby="hero-title"><div class="container hero-grid">
  <div class="hero-content"><span class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${e(ex.eyebrow)}</span>
  <h1 id="hero-title">${e(hero.title)}</h1><p class="hero-description">${e(hero.body)}</p>
  ${anchor('#books', e(ex.discover) + '<span aria-hidden="true">↗</span>', 'button button-dark')}
  <div class="hero-note"><span class="hero-note-mark" aria-hidden="true">✳</span>${e(ex.new)}</div>
  </div><div class="hero-stage" aria-label="${e(copy.products.title)}"><div class="hero-sun" aria-hidden="true"></div>
  <span class="hero-scribble hero-scribble-one" aria-hidden="true">✳</span><span class="hero-scribble hero-scribble-two" aria-hidden="true">✧</span>
  ${heroBooks}<span class="stage-badge" aria-hidden="true">✳<span>MIMA</span></span>
  </div></div><div class="container hero-meta" aria-label="${e(ex.introLabel)}">${meta}</div></section>`;

  const cards = books.map((book, index) => {
    const text = book.translations[locale];
    const amazon = book.urls[locale];
    const buy = amazon
      ? anchor(amazon, e(copy.common.viewAmazon) + '<span aria-hidden="true">↗</span>', 'book-buy-link', true,
        ` aria-label="${e(copy.common.viewAmazon + ' — ' + text.title + '. ' + copy.common.externalLink)}"`)
        + `<span class="status-dot-label"><span class="status-dot" aria-hidden="true"></span>${e(ex.availability)}</span>`
      : `<span class="coming-soon-label">${e(ex.coming)}</span>`;
    const imgHtml = book.coverMode === 'placeholder'
      ? `<div class="book-artwork-placeholder" role="img" aria-label="${e(text.title + ' — ' + ex.coming)}">
        <span class="placeholder-star" aria-hidden="true">✳</span><span class="placeholder-brand">MIMA LABS</span><span class="placeholder-theme">${e(text.theme)}</span></div>`
      : image(cover(prefix, book, locale), text.title + ' — ' + locale.toUpperCase() + ' cover', 310, 403);
    // The cover and title are Amazon links only when a listing actually exists.
    const clickableCover = amazon
      ? anchor(amazon, imgHtml, 'book-cover-link', true, ` aria-label="${e(copy.common.viewAmazon + ' — ' + text.title)}"`)
      : imgHtml;
    const heading = amazon ? anchor(amazon, e(text.title), '', true) : e(text.title);
    return `<article class="book-card" id="book-${book.id}" aria-labelledby="book-title-${book.id}">
      <div class="book-cover-panel ${['sage', 'peach', 'sun'][index % 3]}"><span class="cover-decoration" aria-hidden="true">✺</span>${clickableCover}</div>
      <div class="book-information"><div class="book-micro"><span>${e(text.theme)}</span><span>${e(ex.detailLabel)} ${e(book.age)}</span></div>
      <h3 id="book-title-${book.id}">${heading}</h3><p>${e(text.description)}</p><div class="book-cta-row">${buy}</div></div></article>`;
  }).join('');
  const products = `<section class="section books-section" id="books" aria-labelledby="books-title"><div class="container">
  <div class="section-heading"><div><span class="eyebrow eyebrow-small">${e(ex.collectionLabel)}</span><h2 id="books-title">${e(copy.products.title)}</h2></div><p>${e(copy.products.intro)}</p></div>
  <div class="book-grid" data-count="${books.length}">${cards}</div></div></section>`;
  const about = `<section id="about" class="section about-section" aria-labelledby="about-title"><div class="container about-panel">
  <div class="about-art" aria-hidden="true"><div class="art-circle"></div><div class="art-square"></div><div class="art-arch"></div>
  ${image(prefix + 'assets/brand/mima-labs-logo.webp', '', 248, 248)}</div>
  <div class="about-copy"><span class="eyebrow eyebrow-small">${e(ex.aboutEyebrow)}</span><h2 id="about-title">${e(ex.aboutTitle)}</h2>
  <p>${e(copy.infoPages.about.sections[0]?.body ?? '')}</p>
  ${anchor(root ? 'en/about/index.html' : 'about/index.html', e(ex.aboutLink) + '<span aria-hidden="true">↗</span>', 'text-link')}</div></div></section>`;
  const contact = `<section id="contact" class="section contact-section" aria-labelledby="contact-title"><div class="container">
  <div class="contact-panel"><span class="eyebrow eyebrow-small">${e(ex.contactEyebrow)}</span><h2 id="contact-title">${e(copy.contact.title)}</h2>
  <p>${e(copy.contact.body)}</p>
  ${anchor('mailto:' + businessEmail, e(copy.contact.cta) + '<span aria-hidden="true">↗</span>', 'button button-light')}
  <div class="contact-decoration" aria-hidden="true"><span></span><span></span><span></span></div></div></div></section>`;

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
  return shell({ locale, copy, prefix, root }, copy.meta.title, copy.meta.description, '',
    `<main id="main-content">${top}${products}${about}${contact}</main>`, structured);
}

export function infoPage(locale: Locale, copy: LocaleContent, slug: InfoSlug): string {
  const page = copy.infoPages[slug];
  const sections = page.sections.map((section) =>
    `<section class="info-section"><h2>${e(section.heading)}</h2><p>${e(section.body)}</p></section>`).join('');
  const fallback = '../index.html#' + (slug === 'about' ? 'about' : 'footer');
  const back = anchor(fallback, '← ' + e(copy.experience.back), 'text-link info-back', false, ' data-return-to-previous');
  const body = `<main id="main-content" class="info-page"><div class="container info-container">
    ${back}<div><span class="eyebrow eyebrow-small">MIMA LABS</span><h1>${e(page.title)}</h1>
    <p class="info-intro">${e(page.intro)}</p></div><div class="info-sections">${sections}</div></div></main>`;
  return shell({ locale, copy, prefix: '../../', slug }, page.title + ' | MIMA LABS', page.intro, slug + '/', body);
}
