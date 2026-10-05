"use client";

import type { Locale } from "@/i18n/config";
import { localeMeta } from "@/i18n/config";
import { trackEvent } from "@/lib/analytics";

export function AmazonButton({ href, label, externalLabel, product, locale }: { href: string; label: string; externalLabel: string; product: string; locale: Locale }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — ${product}. ${externalLabel}`}
      onClick={() => trackEvent("Amazon Click", { product, locale, marketplace: localeMeta[locale].amazonHost })}
      className="btn-primary w-full sm:w-auto"
    >
      {label}<span aria-hidden="true">↗</span>
    </a>
  );
}
