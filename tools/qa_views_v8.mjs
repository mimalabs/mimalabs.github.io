/** Checks rendered view outcomes rather than a fixed template implementation. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { allHtmlFiles, infoSlugs, locales, repoRoot, siteRoot, readSite } from './qa/support.mjs';

const views = allHtmlFiles(join(repoRoot, 'src/views'));
const pages = allHtmlFiles();
const expectedPageCount = locales.length * (1 + infoSlugs.length) + 2; // root and 404
assert.ok(views.length > 0, 'source views must exist');
assert.equal(pages.length, expectedPageCount, 'all localized pages must be generated');

// Pinterest verification is opt-in: the test checks propagation once it is added to the view.
const documentView = readFileSync(join(repoRoot, 'src/views/layout/document.html'), 'utf8');
const pinterest = /<meta\s+name="p:domain_verify"\s+content="([^"]+)"\s*\/?\s*>/.exec(documentView)?.[1];

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const label = relative(siteRoot, file);
  assert.doesNotMatch(html, /{{\s*[a-zA-Z][\w]*\s*}}/, `${label}: unresolved template token`);
  if (pinterest && label !== '404.html') {
    assert.match(html, new RegExp(`name="p:domain_verify"\\s+content="${pinterest}"`),
      `${label}: missing Pinterest verification`);
  }
}

const home = readSite('index.html');
for (const id of ['home', 'books', 'about', 'contact', 'cookie-consent', 'back-to-top']) {
  assert.ok(home.includes(`id="${id}"`), `Homepage is missing #${id}`);
}
console.log(`PASS: ${views.length} views, ${pages.length} generated pages; Pinterest ${pinterest ? 'propagated' : 'not configured yet'}`);
