import { toLocale, type Locale } from "./config";

/**
 * The language of the page, for client modules that live outside React — the
 * shared stores that fetch products and the cart. The root layout writes it to
 * `<html lang>`, which updates when the visitor switches language.
 *
 * Stores pass it to the API as `?locale=` and fold it into their cache keys, so
 * a French cart or product list is never shown on the Dutch site.
 */
export function documentLocale(): Locale {
  return toLocale(
    typeof document === "undefined" ? undefined : document.documentElement.lang,
  );
}
