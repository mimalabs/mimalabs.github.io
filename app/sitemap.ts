import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const infoPages = ["about", "faq", "privacy", "cookies", "legal", "terms", "accessibility"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const now = new Date();

  return locales.flatMap((locale) => {
    const baseUrl = `${siteUrl}/${locale}`;
    const homeAlternates = Object.fromEntries([
      ...locales.map((item) => [item, `${siteUrl}/${item}/`] as const),
      ["x-default", `${siteUrl}/en/`] as const,
    ]);

    return [
      {
        url: `${baseUrl}/`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 1,
        alternates: { languages: homeAlternates },
      },
      ...infoPages.map((slug) => ({
        url: `${baseUrl}/${slug}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((item) => [item, `${siteUrl}/${item}/${slug}/`] as const),
            ["x-default", `${siteUrl}/en/${slug}/`] as const,
          ]),
        },
      })),
    ];
  });
}
