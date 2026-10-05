"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { siteConfig } from "@/config/site";

type ConsentChoice = "all" | "essential";

export function CookieConsentBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [visible, setVisible] = useState(false);
  const config = siteConfig.features.cookieConsent;

  useEffect(() => {
    if (!config.required) return;

    const syncVisibility = () => {
      try {
        setVisible(window.localStorage.getItem(config.storageKey) === null);
      } catch {
        setVisible(true);
      }
    };

    const openPreferences = () => setVisible(true);
    syncVisibility();
    window.addEventListener("mima:open-consent", openPreferences);
    return () => window.removeEventListener("mima:open-consent", openPreferences);
  }, [config.required, config.storageKey]);

  if (!config.required || !visible) return null;

  function choose(choice: ConsentChoice) {
    try {
      window.localStorage.setItem(config.storageKey, choice);
    } catch {
      // The preference simply lasts for this page view if storage is unavailable.
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("mima:consent", { detail: choice }));
  }

  return (
    <aside className="cookie-banner" aria-label={dict.cookieConsent.title} aria-live="polite">
      <div className="cookie-banner-copy">
        <strong>{dict.cookieConsent.title}</strong>
        <p>{dict.cookieConsent.body} <Link href={`/${locale}/cookies/`}>{dict.cookieConsent.learnMore}</Link></p>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-button-secondary" onClick={() => choose("essential")}>{dict.cookieConsent.essentialOnly}</button>
        <button type="button" className="cookie-button-primary" onClick={() => choose("all")}>{dict.cookieConsent.acceptAll}</button>
      </div>
    </aside>
  );
}
