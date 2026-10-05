import type { Locale } from "@/i18n/config";

const dictionaries = {
  en: () => import("@/messages/en.json").then((module) => module.default),
  de: () => import("@/messages/de.json").then((module) => module.default),
  es: () => import("@/messages/es.json").then((module) => module.default),
  fr: () => import("@/messages/fr.json").then((module) => module.default),
  it: () => import("@/messages/it.json").then((module) => module.default),
  ca: () => import("@/messages/ca.json").then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
