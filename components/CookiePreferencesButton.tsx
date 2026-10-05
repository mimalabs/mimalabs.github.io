"use client";

import type { Dictionary } from "@/i18n/get-dictionary";

export function CookiePreferencesButton({ dict }: { dict: Dictionary }) {
  return (
    <button
      type="button"
      className="footer-preferences-button"
      onClick={() => window.dispatchEvent(new CustomEvent("mima:open-consent"))}
    >
      {dict.cookieConsent.manage}
    </button>
  );
}
