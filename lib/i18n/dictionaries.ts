/**
 * The site's copy, per language.
 *
 * Split into bundles by area of the site (`shell`: nav, footer, search and
 * other chrome; `pages`: the home, about and contact pages; `shop`: product,
 * cart, wishlist, account and journal). Each bundle is a JSON file per
 * language whose top-level keys are sections; the bundles are merged into one
 * dictionary, so a section name must be unique across bundles.
 *
 * French is the reference: its shape is the type, so a key read in a component
 * but missing from French is a compile error. A key missing from Dutch or
 * English falls back to French rather than rendering blank.
 */

import frPages from "./dictionaries/fr/pages.json";
import frShell from "./dictionaries/fr/shell.json";
import frShop from "./dictionaries/fr/shop.json";
import { pagesClientSections } from "./client-sections/pages";
import { shellClientSections } from "./client-sections/shell";
import { shopClientSections } from "./client-sections/shop";
import { DEFAULT_LOCALE, type Locale } from "./config";

const frDictionary = { ...frShell, ...frPages, ...frShop };

export type Dictionary = typeof frDictionary;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// French is the default and is already loaded above.
const loaders: Record<
  Exclude<Locale, "fr">,
  () => Promise<DeepPartial<Dictionary>>
> = {
  nl: async () => {
    const [shell, pages, shop] = await Promise.all([
      import("./dictionaries/nl/shell.json"),
      import("./dictionaries/nl/pages.json"),
      import("./dictionaries/nl/shop.json"),
    ]);
    return { ...shell.default, ...pages.default, ...shop.default };
  },
  en: async () => {
    const [shell, pages, shop] = await Promise.all([
      import("./dictionaries/en/shell.json"),
      import("./dictionaries/en/pages.json"),
      import("./dictionaries/en/shop.json"),
    ]);
    return { ...shell.default, ...pages.default, ...shop.default };
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** French fills any gap, key by key. Arrays are taken whole. */
function withFallback<T>(source: unknown, fallback: T): T {
  if (!isPlainObject(source) || !isPlainObject(fallback)) {
    return (source === undefined ? fallback : source) as T;
  }

  const merged: Record<string, unknown> = { ...fallback };
  for (const [key, value] of Object.entries(source)) {
    merged[key] = withFallback(value, fallback[key]);
  }
  return merged as T;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "fr" || locale === DEFAULT_LOCALE) return frDictionary;

  return withFallback(await loaders[locale](), frDictionary);
}

/**
 * The sections a Client Component can ask for through `useDictionary`.
 *
 * Everything handed to the client is serialised into every page's HTML, so the
 * long page copy and the metadata strings stay on the server, where Server
 * Components read them from `getDictionary`. Each bundle declares its own
 * client sections in lib/i18n/client-sections/.
 */
const CLIENT_SECTIONS = [
  ...shellClientSections,
  ...pagesClientSections,
  ...shopClientSections,
] as const satisfies readonly (keyof Dictionary)[];

export type ClientDictionary = Pick<
  Dictionary,
  (typeof CLIENT_SECTIONS)[number]
>;

export function clientDictionary(dictionary: Dictionary): ClientDictionary {
  const picked: Record<string, unknown> = {};
  for (const section of CLIENT_SECTIONS) picked[section] = dictionary[section];
  return picked as ClientDictionary;
}

/**
 * Fills `{name}` placeholders. Deliberately not ICU; plurals are written as
 * separate keys (`itemCountOne`, `itemCountOther`) and chosen in code.
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
