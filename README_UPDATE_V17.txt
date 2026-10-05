MIMA LABS V17

Responsive navigation
- Full navigation + social icons remain visible on large landscape screens.
- Below 1180px, navigation and social icons move into an accessible hamburger menu.
- Brand, language flag, and hamburger always remain on one row.
- Hamburger animates into a close icon and closes when a navigation/social link is selected.
- The mobile header no longer needs a second social row, preserving vertical space for the hero.

Capabilities retained and completed
1. SEO
   - Localized SEO titles, descriptions, and intent keywords for EN/DE/ES/FR/IT/CA.
   - Canonical + hreflang + x-default metadata.
   - Open Graph and Twitter metadata.
   - robots.txt and sitemap generation.
   - JSON-LD for Organization, WebSite and localized Book listings.
   - Configurable production domain through NEXT_PUBLIC_SITE_URL.

2. Localized book covers
   - Real localized front covers are used in the hero and Books section.
   - Farm DE and IT are intentionally unavailable on Amazon and automatically render Coming soon.
   - Adding the DE/IT Amazon URL in content/products.ts automatically removes Coming soon.

Before launch
- Set NEXT_PUBLIC_SITE_URL to the production domain.
- Replace placeholder Amazon search links with exact live book listing URLs.
- Replace the temporary email address.
- Add Google Search Console verification via NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION if desired.
