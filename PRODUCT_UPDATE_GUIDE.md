# MIMA LABS — add books and replace artwork

Product updates require **one JSON product record, the relevant image files and one build**. No HTML, TypeScript, CSS or per-language page duplication is needed. The site remains a static GitHub Pages website; purchases always happen on Amazon.

## 1. Edit an existing book

Open `content/products.json`. Find its `id` (for example `farm`) and change the relevant fields:

- `age`: age range shown on that product card, such as `1–3` or `4–6`.
- `translations`: product title, theme and description in **all six** languages (`en`, `de`, `es`, `fr`, `it`, `ca`). This is the only place to edit product text.
- `urls`: Amazon links **per edition**. Add a verified link when the book is live; remove the locale's link to display **Coming soon** instead. Do not use placeholder or author-page links as though they were book listings.
- `heroPosition`: optional; one product can occupy `left`, `center` or `right` in the clickable homepage artwork. Maximum three featured books; each position can be used once. Leave this field out for other books.
- `coverMode`: `localized` when the cover text differs by language, `shared` **only if the design works in every language without misleading cover text**, or `placeholder` for a draft **Coming soon** book whose cover has not been prepared yet.

**Keep an existing `id` unchanged.** It determines the artwork directory, product anchor and bookmarked link.

## 2. Add a new book

In `content/products.json`, copy an existing object and append it to the array. Set a unique lowercase ID with dashes, e.g. `ocean-adventures`. Give it age, localized product copy, verified Amazon links if any, and a cover mode. Example showing the structure (use real translations and image files before building):

```json
{
  "id": "ocean-adventures",
  "age": "4–6",
  "coverMode": "placeholder",
  "urls": {},
  "translations": {
    "en": {"title": "Ocean Adventures", "theme": "Ocean", "description": "Illustrations inspired by life under the sea."},
    "de": {"title": "Meeresabenteuer", "theme": "Meer", "description": "Illustrationen zum Leben unter Wasser."},
    "es": {"title": "Aventuras en el océano", "theme": "Océano", "description": "Ilustraciones inspiradas en la vida submarina."},
    "fr": {"title": "Aventures dans l’océan", "theme": "Océan", "description": "Illustrations inspirées de la vie sous-marine."},
    "it": {"title": "Avventure nell’oceano", "theme": "Oceano", "description": "Illustrazioni ispirate alla vita sottomarina."},
    "ca": {"title": "Aventures a l’oceà", "theme": "Oceà", "description": "Il·lustracions inspirades en la vida submarina."}
  }
}
```

With `"coverMode": "placeholder"` and `"urls": {}`, you can publish a new book announcement **without preparing any cover files**. The site displays a styled MIMA LABS artwork placeholder and **Coming soon** in all six languages. When your images are ready, switch to `localized` or `shared`, import the covers, and add only live, individually verified marketplace links (e.g. `"de": "https://www.amazon.de/dp/REAL_ASIN"`). You can add any number of products; the catalogue grid grows automatically. To feature a new book at the top, give it a hero slot and remove that slot from the previous featured book. Draft placeholder books cannot occupy hero slots or claim an Amazon listing.

**No CSS changes needed for two more books:** the current four titles display as two centered rows of two on desktop; five display as three on top with two centered underneath; six use the standard three-column grid. Tablets use two columns, and mobile phones display one card per row. Every section grows vertically as needed—no clipped cards or forced scroll snapping. Automated build tests add two products to the current catalogue across all six languages.

## 3. Replace covers, logos and social artwork

Use new source artwork in PNG, JPG, TIFF or WebP. The original artwork remains in the project unless you explicitly replace it.

Place **only the images you want changed** into a local folder `replacement-images/` (ignored by Git). File locations are the entire mapping—there is no asset manifest to maintain:

```text
replacement-images/
├── covers/
│   ├── farm/
│   │   ├── en.png             ← English Farm cover
│   │   └── fr.jpg             ← French Farm cover
│   ├── christmas/
│   │   └── de.png             ← German Christmas cover
│   ├── cars/
│   │   └── en.png             ← English Vehicles cover; product ID is `cars`
│   └── ocean-adventures/
│       ├── en.png             ← one per locale for localized mode
│       ├── de.png
│       ├── es.png
│       ├── fr.png
│       ├── it.png
│       └── ca.png
├── brand/
│   ├── mima-labs-logo.png    ← main logo, optional
│   └── mima-labs-mark.png    ← small brand mark, optional
└── social-preview.png        ← social share card, optional
```

For a language-neutral book cover, set `"coverMode": "shared"` and provide **one** `covers/<id>/shared.png` instead of the six localized files. Do not use a cover with English text as a shared cover for another language. With `localized` or `shared`, the site fails the build if any required cover is missing; with `placeholder`, no files are required and the site shows a purposeful branded placeholder instead of a broken image.

From the project root, run:

```bash
npm ci
npm run images:import -- --dry-run   # validate image names and dimensions, no changes
npm run images:import                # optimize images and update site/assets/
npm test                             # regenerate HTML and check all languages
```

`images:import` uses `sharp` locally to convert covers and logos to compressed WebP (up to 1100 px wide for covers) and the social preview to 1200 × 630 JPG. It does not upload images, modify content records, or overwrite unmentioned artwork. The build automatically adds image-content hashes to image URLs, so visitors get updated covers rather than cached old ones after deployment.

**Existing cover paths** are `site/assets/covers/<id>/<locale>.webp`. For the current four books, there are 24 locale-specific covers (`farm`, `halloween`, `christmas`, `cars`). The logo, brand mark and social preview are the other three artwork assets. You can replace all 27 in one batch using this workflow. See **`COVER_SOURCE_MAP.md`** for the mapping of the November 2026 supplier ZIP into the clean image convention.

**Current Vehicles book:** the internal product ID is `cars` but the printed front covers say **Vehicles** in the corresponding language. All six covers exist. The Spanish Amazon URL is not yet supplied, so Spanish visitors see **Coming soon**, while the other five locales link to their own edition. To publish the Spanish edition later, add only `"es": "https://a.co/d/YOUR_LINK"` under `cars.urls` in `content/products.json` and run `npm test`.

## 4. Validate before publishing

1. Review every translated title and description with a native speaker; pay attention to age claims.
2. Manually open every live Amazon link and confirm **exact title, cover, language/edition and current availability**. See `AMAZON_LINK_AUDIT.md` for the current list. HTTP status alone cannot confirm that a link points to the correct edition.
3. Run `npm test` (TypeScript, six-language pages, asset/link checks, and consent/navigation interactions).
4. Run `npx playwright install chromium` once, then `npm run test:e2e`; inspect phone, tablet and desktop. The GitHub Pages deployment workflow also executes both test groups and blocks deployment on failure.
5. After product-owner and legal review, commit `content/`, new `site/assets/` images and any source changes. **Do not commit** `replacement-images/` or `node_modules/`.

For general wording (not book-specific), edit `content/en.json`, `de.json`, `es.json`, `fr.json`, `it.json`, `ca.json`. For business email, contact city, and social handles, edit `src/build/config.ts`. **Never edit generated `site/**/*.html` directly.**
