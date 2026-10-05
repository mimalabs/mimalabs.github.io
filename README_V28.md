# MIMA LABS V28 — launch candidate

V28 keeps the V27 design/UX and adds the final three-book collection plus GitHub Pages deployment readiness.

## Product collection

- Farm — final localized covers in EN / DE / ES / FR / IT / CA.
- Halloween — final localized covers in EN / DE / ES / FR / IT / CA.
- Christmas — NEW, final localized covers in EN / DE / ES / FR / IT / CA.
- Hero now shows Farm + Halloween + Christmas.
- Books rail now shows Farm + Halloween + Christmas, followed by the existing Growing Library card.
- Full cover artwork remains uncropped.

## Launch availability

Only these editions are enabled:

- Farm English
- Farm French

Every other edition is intentionally omitted from `editionByLocale`, so the existing disabled/greyed-out Coming Soon state is used automatically in both the hero and Books section.

The two active Amazon destinations are still search URLs because exact ASIN/product URLs were not supplied. Replace them in `content/products.ts` when the direct listing URLs are available.

## Social profiles

Configured globally in `config/site.ts`:

- Instagram: https://www.instagram.com/mimalabs.studio/
- TikTok: https://www.tiktok.com/@mimalabs.studio
- Facebook: https://facebook.com (temporary placeholder)

These are used by the visible social buttons and the Organization `sameAs` structured-data field.

## SEO / future mimalabsworld.com

The code is prepared for `https://mimalabsworld.com` without publishing a false canonical URL on GitHub Pages.

- Local/default canonical target: `https://mimalabsworld.com`
- GitHub Pages workflow overrides `NEXT_PUBLIC_SITE_URL` with the actual `github.io` deployment URL.
- When `mimalabsworld.com` is connected later, set the repository variable `NEXT_PUBLIC_SITE_URL=https://mimalabsworld.com` and leave `NEXT_PUBLIC_BASE_PATH` empty.
- Add `public/CNAME` containing `mimalabsworld.com` at that time. `public/CNAME.example` is included as a template; it is intentionally not active yet.

SEO metadata now includes Farm, Halloween and Christmas queries in all six languages. Canonical URLs, hreflang, Open Graph, Twitter metadata, sitemap and structured data all use the active deployment URL.

## GitHub Pages deployment

1. Create a GitHub repository and push the contents of this folder to the `main` branch.
2. In GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main` (or run the workflow manually from **Actions**).
4. `.github/workflows/deploy-pages.yml` detects whether this is a user Pages repository (`<user>.github.io`) or a project Pages repository and configures the correct base path automatically.
5. The exported site is deployed from `out/`.

Optional repository variables:

- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- later: `NEXT_PUBLIC_SITE_URL=https://mimalabsworld.com`
- later: `NEXT_PUBLIC_BASE_PATH=`

## Still required before a polished public launch

- Replace `info@gmail.com` with the real monitored MIMA LABS business email.
- Replace the two Farm Amazon search URLs with exact product/ASIN URLs when available.
- Replace the temporary Facebook URL when the official profile exists.
- Complete legal review of the legal/privacy copy for the actual deployed setup.
