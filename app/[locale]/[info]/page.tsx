import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/config/site";

const infoSlugs = ["about", "faq", "privacy", "cookies", "legal", "terms", "accessibility"] as const;
type InfoSlug = (typeof infoSlugs)[number];

function isInfoSlug(value: string): value is InfoSlug {
  return infoSlugs.includes(value as InfoSlug);
}

export function generateStaticParams() {
  return locales.flatMap((locale) => infoSlugs.map((info) => ({ locale, info })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; info: string }> }): Promise<Metadata> {
  const { locale: localeParam, info } = await params;
  if (!isLocale(localeParam) || !isInfoSlug(info)) return {};

  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const page = dict.infoPages[info];
  const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, "");
  const canonical = `${siteUrl}/${locale}/${info}/`;
  const languages = Object.fromEntries([
    ...locales.map((item) => [item, `${siteUrl}/${item}/${info}/`] as const),
    ["x-default", `${siteUrl}/en/${info}/`] as const,
  ]);
  const title = `${page.title} — ${siteConfig.brand.name}`;

  return {
    title,
    description: page.intro,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description: page.intro,
      url: canonical,
      siteName: siteConfig.brand.name,
      type: "website",
      images: [{ url: `${siteUrl}${siteConfig.seo.defaultOgImage}`, alt: `${siteConfig.brand.name} logo` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.intro,
      images: [`${siteUrl}${siteConfig.seo.defaultOgImage}`],
    },
  };
}

export default async function InfoPage({ params }: { params: Promise<{ locale: string; info: string }> }) {
  const { locale, info } = await params;
  if (!isLocale(locale) || !isInfoSlug(info)) notFound();
  const dict = await getDictionary(locale);
  const page = dict.infoPages[info];

  return (
    <main id="main-content" className="section-shell py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href={`/${locale}/#footer`} className="inline-flex min-h-11 items-center rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-brown transition hover:bg-brand-cream">← {dict.common.backHome}</Link>
        <h1 className="pretty-balance mt-8 font-display text-5xl font-semibold tracking-[-.03em] text-brand-brown sm:text-6xl">{page.title}</h1>
        <p className="pretty-wrap mt-5 text-lg leading-8 text-brand-muted">{page.intro}</p>
        <div className="mt-10 space-y-5">
          {page.sections.map((section) => (
            <section key={section.heading} className="soft-card rounded-[1.6rem] p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-brand-brown">{section.heading}</h2>
              <p className="mt-3 leading-7 text-brand-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
