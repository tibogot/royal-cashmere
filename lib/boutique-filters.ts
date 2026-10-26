import type { ShopifyProduct } from "@/lib/shopify/queries";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
