"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { BrandLogo } from "@/components/BrandLogo";
import { siteConfig } from "@/config/site";

export function HeaderBrandLink({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const normalizedPathname = siteConfig.paths.basePath && pathname.startsWith(siteConfig.paths.basePath)
    ? pathname.slice(siteConfig.paths.basePath.length) || "/"
    : pathname;
  const homePath = `/${locale}/`;
  const isHome = normalizedPathname === homePath || normalizedPathname === homePath.slice(0, -1);

  return (
    <Link
      href={homePath}
      aria-label="MIMA LABS home"
      className="header-brand-mark"
      onClick={(event) => {
        if (!isHome) return;
        event.preventDefault();
        if (window.scrollY > 2) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      <BrandLogo compact />
    </Link>
  );
}
