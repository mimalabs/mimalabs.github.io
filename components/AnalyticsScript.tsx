"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

type ConsentChoice = "all" | "essential";

export function AnalyticsScript() {
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC;
  const { required, storageKey } = siteConfig.features.cookieConsent;
  const [allowed, setAllowed] = useState(!required);

  useEffect(() => {
    if (!required) {
      setAllowed(true);
      return;
    }

    try {
      setAllowed(window.localStorage.getItem(storageKey) === "all");
    } catch {
      setAllowed(false);
    }

    const handleConsent = (event: Event) => {
      const choice = (event as CustomEvent<ConsentChoice>).detail;
      setAllowed(choice === "all");
    };

    window.addEventListener("mima:consent", handleConsent);
    return () => window.removeEventListener("mima:consent", handleConsent);
  }, [required, storageKey]);

  if (!src || !allowed) return null;

  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
      </Script>
    </>
  );
}
