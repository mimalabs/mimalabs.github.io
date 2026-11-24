/** Build the real site with additional books in an isolated temporary fixture. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { locales, readProducts, repoRoot, readSite } from './qa/support.mjs';

function prepareBuildFixture() {
  const directory = mkdtempSync(join(tmpdir(), 'mima-catalog-'));
  for (const path of ['.generated', 'site/assets', 'src']) {
    mkdirSync(join(directory, path), { recursive: true });
  }
  for (const path of ['src/views', 'content', 'site/assets/covers', 'site/assets/brand', '.generated/build.mjs']) {
    cpSync(join(repoRoot, path), join(directory, path), { recursive: true });
  }
  return directory;
}

function makeUnpublishedBook(id, sharedCover) {
  return {
    id, age: '4–6', coverMode: sharedCover ? 'shared' : 'placeholder', urls: {},
    translations: Object.fromEntries(locales.map((locale) => [locale, {
      title: `Fixture ${id} ${locale}`,
      theme: 'Test theme',
      description: 'Fixture for automated release QA',
    }])),
  };
}

function assertCatalogPage(html, locale, books, newBook, sharedCover) {
  const id = newBook.id;
  assert.equal((html.match(/class="book-card"/g) ?? []).length, books.length, `${locale}: card count`);
  assert.ok(html.includes(`class="book-grid" data-count="${books.length}"`), `${locale}: responsive book grid`);
  const start = html.indexOf(`<article class="book-card" id="book-${id}"`);
  assert.ok(start >= 0, `${locale}: new book anchor`);
  const card = html.slice(start, html.indexOf('</article>', start));
  assert.ok(card.includes('class="coming-soon-label"'), `${locale}: unpublished state`);
  assert.ok(!card.includes('class="book-cover-link"'), `${locale}: unpublished book does not link to Amazon`);
  if (sharedCover) assert.ok(card.includes(`${id}/shared.webp?v=`), `${locale}: shared artwork`);
  else assert.ok(card.includes('class="book-artwork-placeholder"'), `${locale}: placeholder artwork`);
  assert.equal((html.match(/class="hero-book hero-book-/g) ?? []).length,
    books.filter((book) => book.heroPosition).length, `${locale}: original hero count`);
  assert.ok(html.includes(newBook.translations[locale].title), `${locale}: localized title`);
}

const work = prepareBuildFixture();
try {
  const books = readProducts();
  const originalCount = books.length;
  for (const sharedCover of [false, true]) {
    const id = `catalog-smoke-${books.length + 1}`;
    const newBook = makeUnpublishedBook(id, sharedCover);
    books.push(newBook);
    writeFileSync(join(work, 'content/products.json'), JSON.stringify(books, null, 2));
    if (sharedCover) {
      mkdirSync(join(work, 'site/assets/covers', id), { recursive: true });
      cpSync(join(repoRoot, 'site/assets/covers/farm/en.webp'), join(work, 'site/assets/covers', id, 'shared.webp'));
    }
    execFileSync(process.execPath, ['.generated/build.mjs'], { cwd: work, stdio: 'pipe' });
    for (const locale of locales) {
      const html = readFileSync(join(work, 'site', locale, 'index.html'), 'utf8');
      assertCatalogPage(html, locale, books, newBook, sharedCover);
    }
  }
  const css = readSite('assets', 'styles.css');
  for (const count of [originalCount, originalCount + 1]) {
    assert.ok(css.includes(`.book-grid[data-count="${count}"]`), `${count}-book grid has CSS`);
  }
  console.log(`PASS: catalogue grows from ${originalCount} to ${books.length} books across ${locales.length} locales`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
