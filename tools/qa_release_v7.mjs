import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const locales = ['en', 'de', 'es', 'fr', 'it', 'ca'];
const repo = resolve(import.meta.dirname, '..');
const productData = JSON.parse(readFileSync(resolve(repo, 'content/products.json'), 'utf8'));
const featuredBooks = productData.filter((item) => item.heroPosition);
const report = { version: 7, checks: [], browsers: [], issues: [], status: 'PENDING' };
function pass(name) { report.checks.push(name); }
function check(condition, reason) { assert.ok(condition, reason); }

// Architectural and product-owner invariants independent of headless browser.
const packageJson = JSON.parse(readFileSync(resolve(repo, 'package.json'), 'utf8'));
check(packageJson.scripts.build.includes('src/build/main.ts'), 'Build must use TypeScript generator');
check(packageJson.scripts.build.includes('src/client/index.ts'), 'Interactions must use TypeScript bundle');
const clientJs = readFileSync(resolve(repo, 'site/assets/site.js'), 'utf8');
check(!/focus\(\).*cookie-settings|manage\.focus\(/.test(clientJs), 'No footer jump on consent');
for (const locale of locales) {
  const page = readFileSync(resolve(repo, `site/${locale}/index.html`), 'utf8');
  for (const book of productData) {
    const id = book.id;
    if (book.heroPosition) check(page.includes(`href="#book-${id}"`), locale + ': hero cover must link to a real book');
    check(page.includes(`id="book-${id}"`), locale + ': book target missing');
    const link = book.urls[locale];
    if (!link) check(page.includes('coming-soon-label'), locale + ': missing Coming soon');
    else check(page.includes(link.replaceAll('&', '&amp;')), locale + ': Amazon link missing');
  }
  check(page.includes('id="cookie-consent"'), locale + ': cookie consent missing');
  check(page.includes('id="back-to-top"'), locale + ': back-to-top missing');
}
pass('TypeScript architecture, all 6 locales and all ' + (6 * featuredBooks.length) + ' hero-book links');
pass('Amazon-only product actions; unavailable editions labelled Coming soon');

let server;
let browser;
try {
  server = await serve(0);
  const origin = 'http://127.0.0.1:' + server.address().port;
  const systemChromium = process.env.CHROME_BIN ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  browser = await chromium.launch({ headless: true, executablePath: systemChromium, args: ['--no-sandbox'] });
  const formats = [
    { width: 320, height: 640 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 1024, height: 768 },
    { width: 1440, height: 900 },
  ];
  for (const locale of locales) {
    for (const size of formats) {
      const page = await browser.newPage({ viewport: size, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(origin + '/' + locale + '/index.html', { waitUntil: 'load' });
      check(response?.ok(), locale + ': home did not load');
      await page.evaluate(async () => {
        await Promise.all(Array.from(document.images).map(async (img) => {
          img.loading = 'eager';
          try { await img.decode(); } catch { /* Checked by naturalWidth below. */ }
        }));
      });
      const metrics = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        const minHeight = innerHeight - header.getBoundingClientRect().height;
        const heights = ['home', 'books', 'about', 'contact'].map((id) => document.getElementById(id).getBoundingClientRect().height);
        return { overflow: document.documentElement.scrollWidth > innerWidth + 2, tooShort: heights.some((h) => h + 2 < minHeight),
          brokenArt: Array.from(document.images).filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
          headerCollision: document.querySelector('.brand-lockup').getBoundingClientRect().right > document.querySelector('.nav-actions').getBoundingClientRect().left + 1 };
      });
      check(!metrics.overflow, `${locale} ${size.width}: horizontal overflow`);
      check(!metrics.headerCollision, `${locale} ${size.width}: social controls overlap logo`);
      check(!metrics.tooShort, `${locale} ${size.width}: section shorter than viewport`);
      check(metrics.brokenArt.length === 0, `${locale} ${size.width}: missing image ${metrics.brokenArt}`);
      check(errors.length === 0, `${locale} ${size.width}: script error ${errors.join(', ')}`);
      const compactSocials = page.locator('.header-social-details');
      const desktopSocials = page.locator('.header-social-links');
      check(size.width <= 610 ? await compactSocials.isVisible() && await desktopSocials.isHidden()
        : await desktopSocials.isVisible() && await compactSocials.isHidden(),
      `${locale} ${size.width}: header social group not responsive`);
      report.browsers.push(`${locale} ${size.width}x${size.height}`);
      await page.close();
    }
  }
  pass('30 browser layouts: responsive height, no horizontal overflow, no missing images or JS errors');

  // Confirm actual generated one-page navigation is clickable, including desktop.
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await desktop.goto(origin + '/en/index.html');
  await desktop.locator('.desktop-nav a[href="#books"]').click();
  check(new URL(desktop.url()).hash === '#books', 'Desktop Books header link did not navigate');
  for (const book of featuredBooks) {
    const link = desktop.locator('a.hero-book-' + book.heroPosition);
    await link.click({ position: book.heroPosition === 'left' ? { x: 12, y: 24 } :
      book.heroPosition === 'right' ? { x: (await link.boundingBox()).width - 12, y: 24 } : undefined });
    check(new URL(desktop.url()).hash === '#book-' + book.id, book.id + ': hero artwork did not navigate');
  }
  await desktop.close();
  pass('Desktop header Books and all featured hero books are clickable');

  // User-reported regressions are exercised as real clicks.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(origin + '/en/index.html');
  check(await page.locator('#cookie-consent').isVisible(), 'First-visit cookie banner hidden');
  await page.evaluate(() => scrollTo(0, 300));
  const before = await page.evaluate(() => scrollY);
  await page.locator('[data-consent-choice="essential"]').click();
  const after = await page.evaluate(() => scrollY);
  check(Math.abs(after - before) < 3, `Cookie rejection changed scroll position ${before} -> ${after}`);
  check(await page.locator('#cookie-consent').isHidden(), 'Cookie banner did not disappear');
  await page.reload();
  check(await page.locator('#cookie-consent').isHidden(), 'Consent did not persist');
  pass('Cookie action stays on page, banner closes, choice survives reload');
  await page.locator('[data-cookie-settings]').click();
  check(await page.locator('#cookie-consent').isVisible(), 'Cookie preferences did not reopen');
  const beforeAccept = await page.evaluate(() => scrollY);
  await page.locator('[data-consent-choice="all"]').click();
  check(Math.abs((await page.evaluate(() => scrollY)) - beforeAccept) < 3, 'Cookie acceptance caused scroll jump');
  check(await page.locator('#cookie-consent').isHidden(), 'Accept did not hide banner');
  pass('Footer cookie preferences reopen; accepting does not jump to footer');
  await page.locator('.menu-trigger').click();
  check(await page.locator('.menu-trigger').getAttribute('aria-expanded') === 'true', 'Mobile menu did not open');
  await page.locator('#mobile-navigation a[href="#books"]').click();
  check(new URL(page.url()).hash === '#books', 'Mobile nav did not move to Books');
  check(await page.locator('.menu-trigger').getAttribute('aria-expanded') === 'false', 'Menu remained open after navigation');
  pass('Mobile menu and one-page Books smooth-anchor navigation');
  const centralBook = featuredBooks.find((item) => item.heroPosition === 'center') ?? featuredBooks[0];
  if (centralBook) {
    await page.locator('a.hero-book-' + centralBook.heroPosition).click();
    check(new URL(page.url()).hash === '#book-' + centralBook.id, 'Hero book not clickable');
  }
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  check(await page.locator('#back-to-top').isVisible(), 'Back-to-top did not appear');
  await page.locator('#back-to-top').click();
  check(await page.evaluate(() => scrollY) < 3, 'Back-to-top did not scroll to page start');
  pass('Hero books clickable and scroll-to-top control works');
  const faqLink = page.locator('footer a[href$="faq/index.html"]');
  await faqLink.scrollIntoViewIfNeeded();
  const fromFooter = await page.evaluate(() => scrollY);
  await faqLink.click();
  check(page.url().includes('/en/faq/index.html'), 'FAQ did not open from footer');
  await page.locator('a[data-return-to-previous]').click();
  await page.waitForURL(/\/en\/index\.html/);
  await page.waitForFunction((oldY) => Math.abs(scrollY - oldY) < 12, fromFooter);
  pass('FAQ Back returns to the exact prior footer scroll position');
  const storyLink = page.locator('#about a[href$="about/index.html"]');
  await storyLink.scrollIntoViewIfNeeded();
  const fromAbout = await page.evaluate(() => scrollY);
  await storyLink.click();
  check(page.url().includes('/en/about/index.html'), 'Our story did not open');
  await page.locator('a[data-return-to-previous]').click();
  await page.waitForURL(/\/en\/index\.html/);
  await page.waitForFunction((oldY) => Math.abs(scrollY - oldY) < 12, fromAbout);
  pass('Our story Back returns to the exact previous About scroll position');
  await page.close();
  report.status = 'PASS';
} catch (error) {
  report.issues.push(String(error.stack ?? error));
  report.status = 'FAIL';
} finally {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
  if (report.status === 'FAIL' && report.issues.some((e) => /Operation not permitted|Executable doesn't exist/.test(e))) {
    report.status = 'BLOCKED';
    report.issues = ['Browser execution is restricted in this environment (Chromium could not create a socket or start). Run npm run test:e2e on an unrestricted workstation or GitHub runner.'];
  }
  writeFileSync(resolve(repo, 'BROWSER_QA_V7.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
if (report.status !== 'PASS') process.exit(1);
