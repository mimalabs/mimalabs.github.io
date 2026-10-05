"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { testimonials } from "@/content/testimonials";
import { siteConfig } from "@/config/site";
import { RatingStars } from "@/components/RatingStars";

export function TestimonialsSection({ dict }: { dict: Dictionary }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-testimonial-slide]"));
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
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-testimonial-slide]"));
    const target = slides[index];
    if (!target) return;

    const targetLeft = target.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  if (!siteConfig.features.testimonials.enabled) return null;

  return (
    <section id="opinions" className="viewport-section section-tone section-tone-opinions scroll-mt-[var(--header-height)]">
      <div className="section-shell flex w-full flex-col justify-center">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">{dict.testimonials.eyebrow}</span>
            <h2 className="mt-3 font-display text-[clamp(2.45rem,5vw,4.5rem)] font-semibold leading-[.98] tracking-[-.045em] text-brand-brown">{dict.testimonials.title}</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-brand-muted md:text-lg">{dict.testimonials.intro}</p>
          </div>
          <span className="w-fit rounded-full bg-white/70 px-3 py-1.5 text-[.66rem] font-black uppercase tracking-[.09em] text-brand-muted shadow-sm">{dict.testimonials.demoLabel}</span>
        </div>

        <div ref={trackRef} className="responsive-track testimonials-track mt-7">
          {testimonials.map((item) => (
            <article key={item.id} data-testimonial-slide className="testimonial-slide testimonial-story snap-start">
              <div className="testimonial-card-grid">
                <div className="testimonial-video">
                  {item.videoUrl ? (
                    <video controls preload="metadata" poster={item.posterUrl} className="h-full w-full object-cover">
                      <source src={item.videoUrl} />
                    </video>
                  ) : (
                    <div className="flex max-w-xs flex-col items-center text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg text-brand-brown shadow-lg" aria-hidden="true">▶</span>
                      <p className="mt-3 text-sm font-bold text-brand-muted">{dict.testimonials.videoPlaceholder}</p>
                    </div>
                  )}
                </div>
                <div className="testimonial-copy">
                  <RatingStars score={item.scoreOutOf10} suffix={dict.testimonials.ratingSuffix} />
                  <blockquote className="mt-5 font-display text-[clamp(1.45rem,2vw,2.15rem)] font-medium leading-[1.08] tracking-[-.035em] text-brand-brown">“{dict.testimonials.quotes[item.quoteKey]}”</blockquote>
                  <p className="mt-5 text-sm font-black text-brand-muted">{item.author}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="opinions-simple-dots" role="tablist" aria-label={dict.testimonials.title}>
          {testimonials.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeSlide === index}
              aria-label={`${dict.testimonials.eyebrow} ${index + 1}`}
              className={activeSlide === index ? "is-active" : ""}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
