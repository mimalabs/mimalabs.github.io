/** Shared read-only test fixtures. Test cases own their assertions and reports. */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
export const siteRoot = join(repoRoot, 'site');
export const locales = Object.freeze(['en', 'de', 'es', 'fr', 'it', 'ca']);
export const infoSlugs = Object.freeze(['about', 'faq', 'privacy', 'cookies', 'legal', 'terms', 'accessibility']);
export const origin = 'https://www.mimalabsworld.com';

export function readSite(...parts) {
  return readFileSync(join(siteRoot, ...parts), 'utf8');
}

export function readProducts() {
  return JSON.parse(readFileSync(join(repoRoot, 'content', 'products.json'), 'utf8'));
}

export function allHtmlFiles(directory = siteRoot) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) return allHtmlFiles(file);
    return entry.isFile() && file.endsWith('.html') ? [file] : [];
  });
}

/** Reject traversal, including Windows-style paths, without assuming a separator. */
export function isInside(parent, candidate) {
  const path = relative(parent, resolve(candidate));
  return path === '' || (!isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`));
}

export function writeReport(filename, result) {
  writeFileSync(join(repoRoot, filename), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}

export function siteFile(...parts) {
  return join(siteRoot, ...parts);
}

export function existingSiteFile(...parts) {
  const file = siteFile(...parts);
  if (!existsSync(file)) throw new Error(`Missing generated file: ${parts.join('/')}`);
  return file;
}
