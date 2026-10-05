"use client";

import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import type { ProductFamilyId } from "@/types/content";
import { trackEvent } from "@/lib/analytics";

export function ProductCoverPlaceholder({
  id,
  label,
  src,
  alt,
  comingSoon = false,
  comingSoonLabel,
  href,
  locale,
  externalLabel,
}: {
  id: ProductFamilyId;
  label: string;
  src: string;
  alt: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
  href?: string;
  locale?: Locale;
  externalLabel?: string;
}) {
  const coverTone = id === "farm"
    ? "bg-gradient-to-br from-brand-leaf/20 via-brand-sun/24 to-brand-cream"
    : id === "christmas"
      ? "bg-gradient-to-br from-brand-sun/26 via-brand-leaf/16 to-brand-cream"
      : "bg-gradient-to-br from-brand-terracotta/24 via-brand-sun/20 to-brand-cream";
  const className = `product-cover product-cover-real relative overflow-hidden rounded-[1.65rem] p-[clamp(.45rem,1.1vw,.7rem)] ${comingSoon ? "product-cover-unavailable" : ""} ${coverTone}`;

  const content = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(255,255,255,.7),transparent_16%),radial-gradient(circle_at_14%_92%,rgba(255,255,255,.3),transparent_24%)]" aria-hidden="true" />
      <div className="product-cover-frame relative h-full overflow-hidden rounded-[1.35rem] border border-white/70 bg-white shadow-[0_18px_46px_rgba(56,37,27,.14)]">
        <img src={src} alt={alt} className="block h-full w-full object-contain" loading="lazy" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/18 via-white/0 to-transparent" aria-hidden="true" />
        <div className="product-cover-badge absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[.62rem] font-black uppercase tracking-[.14em] text-brand-brown shadow-[0_10px_24px_rgba(56,37,27,.12)] backdrop-blur">
          MIMA LABS
        </div>
        <div className="product-cover-badge absolute bottom-3 left-3 rounded-full bg-white/88 px-3 py-1 text-[.62rem] font-black uppercase tracking-[.14em] text-brand-brown shadow-[0_10px_24px_rgba(56,37,27,.12)] backdrop-blur">
          {label}
        </div>

      </div>
    </>
  );

  if (href && locale) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${alt}. ${externalLabel ?? "Opens an external site"}`}
        className={`${className} product-cover-link`}
        onClick={() => trackEvent("Amazon Click", { product: id, locale, marketplace: localeMeta[locale].amazonHost, placement: "cover" })}
      >
        {content}
      </a>
    );
  }

  return (
    <div aria-label={`${alt}. ${comingSoonLabel ?? "Coming soon"}`} aria-disabled={comingSoon || undefined} className={className}>
      {content}
    </div>
  );
}
