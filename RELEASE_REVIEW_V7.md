# V7 release review — architecture, product, QA, developer

> **Latest review (20 November 2026):** The catalog/image update below supersedes the earlier statement that the catalog and artwork were untouched. The earlier navigation review remains as an audit of its own scope.

Review scope: website behavior preserved from V6, with the user-requested fixes and a TypeScript clean-code refactor. These are **review findings and gates**, not signatures from independent humans.

| Role | Assessment | Decision |
| --- | --- | --- |
| Software architect | Independent read-only reviewer approved shared TypeScript social configuration and isolated native-history return module; content and architecture unchanged | **Design review passed; mobile browser gate pending** |
| Developer | Independent read-only reviewer approved scope; `npm test` passes, 50 pages generated, existing catalog untouched and all 42 Back interactions tested | **Implementation checks passed** |
| Product owner | Independent read-only reviewer confirmed the prior navigation-only scope, exact Amazon shop URL and unchanged book/copy/image inputs at that stage. Current product/image update requires fresh review; all 23 product Amazon destinations and prior legal review need business validation | **Business sign-off pending** |
| QA | Static/DOM tests passed in six languages. Live desktop browser confirmed Accessibility Back → exact footer scroll position and Our story Back → About. Automated 30-size Chromium matrix and real tablet/mobile QA remain outstanding; GitHub deployment requires browser tests first | **Browser/device QA pending — publication hold** |

## Acceptance criteria

- [x] Hero book covers are keyboard-accessible links, each to the matching book card.
- [x] Main header Books link targets `#books`; section anchors exist in all six locales.
- [x] Consent choices persist locally, close the banner and do not invoke page scrolling or focus on the footer.
- [x] Footer can reopen the cookie choices; visitor can change preference.
- [x] Missing Amazon listing is shown as Coming soon, without a fake purchase URL.
- [x] Brand messaging is age-neutral; individual book age ranges come from the product data.
- [x] Header beside language selector and footer share Instagram, TikTok and the exact owner-provided Amazon shop link; no Facebook link remains.
- [x] Informational pages and Our story return through browser history to preserve the previous scroll position; direct entries have a working About/footer anchor fallback.
- [x] Six locale files share one set of TypeScript templates; **product details and purchase links live in one catalogue file**.
- [x] Catalogue can grow beyond three books without editing code or QA assumptions; homepage artwork features up to three explicitly chosen books. Four-book 2 × 2 and five-book 3 + 2 layouts were checked in a desktop browser using temporary sample products.
- [x] Draft products can be announced before illustrations are ready using a branded, accessible artwork placeholder; the build prevents these drafts from being linked as live Amazon editions or featured as finished hero covers.
- [x] Optional one-image shared cover or per-language covers; build rejects absent artwork; import tool optimizes all image types and content-hash URLs prevent stale imagery.
- [x] Product instructions and manual Amazon audit supplied.
- [x] The GitHub deployment workflow runs build, regression tests and Chromium E2E before uploading to Pages.
- [x] No runtime dependency on Python, Next.js or React; build via TypeScript and npm.
- [x] Root `index.html` renders immediately; no meta refresh or redirect.
- [x] Accessibility basics, localized routes, markup, script syntax and static assets pass.
- [ ] Execute `npm run test:e2e` in an unrestricted browser environment and resolve any failures.
- [ ] Confirm responsive behavior on real phone, tablet and desktop browsers after deployment.
- [ ] Business owner validates text/translation nuance, all 23 live Amazon destinations and legal notices.
- [ ] Confirm legal operator identity and whether the Amazon-only catalogue requires a full postal contact address. The public website displays city and country only; legal sign-off remains pending.

**Gate:** Do not claim final public release approval until both outstanding Product Owner and QA checks are complete. The ZIP is a publishable project and review candidate; it has not been deployed to the user's repository.

### Focused follow-up change review (20 November 2026)

- **Authorized changes only:** information-page/Our story Back preserves source-page history and scroll, social icons appear beside the language selector (compact on narrow phones), and Amazon shop joins the existing Instagram/TikTok links in both header and footer.
- **Scope preservation:** book catalog, all six locale content files, image inputs, typography, cookie behavior, homepage sections and purchase URLs remained untouched. Only shared navigation/social source code, a small header-only CSS rule, tests and this documentation were edited.
- **Automated gate:** `npm test` passed — 50 generated pages, 1,897 links, 756 fragments, six locale interactions, all 42 info-page back actions and 4/5-book growth invariants.
- **Live desktop behavior:** browser clicking Accessibility from the footer and Back returned to the footer at the previous scroll offset; opening Our story from About and clicking Back returned to the About area. Header and footer visibly expose the three social destinations.
- **Publication hold:** automated Chromium E2E is blocked in this local environment (browser socket restriction), including the 320px header-overlap check. The CI workflow must pass the full matrix before deployment. A real 320px phone/tablet check and final MIMA LABS business-owner sign-off are still needed.

### Follow-up catalog and cover import (20 November 2026)

**Approved change scope:** update only the Instagram URL, add the five missing Farm/Halloween/Christmas language-specific Amazon links, add Vehicles as the fourth catalog item with five live language-specific Amazon links, and replace Farm/Halloween + add Vehicles covers using the supplied ZIP.

| Role | Review evidence | Gate |
| --- | --- | --- |
| Architect | Shared typed `Book` record, single catalog file and existing 2×2/3+2 responsive grid; no template or CSS changes | **Approved** |
| Developer | Mapped 18 supplied front covers to predictable `site/assets/covers/<id>/<locale>.webp`; preserved all six Christmas images byte-for-byte; centralized Instagram and Amazon URLs | **Approved** |
| Product Owner reviewer | 23 configured Amazon URLs, localized Vehicles copy, 1–3 cover badges, Spanish Vehicles safely Coming soon. The new front covers say shorter titles than existing “My First…” card titles | **Conditional — owner content approval** |
| QA reviewer | 50 pages, six languages, four products, 26 WebP assets, 1,930 links and 756 fragments pass. All 42 info-page Back tests pass. Live desktop confirms a two-column four-book grid and visible Vehicles cover, no horizontal overflow | **Conditional — responsive suite and live-link validation** |

**Source mapping:** `COVER_SOURCE_MAP.md` documents why `La Granja/PortadaIII`, `Halloween 26/PotradaII`, and `Vehicles/Portada` were selected. Original ZIP interior illustrations, alternative Halloween covers and printable PDFs were not imported. All 18 chosen covers were visually inspected for language and converted to optimized WebP. `PRODUCT_UPDATE_GUIDE.md` remains the owner workflow for future additions.

**Required before public release:**

- [x] New Instagram handle is `https://www.instagram.com/mimalabsworld/` in header, footer and structured metadata.
- [x] The five newly provided existing-book links and five Vehicles links are exactly represented in `content/products.json`.
- [x] New Vehicles book is age 1–3 with six localized covers; Spanish edition has no invented purchase link.
- [x] All unchanged Christmas covers remain byte-for-byte identical to the last reviewed ZIP.
- [x] `npm test` passes with the real four-book catalogue and temporary growth up to six books.
- [ ] Owner confirms all 23 Amazon shortlinks lead to the correct book, cover and language edition.
- [ ] Owner approves keeping or renaming the existing “My First…” book card titles to match the shorter words printed on updated Farm/Halloween covers.
- [ ] GitHub Chromium E2E and physical phone/tablet/desktop checks pass, including 320px header layout.
- [ ] Owner approves legal notices and translated text before the GitHub push.

**Release decision:** approved as a tested, reviewable ZIP; **GitHub publication held** for the outstanding Product Owner and QA gates. No push or external deployment has been performed.
