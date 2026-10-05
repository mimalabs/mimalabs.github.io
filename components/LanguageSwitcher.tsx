"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePathname } from "next/navigation";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { localizePathname } from "@/i18n/path";
import { trackEvent } from "@/lib/analytics";
import { siteConfig, withBasePath } from "@/config/site";

function UsFlag() {
  const stars = Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, col) => (
      <circle
        key={`${row}-${col}`}
        cx={4 + col * 7 + (row % 2 === 0 ? 0 : 3.5)}
        cy={3.5 + row * 2.25}
        r="0.72"
        fill="white"
      />
    )),
  );

  return (
    <svg viewBox="0 0 76 40" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">
      <rect width="76" height="40" fill="#fff" />
      {Array.from({ length: 7 }, (_, index) => (
        <rect key={index} y={index * 6.15} width="76" height="3.08" fill="#b22234" />
      ))}
      <rect width="42" height="21.6" fill="#3c3b6e" />
      {stars}
    </svg>
  );
}

function LocaleFlag({ locale }: { locale: Locale }) {
  const common = {
    role: "presentation" as const,
    focusable: false as const,
    preserveAspectRatio: "xMidYMid slice" as const,
  };

  return (
    <span className="language-flag" aria-hidden="true">
      {locale === "en" && <UsFlag />}
      {locale === "de" && (
        <svg viewBox="0 0 5 3" {...common}>
          <path fill="#000" d="M0 0h5v1H0z" />
          <path fill="#DD0000" d="M0 1h5v1H0z" />
          <path fill="#FFCE00" d="M0 2h5v1H0z" />
        </svg>
      )}
      {locale === "es" && (
        <svg viewBox="0 0 6 4" {...common}>
          <path fill="#AA151B" d="M0 0h6v1H0zM0 3h6v1H0z" />
          <path fill="#F1BF00" d="M0 1h6v2H0z" />
        </svg>
      )}
      {locale === "fr" && (
        <svg viewBox="0 0 3 2" {...common}>
          <path fill="#002395" d="M0 0h1v2H0z" />
          <path fill="#fff" d="M1 0h1v2H1z" />
          <path fill="#ED2939" d="M2 0h1v2H2z" />
        </svg>
      )}
      {locale === "it" && (
        <svg viewBox="0 0 3 2" {...common}>
          <path fill="#009246" d="M0 0h1v2H0z" />
          <path fill="#fff" d="M1 0h1v2H1z" />
          <path fill="#CE2B37" d="M2 0h1v2H2z" />
        </svg>
      )}
      {locale === "ca" && (
        <svg viewBox="0 0 9 9" {...common}>
          <rect width="9" height="9" fill="#FCDD09" />
          <path fill="#DA121A" d="M0 1h9v1H0zM0 3h9v1H0zM0 5h9v1H0zM0 7h9v1H0z" />
        </svg>
      )}
    </span>
  );
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const normalizedPathname = siteConfig.paths.basePath && pathname.startsWith(siteConfig.paths.basePath)
    ? pathname.slice(siteConfig.paths.basePath.length) || "/"
    : pathname;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`${label}: ${localeMeta[locale].label}`}
          title={localeMeta[locale].label}
          className="language-trigger"
        >
          <LocaleFlag locale={locale} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={10} className="language-menu">
          <div className="language-list" aria-label={label}>
            {locales.map((item) => {
              const href = withBasePath(localizePathname(normalizedPathname, item));
              const active = item === locale;

              return (
                <DropdownMenu.Item key={item} asChild>
                  <a
                    href={href}
                    lang={item}
                    aria-current={active ? "page" : undefined}
                    onClick={() => trackEvent("Language Selected", { from: locale, to: item })}
                    className={`language-option${active ? " is-active" : ""}`}
                  >
                    <LocaleFlag locale={item} />
                    <span className="language-option-label">{localeMeta[item].label}</span>
                    <span className="language-option-state" aria-hidden="true">{active ? "•" : ""}</span>
                  </a>
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
