import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "./config";

/**
 * Records the language a visitor picked, so the bare domain can send them back
 * to it next time. Read by proxy.ts, and only for "/".
 */
export function rememberLocale(locale: Locale) {
  if (typeof document === "undefined") return;

  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}
