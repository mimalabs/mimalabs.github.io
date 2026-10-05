import Image from "next/image";
import { siteConfig, withBasePath } from "@/config/site";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="header-brand-lockup">
        <span className="header-mark-frame" aria-hidden="true">
          <Image
            src={withBasePath("/brand/mima-labs-mark.png")}
            alt=""
            width={72}
            height={72}
            priority
            className="header-mark-image"
          />
        </span>
        <span className="header-brand-name">MIMA LABS</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-4">
      <Image
        src={withBasePath(siteConfig.brand.logoSrc)}
        alt="MIMA LABS"
        width={118}
        height={118}
        className="footer-brand-logo h-auto w-auto"
      />
      <span className="hidden sm:block">
        <span className="block font-display text-[1.12rem] font-semibold tracking-[.12em] text-brand-brown">MIMA LABS</span>
        <span className="block text-[.68rem] font-bold uppercase tracking-[.14em] text-brand-muted">Awakening your creativity</span>
      </span>
    </span>
  );
}
