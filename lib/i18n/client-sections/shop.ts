/**
 * Sections of the `shop` bundle that Client Components read through
 * `useDictionary`. Only these ship to the browser — see lib/i18n/dictionaries.ts.
 */
export const shopClientSections = [
  "product",
  "cart",
  "wishlist",
  "journal",
  "shopHeadings",
] as const;
