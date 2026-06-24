import { getShopifyClient, isShopifyConfigured } from "./client";
import { getPlaceholderProducts } from "./placeholder-products";
import {
  FEATURED_PRODUCTS_QUERY,
  type ProductsQueryResponse,
  type ShopifyProduct,
  type ShopifyProductNode,
} from "./queries";

const COLOR_OPTION_NAMES = ["color", "couleur", "colour"];

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function getColorCount(
  options: { name: string; values: string[] }[],
): number {
  const colorOption = options.find((option) =>
    COLOR_OPTION_NAMES.includes(option.name.toLowerCase()),
  );

  return colorOption?.values.length ?? 0;
}

function formatColorCount(count: number) {
  if (count <= 0) return null;
  return count === 1 ? "1 couleur" : `${count} couleurs`;
}

export function getProductColorLabel(
  options: { name: string; values: string[] }[],
) {
  return formatColorCount(getColorCount(options));
}

export async function getFeaturedProducts(
  limit = 12,
): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured()) {
    return getPlaceholderProducts(limit);
  }

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(FEATURED_PRODUCTS_QUERY, {
      variables: { first: limit },
    })) as ProductsQueryResponse;

    if (errors?.length) {
      console.error("Shopify Storefront API errors:", errors);
      return getPlaceholderProducts(limit);
    }

    const edges = data?.products.edges ?? [];

    const products = edges
      .map(({ node }: { node: ShopifyProductNode }) => {
        if (!node.featuredImage?.url) return null;

        const { amount, currencyCode } = node.priceRange.minVariantPrice;

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          imageUrl: node.featuredImage.url,
          imageAlt: node.featuredImage.altText ?? node.title,
          price: formatPrice(amount, currencyCode),
          colorCount: getColorCount(node.options),
        } satisfies ShopifyProduct;
      })
      .filter((product): product is ShopifyProduct => product !== null);

    return products.length > 0 ? products : getPlaceholderProducts(limit);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    return getPlaceholderProducts(limit);
  }
}
