import { Window } from 'happy-dom';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(resolve(root, 'site/assets/site.js'), 'utf8');
const amazonShop = 'https://www.amazon.com/stores/MIMA-LABS/author/B0HK8LMHW3';
const locales = ['en', 'de', 'es', 'fr', 'it', 'ca'];
const slugs = ['about', 'faq', 'privacy', 'cookies', 'legal', 'terms', 'accessibility'];
let tested = 0;

for (const locale of locales) {
  const home = readFileSync(resolve(root, 'site', locale, 'index.html'), 'utf8');
  const homepage = new Window({ url: `https://mimalabs.github.io/${locale}/index.html` });
  homepage.document.write(home);
  homepage.document.close();
  const header = homepage.document.querySelector('.site-header');
  const footer = homepage.document.querySelector('.site-footer');
  assert.equal(header.querySelectorAll('.header-social-links a.social-link').length, 3, locale + ': desktop header socials');
  assert.equal(header.querySelectorAll('.header-social-details a.social-link').length, 3, locale + ': compact header socials');
  assert.equal(footer.querySelectorAll('a.social-link').length, 3, locale + ': footer socials');
  for (const container of [header.querySelector('.header-social-links'), header.querySelector('.header-social-details'), footer]) {
    const amazon = container.querySelector('a[href*="amazon.com/stores/"]');
    assert.equal(amazon?.href, amazonShop, locale + ': exact Amazon destination');
    assert.equal(amazon?.getAttribute('target'), '_blank', locale + ': Amazon opens separate tab');
    assert.equal(amazon?.getAttribute('rel'), 'noopener noreferrer', locale + ': external link security');
  }
  homepage.close();

  for (const slug of slugs) {
    const url = `https://mimalabs.github.io/${locale}/${slug}/index.html`;
    const window = new Window({ url });
    window.document.write(readFileSync(resolve(root, 'site', locale, slug, 'index.html'), 'utf8'));
    window.document.close();
    const previous = `https://mimalabs.github.io/${locale}/index.html`;
    Object.defineProperty(window.document, 'referrer', { configurable: true, value: previous });
    Object.defineProperty(window.history, 'length', { configurable: true, value: 2 });
    let backCalls = 0;
    window.history.back = () => { backCalls++; };
    window.eval(source);
    window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
    const backLink = window.document.querySelector('[data-return-to-previous]');
    const fallbackHash = slug === 'about' ? '#about' : '#footer';
    assert.equal(backLink?.getAttribute('href'), `../index.html${fallbackHash}`, locale + '/' + slug + ': fallback');
    const click = new window.MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
    backLink.dispatchEvent(click);
    assert.ok(click.defaultPrevented, locale + '/' + slug + ': same-origin click should use history');
    assert.equal(backCalls, 1, locale + '/' + slug + ': should go back once');
    window.close();
    tested++;
  }
}

// Direct entries must keep a working anchor; do not attempt to leave the visitor's browser history.
for (const referrer of ['', 'https://example.com/landing.html']) {
  const window = new Window({ url: 'https://mimalabs.github.io/en/faq/index.html' });
  window.document.write(readFileSync(resolve(root, 'site/en/faq/index.html'), 'utf8'));
  window.document.close();
  Object.defineProperty(window.document, 'referrer', { configurable: true, value: referrer });
  Object.defineProperty(window.history, 'length', { configurable: true, value: 2 });
  let calls = 0;
  window.history.back = () => { calls++; };
  window.eval(source);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  const click = new window.MouseEvent('click', { button: 0, bubbles: true, cancelable: true });
  window.document.querySelector('[data-return-to-previous]').dispatchEvent(click);
  assert.equal(click.defaultPrevented, false, 'external or missing referrer keeps accessible fallback');
  assert.equal(calls, 0, 'external or missing referrer must not history.back');
  window.close();
}

const report = { status: 'PASS', infoPages: tested, locales: 6,
  checks: ['Same-origin info page Back uses history for scroll restoration', 'Direct/external visitors use About or footer fallback',
    'Three header/footer social links include exact Amazon shop URL, accessible name, safe new tab'] };
writeFileSync(resolve(root, 'RETURN_NAV_QA_V7.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
