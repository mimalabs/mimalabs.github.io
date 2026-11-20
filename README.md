# MIMA LABS — V7 (TypeScript, one codebase, six languages)

MIMA LABS is a one-page, fully localized business presentation and coloring-book catalogue. The current releases are intended for ages 1–3, but the brand is not restricted to that age group. It has no database, accounts, shopping cart, analytics trackers or external font dependencies. Available books link directly to Amazon; editions without a supplied listing show **Coming soon**.

## Architecture — why there are 50 HTML files

There is **one implementation**, not six websites. The site has:

- `src/shared/model.ts` — typed locale, product and content contracts.
- `src/build/content.ts` — validates products, six translations, covers and Amazon URLs.
- `src/build/images.ts` — the shared convention for product image locations.
- `src/build/layout.ts` — one shared header, navigation, footer, consent and HTML shell.
- `src/build/seo.ts` — canonical URLs, six-language `hreflang` groups and canonical sitemap routes from one source.
- `src/build/pages.ts` — one homepage and one informational-page template.
- `src/build/main.ts` — publishes every locale from the same templates.
- `src/client/mobile-menu.ts`, `cookie-consent.ts`, `back-to-top.ts`, `return-navigation.ts` — independent progressive-enhancement modules.
- `content/{en,de,es,fr,it,ca}.json` — page/navigation/legal translations (not product details).
- `content/products.json` — **one record per product** including all language-specific titles/descriptions, age, cover mode (`localized`, `shared` or image-free `placeholder` for a Coming soon draft), optional hero placement and Amazon listings.
- `tools/import_images.mjs` — one-command batch replacement of product covers, logos and the social image.
- `src/build/config.ts` — shared business email, localized public city and canonical URL configuration. Translation files use `{{businessEmail}}` and `{{businessLocation}}` where applicable.
- `site/` — generated static files ready for GitHub Pages.

The build intentionally emits a localized page per URL (6 homepages, 42 information pages, a real root homepage and 404). This lets search engines index translations, keeps native links working without JavaScript, and avoids the directory-listing/redirect problem when opening the root `index.html`. No localized HTML is maintained manually.

No Next.js/React runtime is needed for this brochure website. TypeScript provides module boundaries and type checking, while the published browser bundle is about 2.6 KB. It uses no runtime npm packages; `sharp` is only a local build-time tool for importing artwork.

## Build and test

Requires **Node.js 24** and npm.

```bash
npm ci
npm run build
npm test
```

`npm run build` checks TypeScript types, bundles the browser interaction modules into a single offline-safe `site/assets/site.js`, and pre-renders all pages.

`npm test` runs the build, static integrity checks, domain/canonical/hreflang/sitemap SEO checks, local link/fragment checks and DOM interaction tests for all six locales, including Back behavior on all 42 information pages. The Python static checker uses only Python 3's standard library; its BeautifulSoup extension is optional.

**Browser / viewport E2E:** On a computer that permits Chromium, run:

```bash
npx playwright install chromium
npm run test:e2e
```

This checks 30 language/viewport combinations, visual overflow/section sizing, narrow-screen header spacing, broken images, actual hero/header clicks, consent behavior, mobile menu, back-to-top, and return-to-scroll from FAQ and Our story. The development sandbox blocked local Chromium socket creation, so the automated browser suite is **blocked, not approved** in this release. A separate desktop browser preview confirmed Back from Accessibility to the footer and from Our story to About; a physical iOS/Android check is still necessary. Details: `RELEASE_REVIEW_V7.md`.

## View locally

Double-click `site/index.html` for an offline preview (no redirect). The root page, images, styles, and bundled interactions are file-safe. For a production-like URL, run `npm run preview` and open `http://127.0.0.1:8000/`.

## Maintain the website

1. Add or edit books in **one place**: `content/products.json`. Its `translations` contain all six languages; its `urls` contain Amazon listings. Missing listings intentionally remain **Coming soon**.
2. To replace images, place JPEG/PNG/WebP sources in `replacement-images/` and run `npm run images:import`; it optimizes covers/logos and updates a social-sharing image. Run `-- --dry-run` first to check names. Unchanged images remain untouched.
3. For general page copy, edit the appropriate `content/<locale>.json`. For shared markup or styles, edit `src/build/pages.ts`, `layout.ts` or `site/assets/styles.css` only once.
4. Run `npm test`; do not edit generated `site/**/*.html` directly. The GitHub deployment workflow also runs browser E2E and **blocks release on failure**.
5. Follow **`PRODUCT_UPDATE_GUIDE.md`** for step-by-step product, cover and Amazon workflows, **`COVER_SOURCE_MAP.md`** for the source ZIP mapping, and **`AMAZON_LINK_AUDIT.md`** for the 23 listings needing manual confirmation.
6. Push to the existing GitHub repository after owner and QA acceptance (instructions in `DEPLOY_TO_GITHUB.md`).

**Custom-domain rollout:** `SEO_AND_DOMAIN_STAGE_1.md` explains the production-origin preparation and four approval-gated deployment stages. This source now generates canonical URLs for `www.mimalabsworld.com` (English `/`, other homepages `/de/`, `/es/`, `/fr/`, `/it/`, `/ca/`). The source-only preparation does **not** connect the domain or publish the website. **Agents are not part of this website repository**: their separate starter package is intended for a future Stage 5 agentic-maintenance repository.

## Preserved UX

- Full viewport minimum sections with natural growth for mobile or long translations (no forced scroll snapping).
- Smooth one-page anchor navigation with a single sticky-header offset, reduced-motion support and localized links.
- Clickable hero book covers scrolling to their corresponding book cards; available product-cover/title links open Amazon.
- Brand-level headings, metadata, introductions and footer copy do not claim a permanent age restriction. Book age labels are derived from each product's `age` field.
- Responsive catalogue growth: the current four books form a centered **2 × 2** desktop grid; five books form **3 + 2 centered** rows, and six use the normal three-column grid. Tablet uses two columns, mobile one; extra books never alter the three featured hero links unless explicitly assigned a slot. New drafts can be added without images and display a branded placeholder until their artwork is ready.
- Cookie banner with **Accept all**, **Essential only**, local preference storage and footer reopening button. Both choices keep tracking disabled (the site does not load analytics).
- Back-to-top button appears on scroll. Cookie dismissal never refocuses the footer or scrolls the page.
- Instagram, TikTok and the MIMA LABS Amazon shop are linked from the footer and beside the language selector. On narrow phones they live in a compact, keyboard-accessible header menu.
- Information-page Back links use the browser's previous page history to preserve the visitor's scroll position; direct visits fall back to the homepage's relevant About or footer section.
- One serif/system font stack and one sans-serif/system stack, no Quicksand and no font downloads.
- Native mobile menu, keyboard labels, semantic HTML, canonical/hreflang metadata and local legal pages.

## QA and release constraints

Passed locally in V7 after the November cover/catalogue update: **50 generated HTML pages**, **1,930 link references**, **756 fragment links**, six locale-specific interaction tests, **42 information-page Back tests**, TypeScript typecheck and static structure checks. The live four-product catalogue builds in six languages with all 24 covers; two additional temporary products passed the growth test. Live desktop browser clicks previously confirmed scroll restoration for Accessibility and Our story. The automated 30-view browser matrix was authored but could not execute locally; physical mobile/tablet validation remains pending.

Amazon shortened URLs are those provided in the prior source. All **13 remain unverified against live listings** because Amazon blocked automated access. The complete Product Owner link checklist is `AMAZON_LINK_AUDIT.md`. Legal operator details, translations and privacy wording should be approved by the business owner. Do not interpret automated checks as certification of every browser/device.

This archive has **not** been pushed to `mimalabs/mimalabs.github.io`.
