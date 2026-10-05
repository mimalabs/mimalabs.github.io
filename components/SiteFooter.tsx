import Link from "next/link";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig, withBasePath } from "@/config/site";
import { SocialLinks } from "@/components/SocialLinks";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const exploreLinks = [
    ["about", dict.footer.links.about],
    ["faq", dict.footer.links.faq],
  ] as const;

  const legalLinks = [
    ["privacy", dict.footer.links.privacy],
    ["cookies", dict.footer.links.cookies],
    ["legal", dict.footer.links.legal],
    ["terms", dict.footer.links.terms],
    ["accessibility", dict.footer.links.accessibility],
  ] as const;

  return (
    <footer id="footer" className="footer-viewport bg-brand-brown text-brand-cream">
      <div className="section-shell w-full">
        <div className="footer-frame">
          <div className="footer-brand-panel">
            <div className="footer-logo-stage">
              <BrandLogo />
            </div>
            <div className="footer-geometry" aria-hidden="true">
              <span className="footer-geometry-circle" />
              <span className="footer-geometry-square" />
              <span className="footer-geometry-triangle" />
            </div>
          </div>

          <div className="footer-content-panel">
            <div className="footer-message">
              <span className="footer-kicker">MIMA LABS</span>
              <h2 className="pretty-balance font-display text-[clamp(2.7rem,5.3vw,5.8rem)] font-semibold leading-[.9] tracking-[-.055em] text-white">{dict.footer.pitch}</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/55 md:text-base">{dict.footer.parentNote}</p>
              <div className="footer-actions-row">
                <a href={withBasePath(`/${locale}/#contact`)} className="footer-contact-pill">{dict.nav.contact}<span aria-hidden="true">↗</span></a>
                <SocialLinks />
              </div>
            </div>

            <div className="footer-link-grid">
              <div>
                <p className="footer-link-heading">{dict.footer.exploreLabel}</p>
                <nav aria-label={dict.footer.exploreLabel} className="footer-link-list">
                  {exploreLinks.map(([slug, label]) => (
                    <Link key={slug} href={`/${locale}/${slug}/`}>{label}</Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="footer-link-heading">{dict.footer.legalLabel}</p>
                <nav aria-label={dict.footer.legalLabel} className="footer-link-list">
                  {legalLinks.map(([slug, label]) => (
                    <Link key={slug} href={`/${locale}/${slug}/`}>{label}</Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="footer-meta">
            <span>© {new Date().getFullYear()} {siteConfig.brand.name}. {dict.footer.rights}</span>
            <span className="footer-meta-actions"><CookiePreferencesButton dict={dict} /><span>{siteConfig.brand.location}</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
