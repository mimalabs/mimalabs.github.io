/** User-visible cookie, menu and product navigation behavior in every locale. */
import assert from 'node:assert/strict';
import { locales, readProducts, readSite, writeReport } from './qa/support.mjs';
import { openPage, startClient } from './qa/dom.mjs';

const javascript = readSite('assets', 'site.js');
const featuredCount = readProducts().filter((product) => product.heroPosition).length;
const checks = [];

function assertHeroLinks(document, locale) {
  const links = document.querySelectorAll('.hero-book[href^="#book-"]');
  assert.equal(links.length, featuredCount, `${locale}: featured books link count`);
  for (const link of links) {
    assert.ok(document.querySelector(link.getAttribute('href')), `${locale}: book destination exists`);
  }
}

function assertCookieChoices(window, locale, scrollCalls) {
  const { document } = window;
  const banner = document.querySelector('#cookie-consent');
  const settings = document.querySelector('[data-cookie-settings]');
  assert.equal(banner.hidden, false, `${locale}: new visitor sees consent options`);

  let footerFocuses = 0;
  settings.focus = () => { footerFocuses++; window.scrollY = 8000; };
  const before = window.scrollY;
  document.querySelector('[data-consent-choice="essential"]').click();
  assert.equal(window.localStorage.getItem('mimalabs-consent-v1'), 'essential', `${locale}: essential consent saved`);
  assert.equal(banner.hidden, true, `${locale}: consent closes`);
  assert.equal(window.scrollY, before, `${locale}: no forced scroll`);
  assert.equal(scrollCalls(), 0, `${locale}: no scrollTo call`);
  assert.equal(footerFocuses, 0, `${locale}: footer not focused`);

  settings.click();
  assert.equal(banner.hidden, false, `${locale}: settings reopens`);
  const reopenedY = window.scrollY;
  document.querySelector('[data-consent-choice="all"]').click();
  assert.equal(window.localStorage.getItem('mimalabs-consent-v1'), 'all', `${locale}: full consent saved`);
  assert.equal(banner.hidden, true, `${locale}: consent closes after acceptance`);
  assert.equal(window.scrollY, reopenedY, `${locale}: accepting causes no jump`);
}

function assertMobileMenu(document, locale) {
  const trigger = document.querySelector('.menu-trigger');
  trigger.click();
  assert.equal(trigger.getAttribute('aria-expanded'), 'true', `${locale}: menu opens`);
  document.querySelector('#mobile-navigation a[href="#books"]').click();
  assert.equal(trigger.getAttribute('aria-expanded'), 'false', `${locale}: selecting a section closes menu`);
}

for (const locale of locales) {
  const window = openPage(`${locale}/index.html`);
  try {
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 350 });
    let scrolled = 0;
    window.scrollTo = ({ top }) => { window.scrollY = top; scrolled++; };
    startClient(window, javascript);
    assertHeroLinks(window.document, locale);
    assertCookieChoices(window, locale, () => scrolled);
    assertMobileMenu(window.document, locale);
    checks.push(`${locale}: cookie choice, persistence, reopening, no scroll jump, menu and book links`);
  } finally {
    window.close();
  }
}

writeReport('INTERACTION_QA_V7.json', {
  status: 'PASS', checks: checks.length, locales: checks,
  browserRendering: 'Not included: this is a DOM interaction regression test',
});
