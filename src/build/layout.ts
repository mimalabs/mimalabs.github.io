import { languageLabels, locales, type Locale, type LocaleContent, type InfoSlug } from '../shared/model.js';
import { publicLocations, socials, siteUrl } from './config.js';
import { anchor, escapeHtml as e, image, socialIcon } from './html.js';
import { canonicalHref, languageAlternates } from './seo.js';

interface PageContext {
  locale: Locale;
  copy: LocaleContent;
  prefix: string;
  slug?: InfoSlug;
  root?: boolean;
}

export function topNav({ locale, copy, prefix, slug, root }: PageContext): string {
  const ex = copy.experience;
  const nav = copy.nav;
  const section = (target: string) => slug ? '../index.html#' + target : '#' + target;
  const langBase = slug ? '../../' : root ? '' : '../';
  const options = locales.map((language) => anchor(
    langBase + language + '/' + (slug ? slug + '/' : '') + 'index.html',
    `<span>${e(languageLabels[language])}</span><span aria-hidden="true">${language === locale ? '✓' : ''}</span>`,
    `language-item${language === locale ? ' current' : ''}`,
    false,
    ` lang="${language}"${language === locale ? ' aria-current="page"' : ''}`,
  )).join('');
  const logo = image(prefix + 'assets/brand/mima-labs-mark.webp', '', 43, 43, 'brand-icon', true);
  const social = Object.entries(socials).map(([name, href]) =>
    anchor(href, socialIcon(name), 'social-link', true, ` aria-label="${e(name)}" title="${e(name)}"`)).join('');
  const headerSocials = `<nav class="header-social-links social-links" aria-label="Social media">${social}</nav>
    <details class="header-social-details"><summary class="header-social-toggle" aria-label="Social media" title="Social media"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/></svg></summary><nav class="header-social-popover social-links" aria-label="Social media">${social}</nav></details>`;
  const burger = '<span class="burger"><span></span><span></span></span>';
  const navLinks = (mobile = false) => ([
    ['books', nav.products], ['about', nav.about], ['contact', nav.contact],
  ] as const).map(([id, label]) => anchor(section(id), e(label) + (mobile ? '<span aria-hidden="true">↗</span>' : ''))).join('');
  return `<header class="site-header"><div class="container nav-row">
  ${anchor(section('home'), logo + '<span>MIMA <strong>LABS</strong></span>', 'brand-lockup', false, ' aria-label="MIMA LABS — home"')}
  <nav class="desktop-nav" aria-label="${e(ex.menu)}">${navLinks()}</nav>
  <noscript><nav class="mobile-noscript" aria-label="${e(ex.menu)}">${navLinks()}</nav></noscript>
  <div class="nav-actions">${headerSocials}<details class="lang-details"><summary class="language-trigger" aria-label="${e(ex.language)}: ${e(languageLabels[locale])}"><span>${locale.toUpperCase()}</span><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="language-dropdown">${options}</div></details>
  <div class="mobile-menu"><button type="button" class="menu-trigger" aria-controls="mobile-navigation" aria-expanded="false" aria-label="${e(ex.menu)}" data-open-label="${e(ex.menu)}" data-close-label="${e(ex.closeMenu)}">${burger}</button>
  <nav id="mobile-navigation" class="mobile-menu-panel" hidden aria-label="${e(ex.menu)}">${navLinks(true)}</nav></div></div></div></header>`;
}

export function footer({ locale, copy, prefix, slug }: PageContext): string {
  const ex = copy.experience;
  const f = copy.footer;
  const base = prefix + locale + '/';
  const section = (target: string) => slug ? '../index.html#' + target : '#' + target;
  const social = Object.entries(socials).map(([name, href]) =>
    anchor(href, socialIcon(name), 'social-link', true, ` aria-label="${e(name)}" title="${e(name)}"`)).join('');
  const explore = anchor(section('about'), e(f.links.about))
    + anchor(base + 'faq/index.html', e(f.links.faq))
    + anchor(section('books'), e(copy.nav.products));
  const legal = (['privacy', 'cookies', 'legal', 'terms', 'accessibility'] as InfoSlug[])
    .map((id) => anchor(base + id + '/index.html', e(f.links[id]))).join('')
    + `<button type="button" class="footer-cookie-preferences" data-cookie-settings>${e(copy.cookieConsent.manage)}</button>`;
  return `<footer id="footer" class="site-footer"><div class="container"><div class="footer-main">
  <div class="footer-brand">${anchor(section('home'), 'MIMA LABS <span>✳</span>', 'footer-wordmark')}<p>${e(ex.footerPrompt)}</p><nav class="social-links social-links--footer" aria-label="Social media">${social}</nav></div>
  <nav class="footer-links" aria-label="${e(f.exploreLabel)}"><span class="footer-label">${e(f.exploreLabel)}</span>${explore}</nav>
  <nav class="footer-links" aria-label="${e(f.legalLabel)}"><span class="footer-label">${e(f.legalLabel)}</span>${legal}</nav>
  </div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} MIMA LABS · ${e(publicLocations[locale])}</span><span>${e(ex.footerDisclaimer)}</span></div></div></footer>`;
}

function cookieConsent({ locale, copy, prefix, slug, root }: PageContext): string {
  const c = copy.cookieConsent;
  const cookieLink = root ? prefix + locale + '/cookies/index.html' : slug ? '../cookies/index.html' : 'cookies/index.html';
  return `<aside id="cookie-consent" class="cookie-banner" role="region" aria-label="${e(c.title)}" hidden>
  <div class="cookie-banner-copy"><strong>${e(c.title)}</strong><p>${e(c.body)}</p><a href="${e(cookieLink)}">${e(c.learnMore)}</a></div>
  <div class="cookie-banner-actions"><button type="button" class="cookie-button-secondary" data-consent-choice="essential">${e(c.essentialOnly)}</button>
  <button type="button" class="cookie-button-primary" data-consent-choice="all">${e(c.acceptAll)}</button></div></aside>`;
}

export function shell(
  context: PageContext,
  title: string,
  description: string,
  path: string,
  body: string,
  structured?: unknown,
): string {
  const { locale, copy, prefix, root } = context;
  const canonical = canonicalHref(locale, path);
  const alternates = languageAlternates(path).map(({ language, href }) =>
    `<link rel="alternate" hreflang="${language}" href="${e(href)}">`).join('');
  const ogImage = siteUrl + '/assets/mimalabs-social-preview.jpg';
  const ldjson = structured ? `<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<', '\\u003c')}</script>` : '';
  return `<!doctype html><html lang="${locale}"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light"><meta name="theme-color" content="#faf8f2">
  <title>${e(title)}</title><meta name="description" content="${e(description)}">
  <meta name="robots" content="index, follow"><link rel="canonical" href="${e(canonical)}">
  ${alternates}
  <meta property="og:type" content="website"><meta property="og:site_name" content="MIMA LABS">
  <meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(ogImage)}"><meta property="og:image:alt" content="MIMA LABS — coloring books">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(description)}"><meta name="twitter:image" content="${e(ogImage)}">
  <link rel="icon" href="${e(prefix)}assets/brand/mima-labs-mark.webp" type="image/webp">
  <link rel="stylesheet" href="${e(prefix)}assets/styles.css">
  ${ldjson}
  </head><body><a class="skip-link" href="#main-content">${e(copy.experience.skip)}</a>
  ${topNav(context)}
  ${body}
  ${footer(context)}
  ${cookieConsent(context)}
  <button type="button" id="back-to-top" class="back-to-top" aria-label="${e(copy.common.backToTop)}" title="${e(copy.common.backToTop)}" hidden><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 14 7-7 7 7M12 7v12"/></svg></button>
  <script defer src="${e(prefix)}assets/site.js"></script></body></html>`;
}
