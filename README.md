# MIMA LABS — V34

Multilingual, conversion-focused Next.js storefront for MIMA LABS. Purchases happen externally on Amazon; there is no cart, account or payment backend.

## V34

V34 removes the Home book carousel and replaces it with a static three-cover card gallery so all current collections are visible at once. The covers are substantially larger in the Books section across landscape, compact landscape and portrait, while the full artwork remains uncropped and the UI stays minimal.

See `README_V34.md` for the detailed UI changes.

## Collections

Farm, Halloween and Christmas are included in EN / DE / ES / FR / IT / CA with localized covers.

Currently live on Amazon:

- Farm EN — `https://www.amazon.com/Farm-Coloring-Toddlers-Animals-Nature/dp/B0HK7ZLTJP`
- Farm FR — `https://www.amazon.fr/Ferme-coloriage-enfants-animaux-amusement/dp/B0HK8J88KD`

Every other localized edition is deliberately disabled and shows a minimal `Coming soon` state. Availability is data-driven in `content/products.ts`: adding a locale + Amazon URL automatically activates the cover and CTA in both the hero and Books section.

## Socials

Configured centrally in `config/site.ts`:

- Instagram: `https://www.instagram.com/mimalabs.studio/`
- TikTok: `https://www.tiktok.com/@mimalabs.studio`
- Facebook: https://www.facebook.com/share/1NY2byfFB5/?mibextid=wwXIfr

All three official social profiles are included in structured-data `sameAs`.

## Stack

- Next.js 16.3.3
- React 19.3
- TypeScript
- Tailwind CSS 4.3
- Radix Dropdown Menu
- Static export via `output: "export"`
- Optional privacy-focused Plausible Analytics

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/en/`.

Production export:

```bash
npm run build
```

Next.js generates the deployable static site in `out/`, including the real `index.html` files. `preview.html` is only the standalone visual preview.

## GitHub Pages

The project includes `.github/workflows/deploy-pages.yml`.

1. Push the contents of this project folder to the root of your GitHub repository.
2. In GitHub open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. Push to `main` or manually run the Pages workflow.

The workflow builds the Next.js static export and publishes `out/`. Repository-subpath hosting is supported for the temporary `github.io/<repo>/` URL.

## Future domain

The SEO URL is environment-driven. While the site lives only on GitHub Pages, use the real GitHub Pages URL as the canonical site URL. When `mimalabsworld.com` is connected, set the production site URL to `https://mimalabsworld.com`; sitemap, canonical URLs, Open Graph and structured data follow that configuration.

## Before public launch

- Contact email: `info.mimalabs@gmail.com`
- Keep social profile URLs current if handles change.
- Keep legal/privacy text under review as analytics, embeds or business operations change.

## V32 UI simplification
The hero now has one static message and one simple book carousel. The Books section has been reduced to cover, age, title and availability, with all three collections visible together in landscape and one-book swipe in portrait.

## V35 responsive cleanup
The Home and Books areas now use a centered, minimal responsive system. See `README_V35.md`.

## V37 focused update
Opinions now uses the same one-card portrait slider pattern as Books with three dots below and a terracotta active dot. Amazon availability has also been updated to the confirmed locale links supplied on 5 Oct 2026; unlisted locales remain Coming soon.

## V38 focused update
Portrait Opinions keeps the three-dot slider but hides the native horizontal scrollbar. Final Instagram, TikTok, Facebook and contact email details are now wired into the UI, legal/contact copy and Organization structured data.
