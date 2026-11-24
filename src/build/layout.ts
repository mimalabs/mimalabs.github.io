import { languageLabels, locales, type Locale, type LocaleContent, type InfoSlug } from '../shared/model.js';
import { publicLocations, socials, siteUrl } from './config.js';
import { anchor, escapeHtml as e, image, socialIcon } from './html.js';
import { canonicalHref, languageAlternates } from './seo.js';
import { markup, view } from './view.js';

interface PageContext {
  locale: Locale;
  copy: LocaleContent;
  prefix: string;
  slug?: InfoSlug;
  root?: boolean;
}

/** Controllers prepare data and trusted fragments. Views own the markup. */
export function topNav({ locale, copy, prefix, slug, root }: PageContext): string {
  const ex = copy.experience;
  const nav = copy.nav;
  const section = (target: string) => slug ? '../index.html#' + target : '#' + target;
  const langBase = slug ? '../../' : root ? '' : '../';
  const languageOptions = locales.map((language) => anchor(
    langBase + language + '/' + (slug ? slug + '/' : '') + 'index.html',
    `<span>${e(languageLabels[language])}</span><span aria-hidden="true">${language === locale ? '✓' : ''}</span>`,
    `language-item${language === locale ? ' current' : ''}`,
    false,
    ` lang="${language}"${language === locale ? ' aria-current="page"' : ''}`,
  )).join('');
  const logo = image(prefix + 'assets/brand/mima-labs-mark.webp', '', 43, 43, 'brand-icon', true);
  const social = Object.entries(socials).map(([name, href]) =>
    anchor(href, socialIcon(name), 'social-link', true, ` aria-label="${e(name)}" title="${e(name)}"`)).join('');
  const headerSocials = view('partials/header-socials', { social: markup(social) });
  const navLinks = (mobile = false) => ([
    ['books', nav.products], ['about', nav.about], ['contact', nav.contact],
  ] as const).map(([id, label]) => anchor(section(id), e(label) + (mobile ? '<span aria-hidden="true">↗</span>' : ''))).join('');
  return view('partials/header', {
    homeLink: markup(anchor(section('home'), logo + '<span>MIMA <strong>LABS</strong></span>', 'brand-lockup', false, ' aria-label="MIMA LABS — home"')),
    menuLabel: ex.menu,
    desktopNav: markup(navLinks()), mobileNav: markup(navLinks(true)),
    headerSocials: markup(headerSocials),
    languageLabel: ex.language, languageName: languageLabels[locale], localeLabel: locale.toUpperCase(),
    languageOptions: markup(languageOptions), closeLabel: ex.closeMenu,
  });
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
  return view('partials/footer', {
    homeLink: markup(anchor(section('home'), 'MIMA LABS <span>✦</span>', 'footer-wordmark')),
    footerPrompt: ex.footerPrompt, social: markup(social),
    exploreLabel: f.exploreLabel, exploreLinks: markup(explore),
    legalLabel: f.legalLabel, legalLinks: markup(legal),
    year: new Date().getUTCFullYear(), location: publicLocations[locale], disclaimer: ex.footerDisclaimer,
  });
}

function cookieConsent({ locale, copy, prefix, slug, root }: PageContext): string {
  const c = copy.cookieConsent;
  const cookieLink = root ? prefix + locale + '/cookies/index.html' : slug ? '../cookies/index.html' : 'cookies/index.html';
  return view('partials/cookie-consent', {
    title: c.title, body: c.body, cookieLink,
    learnMore: c.learnMore, essentialOnly: c.essentialOnly, acceptAll: c.acceptAll,
  });
}

export function shell(
  context: PageContext,
  title: string,
  description: string,
  path: string,
  body: string,
  structured?: unknown,
): string {
  const { locale, copy, prefix } = context;
  const canonical = canonicalHref(locale, path);
  const alternates = languageAlternates(path).map(({ language, href }) =>
    `<link rel="alternate" hreflang="${language}" href="${e(href)}">`).join('');
  const ogImage = siteUrl + '/assets/mimalabs-social-preview.jpg';
  const ldjson = structured ? `<script type="application/ld+json">${JSON.stringify(structured).replaceAll('<', '\\u003c')}</script>` : '';
  return view('layout/document', {
    locale, title, description, canonical,
    alternates: markup(alternates), ogImage, prefix,
    structuredData: markup(ldjson), skipLabel: copy.experience.skip,
    header: markup(topNav(context)), body: markup(body),
    footer: markup(footer(context)), cookieConsent: markup(cookieConsent(context)),
    backToTopLabel: copy.common.backToTop,
  });
}
