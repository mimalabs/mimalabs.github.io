"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { products } from "@/content/products";
import { ProductCoverPlaceholder } from "@/components/ProductCoverPlaceholder";
import { AmazonButton } from "@/components/AmazonButton";
import { AnalyticsImpression } from "@/components/AnalyticsImpression";
import { getProductCoverSrc } from "@/lib/product-covers";

export function ProductSlider({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      setHasOverflow(track.scrollWidth > track.clientWidth + 2);
      const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-product-slide]"));
      if (!slides.length) return;
      const trackLeft = track.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      setActiveSlide(closestIndex);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));
    track.addEventListener("scroll", update, { passive: true });

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-product-slide]"));
    const target = slides[Math.max(0, Math.min(index, slides.length - 1))];
    if (!target) return;
    const targetLeft = target.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  return (
    <section id="products" className="viewport-section section-shell section-tone section-tone-products catalog-section scroll-mt-[var(--header-height)]">
      <div className="catalog-layout catalog-simple-layout w-full">
        <div className="catalog-simple-heading">
          <span className="eyebrow">{dict.products.eyebrow}</span>
          <h2 className="pretty-balance font-display font-semibold text-brand-brown">{dict.products.title}</h2>
          <p className="catalog-simple-intro pretty-wrap text-brand-muted">{dict.products.intro}</p>
        </div>

        <div ref={trackRef} className="responsive-track product-track catalog-track catalog-simple-track adaptive-scrollbar">
          {products.map((product) => {
            const copy = dict.productFamilies[product.id];
            const amazonUrl = product.editionByLocale[locale]?.amazonUrl?.trim();
            const comingSoon = !amazonUrl;

            return (
              <article key={product.id} data-product-slide className={`responsive-slide product-slide catalog-simple-slide snap-start ${comingSoon ? "product-unavailable" : ""}`}>
                <AnalyticsImpression eventName="Product Viewed" props={{ product: product.id, locale, age: product.ageRange }}>
                  <div className="catalog-simple-card">
                    <ProductCoverPlaceholder
                      id={product.id}
                      label={copy.theme}
                      src={getProductCoverSrc(product.id, locale)}
                      alt={`${copy.title} cover`}
                      comingSoon={comingSoon}
                      comingSoonLabel={dict.common.comingSoon}
                      href={amazonUrl}
                      locale={locale}
                      externalLabel={dict.common.externalLink}
                    />

                    <div className="catalog-simple-copy">
                      <span className="catalog-simple-age">{dict.common.age} {product.ageRange}</span>
                      <h3 className="catalog-simple-title font-display font-semibold text-brand-brown">{copy.title}</h3>
                      <div className="catalog-simple-action">
                        {amazonUrl ? (
                          <AmazonButton
                            href={amazonUrl}
                            label={dict.common.viewAmazon}
                            externalLabel={dict.common.externalLink}
                            product={product.id}
                            locale={locale}
                          />
                        ) : (
                          <div className="coming-soon-state catalog-simple-soon" aria-label={dict.common.comingSoon}>
                            <strong>{dict.common.comingSoon}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnalyticsImpression>
              </article>
            );
          })}
        </div>

        {hasOverflow && (
          <div className="catalog-simple-dots" role="tablist" aria-label="Books">
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                role="tab"
                aria-selected={activeSlide === index}
                aria-label={dict.productFamilies[product.id].theme}
                className={activeSlide === index ? "is-active" : ""}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
