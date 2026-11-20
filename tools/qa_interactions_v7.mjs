import { Window } from 'happy-dom';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const products = JSON.parse(readFileSync(resolve(root, 'content/products.json'), 'utf8'));
const featuredCount = products.filter((product) => product.heroPosition).length;
const javascript = readFileSync(resolve(root, 'site/assets/site.js'), 'utf8');
const checks = [];

// Use the actual generated markup and browser bundle to exercise the visitor flows.
function page(locale) {
  const window = new Window({ url: 'https://mimalabs.github.io/' + locale + '/index.html' });
  const html = readFileSync(resolve(root, 'site', locale, 'index.html'), 'utf8');
  window.document.write(html);
  window.document.close();
  // Emulate a pre-scrolled page. The old code would focus the footer and jump.
  Object.defineProperty(window, 'scrollY', { value: 350, writable: true, configurable: true });
  let scrollCalls = 0;
  window.scrollTo = ({ top }) => { window.scrollY = top; scrollCalls++; };
  window.eval(javascript);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return { window, scrollCalls: () => scrollCalls };
}

for (const locale of ['en', 'de', 'es', 'fr', 'it', 'ca']) {
  const { window, scrollCalls } = page(locale);
  const document = window.document;
  const banner = document.querySelector('#cookie-consent');
  assert.equal(banner.hidden, false, locale + ': banner should show on first visit');
  assert.equal(document.querySelectorAll('.hero-book[href^="#book-"]').length, featuredCount, locale + ': hero books must be links');
  for (const link of document.querySelectorAll('.hero-book')) {
    assert.ok(document.querySelector(link.getAttribute('href')), locale + ': hero link target missing');
  }
  const originalY = window.scrollY;
  const initialChoice = document.querySelector('[data-consent-choice="essential"]');
  // Instrument focus: selecting a cookie choice must not focus the far-away footer control.
  const manage = document.querySelector('[data-cookie-settings]');
  let footerFocuses = 0;
  manage.focus = () => { footerFocuses++; window.scrollY = 8000; };
  initialChoice.click();
  assert.equal(window.localStorage.getItem('mimalabs-consent-v1'), 'essential', locale + ': choice not persisted');
  assert.equal(banner.hidden, true, locale + ': banner did not close');
  assert.equal(window.scrollY, originalY, locale + ': consent scrolled page');
  assert.equal(scrollCalls(), 0, locale + ': consent called scrollTo');
  assert.equal(footerFocuses, 0, locale + ': consent focused footer');
  manage.click();
  assert.equal(banner.hidden, false, locale + ': preferences failed to reopen');
  const reopenedY = window.scrollY;
  document.querySelector('[data-consent-choice="all"]').click();
  assert.equal(window.localStorage.getItem('mimalabs-consent-v1'), 'all', locale + ': acceptance not saved');
  assert.equal(banner.hidden, true, locale + ': acceptance did not close');
  assert.equal(window.scrollY, reopenedY, locale + ': acceptance caused jump');
  const menu = document.querySelector('.menu-trigger');
  menu.click();
  assert.equal(menu.getAttribute('aria-expanded'), 'true', locale + ': mobile menu did not open');
  document.querySelector('#mobile-navigation a[href="#books"]').click();
  assert.equal(menu.getAttribute('aria-expanded'), 'false', locale + ': menu did not close after navigation');
  window.close();
  checks.push(locale + ': cookie choice, persistence, reopening, no scroll jump, menu and book links');
}
const report = { status: 'PASS', checks: checks.length, locales: checks, browserRendering: 'Not included: this is a DOM interaction regression test' };
writeFileSync(resolve(root, 'INTERACTION_QA_V7.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
