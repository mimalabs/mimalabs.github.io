# Website QA

Small checks for the **generated** `site/` directory. `npm test` first builds the real website, then runs these checks. No test should recreate page rendering with fake HTML.

## Responsibilities

- `support.mjs`: filesystem, locales, product data and JSON reports (no assertions)
- `dom.mjs`: browser-like fixture for the generated HTML + real client bundle
- `support.test.mjs`: boundary checks for shared test utilities
- `../qa_views_v8.mjs`: rendered view tokens, core controls and optional Pinterest propagation
- `../qa_seo_v7.mjs`: canonical URLs, language alternatives and sitemap
- `../qa_navigation_v7.mjs`: internal links, anchors and localized pages
- `../qa_interactions_v7.mjs`: consent, persistence, scrolling and mobile navigation
- `../qa_return_navigation_v7.mjs`: Back behavior and social destinations
- `../qa_catalog_growth_v7.mjs`: realistic 5/6-book rebuild fixture

`qa_static.py` retains its existing broad HTML/assets checks. `qa_release_v7.mjs` remains the separate real-browser regression suite (`npm run test:e2e`).

## Maintainability rules

1. Test *outcomes*, not the current TypeScript function names or template implementation.
2. Give each behavior a short named assertion function; share only stable setup.
3. Keep locale and route definitions in `support.mjs` (the generated site is the authority).
4. Test the real client bundle; do not mock the application logic under test.
5. For new metadata (for example Pinterest), assert propagation **when configured** rather than forcing unfinished configuration.
6. Keep browser-oriented checks separate from fast, deterministic checks; don't claim the DOM simulator proves real browser rendering.
7. Prefer a few explicit cases to complex test abstractions.

Run `npm test` before committing. Run `npm run test:e2e` for a browser release check when Playwright browsers are installed.
