/** SEO contract for the public generated site, independent of the view engine. */
import assert from 'node:assert/strict';
import { infoSlugs, locales, origin, readSite } from './qa/support.mjs';

const paths = locales.flatMap((locale) => [
  [`${locale}/index.html`, locale === 'en' ? '/' : `/${locale}/`, ''],
  ...infoSlugs.map((slug) => [`${locale}/${slug}/index.html`, `/${locale}/${slug}/`, `${slug}/`]),
]);
paths.push(['index.html', '/', '']);

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\s[^>]*>`, 'g'))].map(([tag]) => tag);
}
function attribute(tag, name) {
  return new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];
}
function canonicalPath(locale, suffix) {
  return locale === 'en' && !suffix ? '/' : `/${locale}/${suffix}`;
}
function assertSeo(file, pathname, suffix) {
  const html = readSite(...file.split('/'));
  const url = origin + pathname;
  const locale = file === 'index.html' ? 'en' : file.split('/')[0];
  const links = tags(html, 'link');
  const canonical = links.filter((tag) => attribute(tag, 'rel') === 'canonical');
  const alternate = links.filter((tag) => attribute(tag, 'rel') === 'alternate');
  const alternates = new Map(alternate.map((tag) => [attribute(tag, 'hreflang'), attribute(tag, 'href')]));

  assert.match(html, new RegExp(`<html lang="${locale}"`), `${file}: language`);
  assert.match(html, /<title>[^<]+<\/title>/, `${file}: title`);
  assert.match(html, /<meta name="description" content="[^"]+">/, `${file}: description`);
  assert.equal(canonical.length, 1, `${file}: canonical count`);
  assert.equal(attribute(canonical[0], 'href'), url, `${file}: canonical URL`);
  assert.equal(alternate.length, locales.length + 1, `${file}: language alternatives`);
  assert.equal(alternates.size, locales.length + 1, `${file}: unique hreflang`);
  for (const lang of locales) {
    assert.equal(alternates.get(lang), origin + canonicalPath(lang, suffix), `${file}: ${lang} hreflang`);
  }
  assert.equal(alternates.get('x-default'), origin + canonicalPath('en', suffix), `${file}: default language`);
  const og = tags(html, 'meta').filter((tag) => attribute(tag, 'property') === 'og:url');
  assert.equal(og.length, 1, `${file}: Open Graph URL count`);
  assert.equal(attribute(og[0], 'content'), url, `${file}: Open Graph URL`);
  assert.ok(html.includes(`${origin}/assets/mimalabs-social-preview.jpg`), `${file}: social image`);
  assert.ok(!html.includes('mimalabs.github.io'), `${file}: old domain`);
}

for (const [file, pathname, suffix] of paths) assertSeo(file, pathname, suffix);

const sitemap = readSite('sitemap.xml');
const actual = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expected = new Set(paths.map(([, pathname]) => origin + pathname));
assert.equal(actual.length, expected.size, 'sitemap contains no duplicate routes');
assert.deepEqual(new Set(actual), expected, 'sitemap matches all canonical routes');
assert.equal(readSite('robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
assert.ok(!sitemap.includes('mimalabs.github.io'), 'sitemap uses the production domain');
console.log(`PASS: SEO canonical, hreflang, social metadata and sitemap for ${paths.length} pages / ${expected.size} canonical routes`);
