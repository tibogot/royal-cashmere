import type { ShopifyProduct } from "@/lib/shopify/queries";

export type BoutiqueFilter = {
  id: string;
  label: string;
  keywords: string[];
};

export const boutiqueFilters: BoutiqueFilter[] = [
  { id: "all", label: "Tout", keywords: [] },
  { id: "robes", label: "Robes", keywords: ["robe"] },
  { id: "pantalons", label: "Pantalons", keywords: ["pantalon"] },
  { id: "echarpes", label: "Écharpes", keywords: ["écharpe", "echarpe", "scarf"] },
  { id: "pulls", label: "Pulls", keywords: ["pull", "sweater", "cardigan"] },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productMatchesFilter(product: ShopifyProduct, filter: BoutiqueFilter) {
  if (filter.id === "all") return true;

  const haystack = [
    product.title,
    product.productType,
    ...product.tags,
  ]
    .map(normalize)
    .join(" ");

  return filter.keywords.some((keyword) => haystack.includes(normalize(keyword)));
}

export function filterProducts(
  products: ShopifyProduct[],
  filterId: string,
): ShopifyProduct[] {
  const filter =
    boutiqueFilters.find((item) => item.id === filterId) ?? boutiqueFilters[0];

  return products.filter((product) => productMatchesFilter(product, filter));
}

function fieldMatchesQuery(value: string, query: string) {
  return normalize(value).includes(query);
}

function tagMatchesQuery(tag: string, query: string) {
  const normalizedTag = normalize(tag);
  return (
    normalizedTag === query ||
    normalizedTag.startsWith(query)
  );
}

export function searchProducts(products: ShopifyProduct[], query: string) {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return products;

  return products.filter((product) => {
    if (fieldMatchesQuery(product.title, normalizedQuery)) return true;
    if (fieldMatchesQuery(product.handle, normalizedQuery)) return true;
    if (
      product.productType &&
      fieldMatchesQuery(product.productType, normalizedQuery)
    ) {
      return true;
    }

    return product.tags.some((tag) => tagMatchesQuery(tag, normalizedQuery));
  });
}
