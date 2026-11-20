/** Import replacement artwork without editing HTML, TypeScript or existing image references. */
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, resolve, basename, dirname } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const dryRun = process.argv.includes('--dry-run');
const folder = process.argv.slice(2).find((argument) => argument !== '--dry-run');
const source = resolve(folder ?? join(root, 'replacement-images'));
const productData = JSON.parse(readFileSync(join(root, 'content/products.json'), 'utf8'));
const productIds = new Map(productData.map((product) => [product.id, product]));
const locales = new Set(['en', 'de', 'es', 'fr', 'it', 'ca']);
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);
const images = [];
const outputs = new Set();

function enqueue(path, destination, width, format, cover = false) {
  if (outputs.has(destination)) throw new Error('Two source images map to the same target: ' + destination);
  outputs.add(destination);
  images.push({ path, destination, width, format, cover });
}
function walk(directory) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlink not allowed in replacement-images: ' + path);
    if (entry.isDirectory()) { walk(path); continue; }
    if (!entry.isFile()) throw new Error('Unsupported image source: ' + path);
    const extension = extname(path).toLowerCase();
    if (!imageExtensions.has(extension)) throw new Error('Not a supported image file: ' + path);
    const localPath = path.slice(source.length + 1).replaceAll('\\', '/');
    const parts = localPath.split('/');
    if (parts[0] === 'covers' && parts.length === 3) {
      const [, id, filename] = parts;
      const product = productIds.get(id);
      if (!product) throw new Error('Unknown product ' + id + ' — add it to content/products.json first');
      const edition = basename(filename, extension);
      const expected = product.coverMode === 'shared' ? 'shared' : 'a locale code (en/de/es/fr/it/ca)';
      if (product.coverMode === 'shared' ? edition !== 'shared' : !locales.has(edition)) {
        throw new Error('Invalid cover edition ' + localPath + '; expected ' + expected);
      }
      enqueue(path, join(root, 'site/assets/covers', id, edition + '.webp'), 1100, 'webp', true);
    } else if (parts[0] === 'brand' && parts.length === 2) {
      const id = basename(parts[1], extension);
      if (!['mima-labs-logo', 'mima-labs-mark'].includes(id)) throw new Error('Unknown brand asset ' + localPath);
      enqueue(path, join(root, 'site/assets/brand', id + '.webp'), id === 'mima-labs-logo' ? 1254 : 545, 'webp');
    } else if (parts.length === 1 && basename(parts[0], extension) === 'social-preview') {
      enqueue(path, join(root, 'site/assets/mimalabs-social-preview.jpg'), 1200, 'jpeg');
    } else throw new Error('Unexpected image path ' + localPath + ' (see PRODUCT_UPDATE_GUIDE.md)');
  }
}

if (!existsSync(source)) throw new Error('Image folder not found: ' + source + '\nSee PRODUCT_UPDATE_GUIDE.md');
walk(source);
if (!images.length) throw new Error('No replacement images found in ' + source);
for (const item of images) {
  const meta = await sharp(item.path).metadata();
  if (!meta.width || !meta.height) throw new Error('Image missing dimensions: ' + item.path);
  if (item.cover && (meta.width / meta.height < 0.67 || meta.width / meta.height > 0.87)) {
    throw new Error('Cover should be portrait (width / height about 0.77): ' + item.path);
  }
}
for (const item of images) {
  if (dryRun) { console.log('Would update ' + item.destination.slice(root.length + 1)); continue; }
  mkdirSync(dirname(item.destination), { recursive: true });
  let pipeline = sharp(item.path).rotate();
  if (item.format === 'jpeg') {
    pipeline = pipeline.resize(1200, 630, { fit: 'cover', position: 'centre' }).flatten({ background: '#ffffff' });
    await pipeline.jpeg({ quality: 87, mozjpeg: true }).toFile(item.destination);
  } else {
    pipeline = pipeline.resize({ width: item.width, withoutEnlargement: true });
    await pipeline.webp({ quality: 86, effort: 5 }).toFile(item.destination);
  }
  console.log('Updated ' + item.destination.slice(root.length + 1).replaceAll('\\', '/'));
}
console.log(dryRun ? `Validated ${images.length} source image(s) without changing site files.` :
  `Imported ${images.length} image(s). Run npm test before publishing.`);
