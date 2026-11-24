/** Audit the built website, not implementation-specific route builders. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { allHtmlFiles, infoSlugs, isInside, locales, siteRoot, writeReport } from './qa/support.mjs';

const issues = [];
const pages = allHtmlFiles();
let checkedLinks = 0;
let checkedFragments = 0;
let languageLinks = 0;

function auditLink(file, href) {
  if (/^(https?:|mailto:|tel:)/i.test(href)) return;
  const [path, fragment] = href.split('#', 2);
  const target = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
  const label = relative(siteRoot, file);

  if (!isInside(siteRoot, target)) {
    issues.push(`${label}: link escapes site: ${href}`);
    return;
  }
  if (!existsSync(target)) {
    issues.push(`${label}: broken link: ${href}`);
    return;
  }
  if (fragment) {
    checkedFragments++;
    const targetText = readFileSync(target, 'utf8');
    if (!targetText.includes(`id="${decodeURIComponent(fragment)}"`)) {
      issues.push(`${label}: missing target: ${href}`);
    }
  }
  if (/\/?(en|de|es|fr|it|ca)\/(about\/|faq\/|privacy\/|cookies\/|legal\/|terms\/|accessibility\/)?index\.html/.test(href)) {
    languageLinks++;
  }
}

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  for (const [, rawHref] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    checkedLinks++;
    auditLink(file, rawHref.replaceAll('&amp;', '&'));
  }
}

for (const locale of locales) {
  for (const slug of infoSlugs) {
    assert.ok(existsSync(join(siteRoot, locale, slug, 'index.html')), `${locale}/${slug}: missing info page`);
  }
}

const report = {
  status: issues.length ? 'FAIL' : 'PASS',
  htmlPages: pages.length,
  checkedLinks,
  checkedFragments,
  languageLinks,
  issues,
};
writeReport('NAVIGATION_QA_V7.json', report);
if (issues.length) process.exitCode = 1;
