import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { escapeHtml } from './escape.js';
import { markup, view } from './view.js';

// Compatibility re-export: existing controllers can keep importing e() from html.ts.
export { escapeHtml } from './escape.js';

/** Small components render through views, never concatenate full page markup. */
export function anchor(href: string, labelHtml: string, classes = '', external = false, extra = ''): string {
  return view('components/link', {
    href, classes: markup(classes ? ` class="${escapeHtml(classes)}"` : ''),
    target: markup(external ? ' target="_blank" rel="noopener noreferrer"' : ''),
    extra: markup(extra), body: markup(labelHtml),
  });
}

export function image(src: string, alt: string, width: number, height: number, classes = '', eager = false): string {
  // Replacing artwork changes its URL automatically, avoiding stale CDN/browser cache.
  const relativeAsset = src.match(/(?:^|\/)assets\/(.+)$/)?.[1];
  const hash = relativeAsset ? createHash('sha256').update(readFileSync(join(process.cwd(), 'site/assets', relativeAsset))).digest('hex').slice(0, 10) : '';
  const versionedSrc = hash ? src + '?v=' + hash : src;
  return view('components/image', {
    src: versionedSrc, alt, width, height, loading: eager ? 'eager' : 'lazy',
    priority: markup(eager ? ' fetchpriority="high"' : ''),
    classes: markup(classes ? ` class="${escapeHtml(classes)}"` : ''),
  });
}

export function socialIcon(name: string): string {
  const iconName = name === 'Instagram' ? 'components/icon-instagram'
    : name === 'TikTok' ? 'components/icon-tiktok'
      : name === 'Amazon shop' ? 'components/icon-amazon' : null;
  if (!iconName) throw new Error('Unsupported social icon: ' + name);
  return view('components/social-svg', { paths: markup(view(iconName, {})) });
}
