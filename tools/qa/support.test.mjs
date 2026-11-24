import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { join, resolve } from 'node:path';
import { isInside, repoRoot, siteRoot, allHtmlFiles } from './support.mjs';

test('generated site is inside the project', () => {
  assert.ok(isInside(repoRoot, siteRoot));
  assert.ok(allHtmlFiles().length > 0);
});

test('path guard accepts internal paths and rejects traversal', () => {
  assert.ok(isInside(siteRoot, join(siteRoot, 'en', 'index.html')));
  assert.ok(isInside(siteRoot, siteRoot));
  assert.equal(isInside(siteRoot, resolve(siteRoot, '..', 'package.json')), false);
  assert.equal(isInside(siteRoot, resolve(siteRoot, '..', 'site-copy')), false);
});
