import type { Locale } from "@/i18n/config";

function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "/") return "";
  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const socialProfiles = {
  instagram: "https://www.instagram.com/mimalabsworld/",
  tiktok: "https://www.tiktok.com/@mimalabs.studio",
  facebook: "https://www.facebook.com/share/1NY2byfFB5/?mibextid=wwXIfr",
} as const;

export function withBasePath(path: string): string {
  if (!path) return basePath || "/";
  if (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith("//") || path.startsWith("#")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (basePath && (normalized === basePath || normalized.startsWith(`${basePath}/`))) return normalized;
  return `${basePath}${normalized}`;
}

export const siteConfig = {
  brand: {
    name: "MIMA LABS",
    tagline: "Awakening your creativity",
    location: "Zug, Switzerland",
    // SVG SWAP: once you have the vector file, place it at
    // /public/brand/mima-labs-logo.svg and change ONLY this line.
    logoSrc: "/brand/mima-labs-logo.png",
  },
  seo: {
    // GitHub Pages deployment overrides NEXT_PUBLIC_SITE_URL with the actual
    // github.io URL. When mimalabsworld.com is connected later, set this environment
    // variable to https://mimalabsworld.com and canonical/OG/sitemap URLs update
    // automatically with no code changes.
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mimalabsworld.com",
    futureDomain: "https://mimalabsworld.com",
    defaultOgImage: "/brand/mima-labs-logo.png",
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // Official owned social profiles exposed in Organization.sameAs.
    socialProfiles: [socialProfiles.instagram, socialProfiles.tiktok, socialProfiles.facebook],
  },
  paths: {
    basePath,
  },
  legal: {
    operatorName: "MIMA LABS",
    postalAddress: "Suurstoffi 13b, Rotkreuz, Zug, Switzerland",
    email: "info.mimalabs@gmail.com",
  },
  features: {
    testimonials: {
      enabled:
        process.env.NODE_ENV !== "production" ||
        process.env.NEXT_PUBLIC_TESTIMONIALS_ENABLED === "true",
    },
    roadmapTeaser: { enabled: true },
    amazonAffiliateDisclosure: { enabled: false },
    cookieConsent: {
      required: process.env.NEXT_PUBLIC_COOKIE_CONSENT_REQUIRED !== "false",
      storageKey: "mima_cookie_consent_v3",
    },
  },
  socials: socialProfiles,
  amazonSearchFallback: {
    en: "https://www.amazon.com/s?k=toddler+coloring+book",
    de: "https://www.amazon.de/s?k=malbuch+kleinkinder",
    es: "https://www.amazon.es/s?k=libro+colorear+ni%C3%B1os+peque%C3%B1os",
    fr: "https://www.amazon.fr/s?k=livre+coloriage+tout+petit",
    it: "https://www.amazon.it/s?k=libro+da+colorare+bambini+piccoli",
    ca: "https://www.amazon.es/s?k=llibre+per+acolorir+infants",
  } satisfies Record<Locale, string>,
} as const;
