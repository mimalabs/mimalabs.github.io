import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const escapeHtml = (value: unknown): string => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function anchor(href: string, labelHtml: string, classes = '', external = false, extra = ''): string {
  const cls = classes ? ` class="${escapeHtml(classes)}"` : '';
  const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${escapeHtml(href)}"${cls}${target}${extra}>${labelHtml}</a>`;
}

export function image(src: string, alt: string, width: number, height: number, classes = '', eager = false): string {
  const cls = classes ? ` class="${escapeHtml(classes)}"` : '';
  // Replacing artwork changes its URL automatically, avoiding stale CDN/browser cache.
  const relativeAsset = src.match(/(?:^|\/)assets\/(.+)$/)?.[1];
  const hash = relativeAsset ? createHash('sha256').update(readFileSync(join(process.cwd(), 'site/assets', relativeAsset))).digest('hex').slice(0, 10) : '';
  const versionedSrc = hash ? src + '?v=' + hash : src;
  return `<img src="${escapeHtml(versionedSrc)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}${cls}>`;
}

export function socialIcon(name: string): string {
  let path: string;
  if (name === 'Instagram') path = '<rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.4"/><circle cx="12" cy="12" r="3.45"/><circle cx="17.35" cy="6.85" r=".75" fill="currentColor" stroke="none"/>';
  else if (name === 'TikTok') path = '<path d="M14.2 5.2v9.15a4.15 4.15 0 1 1-3.05-4"/><path d="M14.2 5.2c.75 2.4 2.15 3.85 4.6 4.25"/>';
  else if (name === 'Amazon shop') path = '<path d="M6 9h12l-1.2 11H7.2L6 9Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/><path d="M10 15h4"/>';
  else throw new Error('Unsupported social icon: ' + name);
  return `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
