import type { Dictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/config/site";

export function ContactSection({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact" className="viewport-section section-shell section-tone section-tone-contact scroll-mt-[var(--header-height)]">
      <div className="glass-surface relative flex w-full overflow-hidden rounded-[var(--radius-surface)] px-6 py-14 sm:px-10 md:min-h-[62vh] md:items-center md:px-14 lg:px-20">
        <div className="absolute right-[-8%] top-[-18%] h-72 w-72 rounded-full bg-brand-sun/22 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-28%] left-[15%] h-80 w-80 rounded-full bg-brand-leaf/18 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-4xl">
          <span className="eyebrow">{dict.contact.eyebrow}</span>
          <h2 className="pretty-balance mt-4 font-display text-[clamp(2.8rem,6vw,5.8rem)] font-semibold leading-[.94] tracking-[-.055em] text-brand-brown">{dict.contact.title}</h2>
          <p className="pretty-wrap mt-5 max-w-2xl text-[clamp(1rem,1.6vw,1.22rem)] leading-7 text-brand-muted">{dict.contact.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={`mailto:${siteConfig.legal.email}`} className="btn-primary">{dict.contact.cta}<span aria-hidden="true">↗</span></a>
            <span className="text-sm font-semibold text-brand-muted">{siteConfig.legal.email}</span>
          </div>
          <p className="mt-4 text-xs font-semibold text-brand-muted/75">{dict.contact.note}</p>
        </div>
      </div>
    </section>
  );
}
