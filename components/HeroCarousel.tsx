"use client";

import { useMemo } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import { products } from "@/content/products";
import { getProductCoverSrc } from "@/lib/product-covers";
import { trackEvent } from "@/lib/analytics";

export function HeroCarousel({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const hero = dict.hero.slide1;

  const heroBooks = useMemo(
    () =>
      products.map((product) => {
        const copy = dict.productFamilies[product.id];
        return {
          id: product.id,
          src: getProductCoverSrc(product.id, locale),
          alt: `${copy.title} cover`,
          title: copy.theme,
          amazonUrl: product.editionByLocale[locale]?.amazonUrl?.trim(),
        };
      }),
    [dict.productFamilies, locale],
  );

  return (
    <section aria-label="MIMA LABS introduction" className="viewport-section section-shell section-tone section-tone-hero">
      <div className="glass-surface hero-card relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(242,199,100,.18),transparent_30%),radial-gradient(circle_at_84%_25%,rgba(136,170,121,.16),transparent_34%)]" aria-hidden="true" />

        <div className="hero-layout relative">
          <div className="hero-copy flex items-center">
            <div className="hero-copy-inner max-w-2xl">
              <span className="eyebrow">{hero.eyebrow}</span>
              <h1 className="pretty-balance mt-4 font-display text-[clamp(2.9rem,7vw,5.8rem)] font-semibold leading-[.94] tracking-[-.055em] text-brand-brown">
                {hero.title}
              </h1>
              <p className="pretty-wrap mt-5 max-w-lg text-[clamp(1rem,1.45vw,1.18rem)] leading-7 text-brand-muted">
                {hero.body}
              </p>
              <div className="mt-7">
                <a href="#products" className="btn-primary">
                  {hero.cta}<span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="hero-art relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-[5%] rounded-full bg-gradient-to-br from-brand-sun/20 via-white/10 to-brand-leaf/20 blur-2xl" aria-hidden="true" />

            <div className="hero-static-gallery" aria-label="MIMA LABS book collections">
              {heroBooks.map((book, index) => {
                const cover = (
                  <div className="hero-book-cover real-cover relative overflow-hidden border border-white/70 bg-brand-cream shadow-[0_24px_60px_rgba(56,37,27,.14)]">
                    <img src={book.src} alt={book.alt} className="block h-auto w-full object-contain" />
                    {!book.amazonUrl && <div className="hero-static-status">{dict.common.comingSoon}</div>}
                  </div>
                );

                return book.amazonUrl ? (
                  <a
                    key={book.id}
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hero-static-book hero-book-interactive hero-static-book-${index + 1}`}
                    aria-label={`${dict.common.viewAmazon} — ${book.title}. ${dict.common.externalLink}`}
                    onClick={() => trackEvent("Amazon Click", { product: book.id, locale, marketplace: localeMeta[locale].amazonHost, placement: "hero" })}
                  >
                    {cover}
                  </a>
                ) : (
                  <div
                    key={book.id}
                    className={`hero-static-book hero-book-unavailable hero-static-book-${index + 1}`}
                    aria-label={`${book.title}: ${dict.common.comingSoon}`}
                  >
                    {cover}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
