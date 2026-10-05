import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTopButton } from "@/components/BackToTopButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { siteConfig } from "@/config/site";
import { localizedSeo } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};

  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const seo = localizedSeo[locale];
  const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const canonical = `${siteUrl}/${locale}/`;
  const languageAlternates = Object.fromEntries(locales.map((item) => [item, `${siteUrl}/${item}/`]));

  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    applicationName: siteConfig.brand.name,
    creator: siteConfig.brand.name,
    publisher: siteConfig.brand.name,
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        "x-default": `${siteUrl}/en/`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: siteConfig.brand.name,
      locale,
      type: "website",
      images: [
        {
          url: `${siteUrl}${siteConfig.seo.defaultOgImage}`,
          alt: `${siteConfig.brand.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${siteUrl}${siteConfig.seo.defaultOgImage}`],
    },
    verification: siteConfig.seo.googleSiteVerification
      ? { google: siteConfig.seo.googleSiteVerification }
      : undefined,
    other: {
      "content-language": locale,
      "apple-mobile-web-app-title": siteConfig.brand.name,
    },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const dict = await getDictionary(locale);

  return (
    <div lang={locale}>
      <SiteHeader locale={locale} dict={dict} />
      {children}
      <SiteFooter locale={locale} dict={dict} />
      <BackToTopButton dict={dict} />
      <CookieConsentBanner locale={locale} dict={dict} />
    </div>
  );
}
