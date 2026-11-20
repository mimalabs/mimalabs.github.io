/** Regression: two more products must render in six languages without code edits. */
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
const work = mkdtempSync(join(tmpdir(), 'mima-catalog-'));
const locales = ['en', 'de', 'es', 'fr', 'it', 'ca'];

try {
  mkdirSync(join(work, '.generated'), { recursive: true });
  mkdirSync(join(work, 'site/assets'), { recursive: true });
  cpSync(join(root, 'content'), join(work, 'content'), { recursive: true });
  cpSync(join(root, 'site/assets/covers'), join(work, 'site/assets/covers'), { recursive: true });
  cpSync(join(root, 'site/assets/brand'), join(work, 'site/assets/brand'), { recursive: true });
  cpSync(join(root, '.generated/build.mjs'), join(work, '.generated/build.mjs'));

  const path = join(work, 'content/products.json');
  const books = JSON.parse(readFileSync(path, 'utf8'));
  const initialCount = books.length;
  for (const step of [1, 2]) {
    const number = initialCount + step;
    const id = `catalog-smoke-${number}`;
    books.push({
      id, age: '4–6', coverMode: step === 1 ? 'placeholder' : 'shared', urls: {},
      translations: Object.fromEntries(locales.map((locale) => [locale, {
        title: `Fixture ${number} ${locale}`, theme: 'Test theme', description: 'Fixture for automated release QA',
      }])),
    });
    writeFileSync(path, JSON.stringify(books, null, 2));
    if (step === 2) {
      mkdirSync(join(work, 'site/assets/covers', id), { recursive: true });
      cpSync(join(root, 'site/assets/covers/farm/en.webp'), join(work, 'site/assets/covers', id, 'shared.webp'));
    }
    execFileSync(process.execPath, ['.generated/build.mjs'], { cwd: work, stdio: 'pipe' });
    for (const locale of locales) {
      const html = readFileSync(join(work, `site/${locale}/index.html`), 'utf8');
      assert.equal((html.match(/class="book-card"/g) ?? []).length, books.length, locale + ': card count');
      assert.ok(html.includes(`class="book-grid" data-count="${number}"`), locale + ': responsive grid selector missing');
      assert.ok(html.includes(`id="book-${id}"`), locale + ': new book anchor missing');
      const start = html.indexOf(`<article class="book-card" id="book-${id}"`);
      const card = html.slice(start, html.indexOf('</article>', start));
      assert.ok(card.includes('class="coming-soon-label"'), locale + ': missing Coming soon');
      assert.ok(!card.includes('class="book-cover-link"'), locale + ': unpublished book must not link to Amazon');
      if (step === 1) assert.ok(card.includes('class="book-artwork-placeholder"'), locale + ': draft placeholder missing');
      else assert.ok(html.includes(`${id}/shared.webp?v=`), locale + ': shared artwork not used');
      assert.equal((html.match(/class="hero-book hero-book-/g) ?? []).length,
        books.filter((book) => book.heroPosition).length, locale + ': original hero changed');
      assert.ok(html.includes(`Fixture ${number} ${locale}`), locale + ': translation missing');
    }
  }
  const css = readFileSync(join(root, 'site/assets/styles.css'), 'utf8');
  for (const n of [4, 5]) assert.ok(css.includes(`.book-grid[data-count="${n}"]`), `${n}-book grid styles missing`);
  console.log(`PASS: catalogue grows from ${initialCount} to ${initialCount + 2} books across six locales, with placeholders and shared covers`);
} finally {
  if (work.startsWith(join(tmpdir(), 'mima-catalog-'))) rmSync(work, { force: true, recursive: true });
}
