// Every product listing is a collection page (/collection/[handle]). The
// category tree (Femme, Homme, Accessoires…) is defined in lib/catalog.

// Not a Shopify collection: the page builds it from every product, so the
// shop's "all products" view needs nothing set up in Shopify.
export const ALL_PRODUCTS_HANDLE = "tout";

// Merchandising collections, created in Shopify admin with these handles.
// They're linked from the homepage but kept out of the category lists.
export const SALE_COLLECTION_HANDLE = "soldes";
export const BESTSELLERS_COLLECTION_HANDLE = "bestsellers";
export const NEW_IN_COLLECTION_HANDLE = "nouveautes";

// Category handles from before the femme/homme split, mapped to their
// replacement. Redirected in next.config.ts, and kept out of the sitemap in
// case the old Shopify collections still exist.
export const legacyCollectionRedirects: Record<string, string> = {
  pulls: "pulls-femme",
  robes: "robes-cachemire",
  pantalons: "pantalons-femme",
  echarpes: "echarpes-cachemire",
  "hauts-tops": "pulls-femme",
  bas: "femme",
};
