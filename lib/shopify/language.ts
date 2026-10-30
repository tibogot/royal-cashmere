import type { Locale } from "@/lib/i18n/config";

/**
 * The Storefront API's `LanguageCode` for a site locale. Every query and cart
 * mutation runs `@inContext(country: BE, language: $language)`, so product
 * titles, descriptions and metafields come back as translated in Translate &
 * Adapt, and checkout opens in the customer's language.
 *
 * The language travels as a query variable, which makes it part of every
 * cache key built from the request — a French response is never served on
 * an English page.
 */
export function shopifyLanguage(locale: Locale) {
  return locale.toUpperCase() as Uppercase<Locale>;
}

