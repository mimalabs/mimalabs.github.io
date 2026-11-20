# MIMA LABS — Stage 1 SEO and domain preparation

## Stage 1 result and boundaries

The code now generates production SEO metadata for `https://www.mimalabsworld.com` while keeping the original TypeScript static generator, visual styles, all localized content and Amazon catalogue unchanged. This is **code preparation**, not a published domain or GitHub deployment. Stages 2, 3 and 4 require new approval.

| Language | Public homepage | Canonical |
| --- | --- | --- |
| English | `/` | `https://www.mimalabsworld.com/` |
| English alternate | `/en/` | `https://www.mimalabsworld.com/` |
| German | `/de/` | `https://www.mimalabsworld.com/de/` |
| Spanish | `/es/` | `https://www.mimalabsworld.com/es/` |
| French | `/fr/` | `https://www.mimalabsworld.com/fr/` |
| Italian | `/it/` | `https://www.mimalabsworld.com/it/` |
| Catalan | `/ca/` | `https://www.mimalabsworld.com/ca/` |

Information pages remain localized at `/{language}/about/`, `/{language}/faq/`, `/{language}/privacy/`, `/{language}/cookies/`, `/{language}/legal/`, `/{language}/terms/` and `/{language}/accessibility/` (including `/en/...`).

## Source architecture

- `src/build/config.ts`: immutable production origin (the old `SITE_URL` override was removed to prevent a stale GitHub Actions variable silently producing wrong canonicals).
- `src/build/seo.ts`: canonical URL and reciprocal seven-entry `hreflang` clusters, plus sitemap routes.
- `src/build/layout.ts`: localized per-page titles/descriptions, absolute canonical, hreflang, Open Graph and Twitter preview metadata.
- `src/build/main.ts`: static `/`, `/en/` and other localized HTML; `robots.txt` and canonical-only `sitemap.xml` (48 URLs).
- `.github/workflows/deploy-pages.yml`: preserved tests and deployment jobs; removed obsolete `SITE_URL` calculation/override. Workflow is **not** deployed at this stage.
- `tools/qa_seo_v7.mjs`: automated validation wired to `npm test`; fails for broken canonical, alternate, sitemap, robots or old GitHub SEO URL.
- SEO Manager and Release Engineer definitions are delivered in a **separate agent-kit package**, not this website source. This separation is intentional: a Stage 5 repository will eventually own agents, skills, tools and supporting context independently of the published site.

Run locally: `npm ci && npm test`; optional `npm run test:e2e` after `npx playwright install chromium`. The latter runs responsive-browser checks and may not work in constrained sandbox environments.

## Ready to progress only when

1. The business owner accepts the URL mapping and SEO metadata.
2. `npm test` passes, including the SEO test; Architect and QA review scope.
3. The user explicitly authorizes **Stage 2**, where the repository contents will be backed up and replaced through a reviewable branch/commit. A `main` push is an automatic deployment risk.

Stage 3 Actions and Stage 4 registrar/DNS instructions are in `DEPLOY_TO_GITHUB.md`. Do not point DNS at GitHub before registering the custom domain in GitHub Pages settings.

**Stage 5 (future, separately authorized):** Build a dedicated agentic maintenance repository and selectively connect agents, skills, MCP tools, source-aware retrieval and a dependency graph. Begin only after the website is deployed and stable; adding a book should remain possible without any agents at all.

## Maintain products and artwork

Adding a book or cover does not require touching SEO templates. Follow `PRODUCT_UPDATE_GUIDE.md`: add one translated product record in `content/products.json`, prepare six appropriately named covers, run `npm run images:import`, then `npm test`. The single shared template updates all six language homepages, structured Book data and image metadata consistently.

## Official references

- [Google: Tell Google about localized versions of your page](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: Canonicalization best practices](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [GitHub: Managing a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: Custom Copilot agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
