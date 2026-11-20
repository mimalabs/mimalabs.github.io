import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const origin = 'https://www.mimalabsworld.com';
const languages = ['en', 'de', 'es', 'fr', 'it', 'ca'];
const infoSlugs = ['about', 'faq', 'privacy', 'cookies', 'legal', 'terms', 'accessibility'];
const site = new URL('../site/', import.meta.url).pathname;
const read = (path) => readFileSync(join(site, path), 'utf8');
const paths = [...languages.flatMap((language) => [
  [language + '/index.html', language === 'en' ? '/' : `/${language}/`, ''],
  ...infoSlugs.map((slug) => [
    `${language}/${slug}/index.html`, `/${language}/${slug}/`, `${slug}/`,
  ]),
]), ['index.html', '/', '']];

function attribute(tag, key) {
  return new RegExp(`${key}="([^"]*)"`).exec(tag)?.[1];
}
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\s[^>]*>`, 'g'))].map(([tag]) => tag);
}
function canonicalPath(language, pagePath) {
  return !pagePath && language === 'en' ? '/' : `/${language}/${pagePath}`;
}

for (const [file, expectedPath, pagePath] of paths) {
  const html = read(file);
  const expectedUrl = origin + expectedPath;
  const htmlLang = /<html lang="([^"]+)"/.exec(html)?.[1];
  assert.equal(htmlLang, file === 'index.html' ? 'en' : file.split('/')[0], `${file}: html language`);
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: title`);
  assert.match(html, /<meta name="description" content="[^"]+">/, `${file}: description`);
  const links = tags(html, 'link');
  const canonicals = links.filter((tag) => attribute(tag, 'rel') === 'canonical');
  assert.equal(canonicals.length, 1, `${file}: one canonical`);
  assert.equal(attribute(canonicals[0], 'href'), expectedUrl, `${file}: canonical URL`);
  const alternatives = links.filter((tag) => attribute(tag, 'rel') === 'alternate');
  assert.equal(alternatives.length, languages.length + 1, `${file}: alternate count`);
  const actual = new Map(alternatives.map((tag) => [attribute(tag, 'hreflang'), attribute(tag, 'href')]));
  assert.equal(actual.size, languages.length + 1, `${file}: unique hreflang`);
  for (const language of languages) {
    assert.equal(actual.get(language), origin + canonicalPath(language, pagePath), `${file}: ${language} hreflang`);
  }
  assert.equal(actual.get('x-default'), origin + canonicalPath('en', pagePath), `${file}: default hreflang`);
  const meta = tags(html, 'meta');
  const og = meta.filter((tag) => attribute(tag, 'property') === 'og:url');
  assert.equal(og.length, 1, `${file}: Open Graph URL`);
  assert.equal(attribute(og[0], 'content'), expectedUrl, `${file}: Open Graph canonical parity`);
  assert.match(html, new RegExp(`https://www\\.mimalabsworld\\.com/assets/mimalabs-social-preview\\.jpg`), `${file}: social preview`);
  assert.ok(!html.includes('mimalabs.github.io'), `${file}: stale GitHub Pages domain`);
}

const sitemap = read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const canonicalUrls = new Set(paths.map(([, path]) => origin + path));
assert.equal(canonicalUrls.size, 48, '48 canonical routes total');
assert.equal(locs.length, 48, '48 sitemap entries');
assert.deepEqual(new Set(locs), canonicalUrls, 'sitemap lists exactly the canonical routes');
assert.equal(read('robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
assert.ok(!read('sitemap.xml').includes('mimalabs.github.io'), 'no stale sitemap origin');

console.log(`PASS: SEO canonical, hreflang, social metadata and sitemap for ${paths.length} pages / 48 canonical routes`);
