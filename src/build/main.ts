import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { infoSlugs, locales } from '../shared/model.js';
import { readContent } from './content.js';
import { siteUrl } from './config.js';
import { escapeHtml as e } from './html.js';
import { homePage, infoPage } from './pages.js';
import { sitemapRoutes } from './seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(root, 'site');
const { books, translations } = readContent(root);
function write(path: string, contents: string): void {
  const file = join(site, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents, 'utf8');
}
for (const locale of locales) {
  const copy = translations[locale];
  write(locale + '/index.html', homePage(locale, copy, books));
  for (const slug of infoSlugs) write(locale + '/' + slug + '/index.html', infoPage(locale, copy, slug));
}
write('index.html', homePage('en', translations.en, books, true));
write('404.html', '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | MIMA LABS</title><link rel="stylesheet" href="assets/styles.css"></head><body><main class="container info-page"><span class="eyebrow">MIMA LABS</span><h1>Page not found</h1><p>The page may have moved.</p><a href="en/index.html" class="button button-dark">Home ↗</a></main></body></html>');
write('robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + siteUrl + '/sitemap.xml\n');
const routes = sitemapRoutes();
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  + routes.map((route) => '<url><loc>' + e(siteUrl + route) + '</loc></url>').join('') + '</urlset>\n');
write('.nojekyll', '');
console.log(`Built ${routes.length + 2} localized pages (single TypeScript source, ${locales.length} locales) to ${site}`);
