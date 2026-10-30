/**
 * Which languages the site speaks. Imports nothing, because the proxy (which
 * runs before the app) and client components both need it.
 *
 * The URL uses the short tag (`/fr`); `Intl`, hreflang and Open Graph want the
 * regional one, so `fr` formats prices the Belgian way.
 */

/** Order is the switcher's order; the first entry is the default. */
export const LOCALES = ["fr", "nl", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/**
 * The languages that are actually translated. The others still route (so the
 * work can be previewed at /en and /nl), but they are noindex, canonicalise to
 * French, stay out of the sitemap and hreflang, and the switcher hides them.
 * Add a locale here the day its copy is written — this is the one switch.
 */
export const LIVE_LOCALES: readonly Locale[] = ["fr", "nl", "en"];

/** The tag `Intl` and `hreflang` want. */
export const INTL_LOCALE: Record<Locale, string> = {
  fr: "fr-BE",
  nl: "nl-BE",
  en: "en-BE",
};

/** Open Graph spells the same thing with an underscore. */
export const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_BE",
  nl: "nl_BE",
  en: "en_BE",
};

/** What each language calls itself. */
export const LOCALE_NAME: Record<Locale, string> = {
  fr: "Français",
  nl: "Nederlands",
  en: "English",
};

/**
 * Remembers a visitor's choice so the bare domain can send them back to it.
 * Only ever read for `/` — see proxy.ts for why it must not affect anything a
 * crawler can reach.
 */
export const LOCALE_COOKIE = "royal-cashmere-locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

export function isLiveLocale(locale: Locale) {
  return LIVE_LOCALES.includes(locale);
}

/**
 * A `lang` route param as a locale. Falls back rather than throwing because
 * `generateMetadata` runs for URLs the proxy never vetted; the layout is where
 * an unknown language becomes a 404.
 */
export function toLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** `/fr/cart` -> "fr". `/cart` -> null. `/french` -> null. */
export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

/** The route without its language, always starting with a slash. */
export function stripLocale(pathname: string) {
  const current = localeFromPath(pathname);
  if (!current) return pathname || "/";

  const rest = pathname.slice(`/${current}`.length);
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/**
 * The same page in another language. A path that already names a locale has it
 * replaced rather than prefixed, so the switcher never builds `/nl/fr/cart`.
 * Query strings and hashes are carried through.
 */
export function withLocale(path: string, locale: Locale) {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] ?? path;
  const suffix = match?.[2] ?? "";
  const bare = stripLocale(pathname);

  return `${bare === "/" ? `/${locale}` : `/${locale}${bare}`}${suffix}`;
}
