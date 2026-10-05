import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { products } from "@/content/products";
import { siteConfig } from "@/config/site";
import { getProductCoverPath } from "@/lib/product-covers";

export function StructuredData({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const localizedBaseUrl = `${siteUrl}/${locale}/`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brand.name,
    url: siteUrl,
    logo: `${siteUrl}${siteConfig.brand.logoSrc}`,
    description: dict.meta.description,
    email: siteConfig.legal.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zug",
      addressCountry: "CH",
    },
    sameAs: siteConfig.seo.socialProfiles,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: localizedBaseUrl,
    inLanguage: locale,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.brand.name} books`,
    itemListElement: products.map((product, index) => {
      const copy = dict.productFamilies[product.id];
      const amazonUrl = product.editionByLocale[locale]?.amazonUrl;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Book",
          name: copy.title,
          description: copy.description,
          image: `${siteUrl}${getProductCoverPath(product.id, locale)}`,
          inLanguage: locale,
          url: amazonUrl ?? localizedBaseUrl,
          audience: {
            "@type": "PeopleAudience",
            suggestedMinAge: 1,
            suggestedMaxAge: 3,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.brand.name,
          },
        },
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema, itemListSchema]) }}
    />
  );
}
