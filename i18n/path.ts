import { isLocale, type Locale } from "@/i18n/config";

/**
 * Returns the same route in another locale.
 * Works both from localized routes (/en/about/) and from non-localized paths.
 */
export function localizePathname(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = nextLocale;
  } else {
    segments.unshift(nextLocale);
  }

  return `/${segments.join("/")}/`;
}
