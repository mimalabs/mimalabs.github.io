"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { SocialLinks } from "@/components/SocialLinks";
import { siteConfig, withBasePath } from "@/config/site";

export function ResponsiveHeaderMenu({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button type="button" className="hamburger-trigger" aria-label="Open navigation menu">
          <span className="hamburger-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={10} className="header-menu-panel">
          <nav aria-label="Mobile navigation" className="header-menu-nav">
            <DropdownMenu.Item asChild>
              <a href={withBasePath(`/${locale}/#products`)} className="header-menu-link">
                <span>{dict.nav.products}</span><span aria-hidden="true">↘</span>
              </a>
            </DropdownMenu.Item>

            {siteConfig.features.testimonials.enabled && (
              <DropdownMenu.Item asChild>
                <a href={withBasePath(`/${locale}/#opinions`)} className="header-menu-link">
                  <span>{dict.nav.reviews}</span><span aria-hidden="true">↘</span>
                </a>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item asChild>
              <a href={withBasePath(`/${locale}/#contact`)} className="header-menu-link">
                <span>{dict.nav.contact}</span><span aria-hidden="true">↘</span>
              </a>
            </DropdownMenu.Item>
          </nav>

          <div className="header-menu-divider" />

          <div className="header-menu-socials">
            <span className="header-menu-caption">Social</span>
            <SocialLinks variant="menu" />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
