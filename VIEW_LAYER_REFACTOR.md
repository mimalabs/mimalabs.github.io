# MIMA LABS — View-layer refactor (V8)

## Scope

This is a **source-only overlay**, not a full website replacement. The installer synchronizes the latest `origin/main` and then validates every targeted file against known checked source versions before replacing anything. No published assets, products, translations, CSS, client behavior or deployment configuration are overwritten.

## Why

Before: `layout.ts` and `pages.ts` mixed markup, routes, translations, SEO and product logic in long TypeScript template literals.

Now: The TypeScript controllers prepare data; all major markup lives in `.html` files under `src/views`. A small build-time renderer resolves placeholders. No React/Next.js/runtime client templating or new npm dependencies are introduced.

```
content/                    # book inventory and translations (unchanged)
src/shared/                 # product and locale types (unchanged)
src/build/                  # TypeScript build logic / SEO / escaping / view rendering
  pages.ts                  # prepares page view data
  layout.ts                 # prepares header/footer/SEO view data
  html.ts                   # small reusable anchor/image/SVG helpers
  escape.ts                 # HTML text/attribute escaping
  view.ts                   # typed template contracts and renderer
  main.ts                   # creates generated pages, sitemap and 404
src/views/                  # 24 editable HTML templates
  layout/document.html      # HEAD metadata, document layout (add Pinterest verification here)
  pages/                    # hero, catalog, about, contact, information, 404
  partials/                 # navigation, footer, consent, feature labels
  components/               # links, images, social SVGs
src/client/                 # browser interactions (unchanged)
site/                       # generated static output (never edit manually)
```

## How to apply

1. **Before merging**, run `git status --short` in `C:\Users\Mottallica\mimalabs-site` and review any uncommitted changes. Commit or back them up first.
2. Extract `MIMA_LABS_View_Refactor_Patch.zip` and copy its **contents** into the repository root, preserving the folder hierarchy. Replace matching files.
3. Run `npm ci` (if needed), then `npm test` and `npm run test:e2e` (after local Playwright/Chromium installation).
4. Check `git diff --stat`, `git diff --check` and manually inspect the homepage, catalog, language links, consent and return navigation.
5. Only when happy: `git add src/build src/views tools/qa_catalog_growth_v7.mjs tools/qa_views_v8.mjs package.json VIEW_LAYER_REFACTOR.md` and `git commit -m "refactor: separate HTML views from TypeScript build logic"` followed by `git push origin main`.
6. Verify a green GitHub Actions build **and deploy** before considering release complete.

## How to edit content and SEO

- **Change visible HTML:** edit `src/views/pages/*.html` or `src/views/partials/*.html`.
- **Change layout and `<head>` markup:** edit `src/views/layout/document.html`.
- **Change business content:** `content/` JSON (unchanged by refactor).
- **Change SEO URLs/alternate rules:** `src/build/seo.ts` (unchanged).
- **Change global business email/domain:** `src/build/config.ts` (unchanged).
- **Add a new template variable:** add the `{{name}}` placeholder in the HTML view, then update the typed contract in `src/build/view.ts` and supply the value from the controller.
- `{{name}}` is automatically HTML-escaped; use `markup(...)` only for fragments built by trusted internal helpers/views. Unbound variables fail the build.

## Verification performed

- TypeScript type-check using TypeScript 5.8.3: PASS
- Build with locally transpiled TypeScript modules: PASS
- Generated HTML parity was previously checked for 50 pages; this version intentionally leaves Pinterest verification for manual addition
- `qa_static.py`: PASS
- `qa_seo_v7.mjs`: PASS
- `qa_navigation_v7.mjs`: PASS, 1,930 links
- `qa_views_v8.mjs`: PASS, 24 templates, 50 pages
- Browser tests, full `npm test` and `test:e2e`: NOT RUN in this container because npm packages such as `happy-dom`, `esbuild` and Playwright were unavailable. These must be validated locally or in GitHub Actions before releasing.

## Release safeguard

The refactor does not insert Pinterest verification automatically; add the verification `<meta>` in `src/views/layout/document.html` after applying the patch. The only intended generated HTML changes are the already-requested `✳` → `✦` icon replacement. The custom 404 remains the same basic page as the current repository; this refactor intentionally does not redesign it. Files in `site/` are generated at build time. Do not copy an older generated `site/` snapshot over your existing website.
