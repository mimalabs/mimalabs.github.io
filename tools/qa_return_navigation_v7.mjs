/** Page return behavior and outbound social destinations. */
import assert from 'node:assert/strict';
import { infoSlugs, locales, origin, readSite, writeReport } from './qa/support.mjs';
import { click, openPage, startClient } from './qa/dom.mjs';

const javascript = readSite('assets', 'site.js');
const amazonShop = 'https://www.amazon.com/stores/MIMA-LABS/author/B0HK8LMHW3';

function assertSocialLinks(locale) {
  const window = openPage(`${locale}/index.html`);
  try {
    const { document } = window;
    const header = document.querySelector('.site-header');
    const footer = document.querySelector('.site-footer');
    const areas = [
      header.querySelector('.header-social-links'),
      header.querySelector('.header-social-details'),
      footer,
    ];
    for (const [index, area] of areas.entries()) {
      assert.equal(area.querySelectorAll('a.social-link').length, 3, `${locale}: social links in area ${index}`);
      const amazon = area.querySelector('a[href*="amazon.com/stores/"]');
      assert.equal(amazon?.href, amazonShop, `${locale}: Amazon shop destination`);
      assert.equal(amazon?.getAttribute('target'), '_blank', `${locale}: Amazon opens a tab`);
      assert.equal(amazon?.getAttribute('rel'), 'noopener noreferrer', `${locale}: tab isolation`);
    }
  } finally {
    window.close();
  }
}

function configureHistory(window, referrer) {
  Object.defineProperty(window.document, 'referrer', { configurable: true, value: referrer });
  Object.defineProperty(window.history, 'length', { configurable: true, value: 2 });
  let calls = 0;
  window.history.back = () => { calls++; };
  return () => calls;
}

function assertReturnFromInfo(locale, slug) {
  const window = openPage(`${locale}/${slug}/index.html`);
  try {
    const backCalls = configureHistory(window, `${origin}/${locale}/index.html`);
    startClient(window, javascript);
    const link = window.document.querySelector('[data-return-to-previous]');
    assert.equal(link?.getAttribute('href'), `../index.html${slug === 'about' ? '#about' : '#footer'}`, `${locale}/${slug}: fallback destination`);
    const event = click(window, link);
    assert.equal(event.defaultPrevented, true, `${locale}/${slug}: same-origin referrer uses history`);
    assert.equal(backCalls(), 1, `${locale}/${slug}: returns exactly once`);
  } finally {
    window.close();
  }
}

function assertExternalEntryPreservesFallback(referrer) {
  const window = openPage('en/faq/index.html');
  try {
    const backCalls = configureHistory(window, referrer);
    startClient(window, javascript);
    const event = click(window, window.document.querySelector('[data-return-to-previous]'));
    assert.equal(event.defaultPrevented, false, 'external entry should follow the visible fallback link');
    assert.equal(backCalls(), 0, 'external entry must not leave browser history');
  } finally {
    window.close();
  }
}

for (const locale of locales) {
  assertSocialLinks(locale);
  for (const slug of infoSlugs) assertReturnFromInfo(locale, slug);
}
assertExternalEntryPreservesFallback('');
assertExternalEntryPreservesFallback('https://example.com/landing.html');

writeReport('RETURN_NAV_QA_V7.json', {
  status: 'PASS', infoPages: locales.length * infoSlugs.length, locales: locales.length,
  checks: [
    'Same-origin info page Back uses history for scroll restoration',
    'Direct/external visitors use About or footer fallback',
    'Three header/footer social links include exact Amazon shop URL, accessible name, safe new tab',
  ],
});
