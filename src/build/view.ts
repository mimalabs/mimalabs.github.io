import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { escapeHtml } from './escape.js';

/** A fragment already rendered by our own HTML helpers or another view. */
export interface HtmlFragment { readonly kind: 'trusted-html'; readonly value: string }
export const markup = (value: string): HtmlFragment => ({ kind: 'trusted-html', value });

type ViewValue = string | number | HtmlFragment;

/** Compile-time contracts: controllers cannot accidentally forget a view property. */
interface ViewModels {
  'layout/document': {
    locale: string; title: string; description: string; canonical: string;
    alternates: HtmlFragment; ogImage: string; prefix: string; structuredData: HtmlFragment;
    skipLabel: string; header: HtmlFragment; body: HtmlFragment; footer: HtmlFragment;
    cookieConsent: HtmlFragment; backToTopLabel: string;
  };
  'components/link': { href: string; classes: HtmlFragment; target: HtmlFragment; extra: HtmlFragment; body: HtmlFragment };
  'components/image': { src: string; alt: string; width: number; height: number; loading: string; priority: HtmlFragment; classes: HtmlFragment };
  'components/social-svg': { paths: HtmlFragment };
  'components/icon-instagram': Record<string, never>;
  'components/icon-tiktok': Record<string, never>;
  'components/icon-amazon': Record<string, never>;
  'partials/header-socials': { social: HtmlFragment };
  'partials/header': {
    homeLink: HtmlFragment; menuLabel: string; desktopNav: HtmlFragment; mobileNav: HtmlFragment;
    headerSocials: HtmlFragment; languageLabel: string; languageName: string;
    localeLabel: string; languageOptions: HtmlFragment; closeLabel: string;
  };
  'partials/footer': {
    homeLink: HtmlFragment; footerPrompt: string; social: HtmlFragment;
    exploreLabel: string; exploreLinks: HtmlFragment; legalLabel: string; legalLinks: HtmlFragment;
    year: number; location: string; disclaimer: string;
  };
  'partials/cookie-consent': {
    title: string; body: string; cookieLink: string; learnMore: string;
    essentialOnly: string; acceptAll: string;
  };
  'partials/feature': { symbol: string; label: string };
  'pages/hero': {
    eyebrow: string; heroTitle: string; heroBody: string; discoverLink: HtmlFragment;
    newLabel: string; productsTitle: string; heroBooks: HtmlFragment;
    introLabel: string; features: HtmlFragment;
  };
  'pages/book-available': { buyLink: HtmlFragment; availability: string };
  'pages/book-unavailable': { comingSoon: string };
  'pages/book-placeholder': { altText: string; theme: string };
  'pages/book-card': {
    bookId: string; panelTheme: string; coverHtml: HtmlFragment; theme: string;
    detailLabel: string; age: string; headingHtml: HtmlFragment;
    description: string; buyHtml: HtmlFragment;
  };
  'pages/books': {
    collectionLabel: string; title: string; intro: string; bookCount: number; cards: HtmlFragment;
  };
  'pages/about': {
    logoImage: HtmlFragment; eyebrow: string; title: string; intro: string; aboutLink: HtmlFragment;
  };
  'pages/contact': {
    eyebrow: string; title: string; body: string; mailLink: HtmlFragment;
  };
  'pages/home': { hero: HtmlFragment; books: HtmlFragment; about: HtmlFragment; contact: HtmlFragment };
  'pages/info-section': { heading: string; body: string };
  'pages/info': { backLink: HtmlFragment; title: string; intro: string; sections: HtmlFragment };
  'pages/404': Record<string, never>;
}
const cache = new Map<string, string>();
const viewRoot = resolve(process.cwd(), 'src', 'views');

/**
 * Minimal build-time view renderer: {{name}} is HTML-escaped by default.
 * Only fragments explicitly wrapped with markup() bypass escaping.
 * Every variable must exist; otherwise the build fails rather than shipping broken HTML.
 * No client-side templating engine or additional production dependency.
 */
export function view<Name extends keyof ViewModels>(name: Name, data: ViewModels[Name]): string {
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(name)) {
    throw new Error(`Invalid view name: ${name}`);
  }
  let template = cache.get(name);
  if (template === undefined) {
    template = readFileSync(join(viewRoot, `${name}.html`), 'utf8');
    cache.set(name, template);
  }
  return template.replace(/{{\s*([a-zA-Z][a-zA-Z0-9]*)\s*}}/g, (_placeholder, key: string) => {
    if (!Object.hasOwn(data, key)) throw new Error(`View ${name} is missing variable ${key}`);
    const value = (data as Record<string, ViewValue>)[key];
    if (value === undefined) throw new Error(`View ${name} has undefined variable ${key}`);
    return typeof value === 'object' ? value.value : escapeHtml(value);
  });
}
