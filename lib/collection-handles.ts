// Every product listing is a collection page (/collection/[handle]).

// Not a Shopify collection: the page builds it from every product, so the
// shop's "all products" view needs nothing set up in Shopify.
export const ALL_PRODUCTS_HANDLE = "tout";

// Merchandising collections, created in Shopify admin with these handles.
// They're linked from the homepage but kept out of the category lists.
export const SALE_COLLECTION_HANDLE = "soldes";
export const BESTSELLERS_COLLECTION_HANDLE = "bestsellers";
export const NEW_IN_COLLECTION_HANDLE = "nouveautes";

const featuredCollectionHandles = new Set<string>([
  SALE_COLLECTION_HANDLE,
  BESTSELLERS_COLLECTION_HANDLE,
  NEW_IN_COLLECTION_HANDLE,
]);

export function isCategoryHandle(handle: string) {
  return !featuredCollectionHandles.has(handle);
}
