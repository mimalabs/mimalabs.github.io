import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '../site');
const locales = ['en', 'de', 'es', 'fr', 'it', 'ca'];
const pages = [];
const issues = [];
let checkedLinks = 0;
let checkedFragments = 0;
let languageLinks = 0;

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const pathname = join(directory, entry.name);
    if (entry.isDirectory()) collect(pathname);
    else if (entry.name.endsWith('.html')) pages.push(pathname);
  }
}
collect(root);
for (const file of pages) {
  const text = readFileSync(file, 'utf8');
  const anchors = text.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g);
  for (const [, raw] of anchors) {
    const href = raw.replaceAll('&amp;', '&');
    checkedLinks++;
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const fragmentAt = href.indexOf('#');
    const pathname = fragmentAt === -1 ? href : href.slice(0, fragmentAt);
    const fragment = fragmentAt === -1 ? '' : decodeURIComponent(href.slice(fragmentAt + 1));
    const targetFile = pathname ? resolve(dirname(file), pathname) : file;
    if (!targetFile.startsWith(root + '/') && targetFile !== root) {
      issues.push(`${relative(root, file)}: link escapes site: ${href}`);
      continue;
    }
    if (!existsSync(targetFile)) {
      issues.push(`${relative(root, file)}: broken link: ${href}`);
      continue;
    }
    if (fragment) {
      checkedFragments++;
      const targetHtml = readFileSync(targetFile, 'utf8');
      if (!targetHtml.includes(`id="${fragment}"`)) {
        issues.push(`${relative(root, file)}: missing target: ${href}`);
      }
    }
    if (/\blang="(en|de|es|fr|it|ca)"/.test(text) && /\/?(en|de|es|fr|it|ca)\/(about\/|faq\/|privacy\/|cookies\/|legal\/|terms\/|accessibility\/)?index\.html/.test(href)) {
      languageLinks++;
    }
  }
}
for (const locale of locales) {
  for (const slug of ['about', 'faq', 'privacy', 'cookies', 'legal', 'terms', 'accessibility']) {
    assert.ok(existsSync(join(root, locale, slug, 'index.html')));
  }
}
const report = { status: issues.length ? 'FAIL' : 'PASS', htmlPages: pages.length,
  checkedLinks, checkedFragments, languageLinks, issues };
writeFileSync(resolve(import.meta.dirname, '../NAVIGATION_QA_V7.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (issues.length) process.exit(1);
