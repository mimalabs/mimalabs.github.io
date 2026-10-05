import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { HeaderBrandLink } from "@/components/HeaderBrandLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ResponsiveHeaderMenu } from "@/components/ResponsiveHeaderMenu";
import { SocialLinks } from "@/components/SocialLinks";
import { siteConfig, withBasePath } from "@/config/site";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="site-header sticky top-0 z-50 py-2">
      <div className="section-shell">
        <div className="nav-surface flex min-h-[calc(var(--header-height)-1rem)] items-center justify-between gap-3 rounded-full px-3.5 sm:px-5">
          <HeaderBrandLink locale={locale} />

          <nav aria-label="Main navigation" className="desktop-primary-nav items-center gap-5">
            <a href={withBasePath(`/${locale}/#products`)} className="text-sm font-bold text-brand-muted transition hover:text-brand-brown">{dict.nav.products}</a>
            {siteConfig.features.testimonials.enabled && (
              <a href={withBasePath(`/${locale}/#opinions`)} className="text-sm font-bold text-brand-muted transition hover:text-brand-brown">{dict.nav.reviews}</a>
            )}
            <a href={withBasePath(`/${locale}/#contact`)} className="text-sm font-bold text-brand-muted transition hover:text-brand-brown">{dict.nav.contact}</a>
          </nav>

          <div className="header-actions">
            <div className="desktop-header-socials">
              <SocialLinks variant="header" />
            </div>
            <div className="header-language">
              <LanguageSwitcher locale={locale} label={dict.nav.language} />
            </div>
            <div className="compact-header-menu">
              <ResponsiveHeaderMenu locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
