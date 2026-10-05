import type { Locale } from "@/i18n/config";
import type { ProductFamilyId } from "@/types/content";
import { withBasePath } from "@/config/site";

const coverMap: Record<ProductFamilyId, Record<Locale, string>> = {
  farm: {
    en: "/covers/farm/en.png",
    de: "/covers/farm/de.png",
    es: "/covers/farm/es.png",
    fr: "/covers/farm/fr.png",
    it: "/covers/farm/it.png",
    ca: "/covers/farm/ca.png",
  },
  halloween: {
    en: "/covers/halloween/en.png",
    de: "/covers/halloween/de.png",
    es: "/covers/halloween/es.png",
    fr: "/covers/halloween/fr.png",
    it: "/covers/halloween/it.png",
    ca: "/covers/halloween/ca.png",
  },
  christmas: {
    en: "/covers/christmas/en.png",
    de: "/covers/christmas/de.png",
    es: "/covers/christmas/es.png",
    fr: "/covers/christmas/fr.png",
    it: "/covers/christmas/it.png",
    ca: "/covers/christmas/ca.png",
  },
};

export function getProductCoverPath(productId: ProductFamilyId, locale: Locale): string {
  return coverMap[productId][locale];
}

export function getProductCoverSrc(productId: ProductFamilyId, locale: Locale): string {
  return withBasePath(getProductCoverPath(productId, locale));
}
