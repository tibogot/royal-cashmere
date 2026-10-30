/**
 * Sections of the `shell` bundle that Client Components read through
 * `useDictionary`. Only these ship to the browser — see lib/i18n/dictionaries.ts.
 *
 * `footer`, `collection` (the category pages' SEO copy), `site` and
 * `shellLegalMeta` stay on the server.
 */
export const shellClientSections = [
  "common",
  "nav",
  "search",
  "cookieBanner",
  "breadcrumbs",
  "languageSwitcher",
  "catalog",
] as const;
