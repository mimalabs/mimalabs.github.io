MIMA LABS V16 update

Implemented
1. SEO foundations
   - localized metadata titles/descriptions/keywords
   - Open Graph + Twitter tags
   - robots.ts + sitemap.ts
   - JSON-LD structured data for Organization / Website / Book list
   - site URL configurable via NEXT_PUBLIC_SITE_URL

2. Localized book covers
   - real front covers from Portadas.zip used in hero and product cards
   - localized per language
   - Farm DE and IT intentionally show “Coming soon” because Amazon listing is not public yet

Key files
- content/products.ts
- components/HeroCarousel.tsx
- components/ProductSlider.tsx
- components/ProductCoverPlaceholder.tsx
- components/StructuredData.tsx
- lib/product-covers.ts
- lib/seo.ts
- app/robots.ts
- app/sitemap.ts
- app/[locale]/layout.tsx
- preview.html

Before production
- replace placeholder Amazon search URLs with final product URLs
- set NEXT_PUBLIC_SITE_URL to the real domain
- optionally set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
- replace temporary contact email if needed
