import { getShopifyClient, isShopifyConfigured } from "./client";
import {
  getPlaceholderProductByHandle,
  getPlaceholderProducts,
} from "./placeholder-products";
import {
  ALL_PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  type ProductByHandleQueryResponse,
  type ProductsQueryResponse,
  type ShopifyProduct,
  type ShopifyProductDetail,
  type ShopifyProductDetailNode,
  type ShopifyProductNode,
} from "./queries";

const COLOR_OPTION_NAMES = ["color", "couleur", "colour"];
const PRODUCTS_PAGE_SIZE = 100;

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

function mapProductNode(node: ShopifyProductNode): ShopifyProduct | null {
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
    productType: node.productType,
    tags: node.tags,
  };
}

function mapProductsResponse(data: ProductsQueryResponse["data"]) {
  const edges = data?.products.edges ?? [];

  return edges
    .map(({ node }) => mapProductNode(node))
    .filter((product): product is ShopifyProduct => product !== null);
}

async function fetchProductsPage(after?: string | null) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(ALL_PRODUCTS_QUERY, {
    variables: {
      first: PRODUCTS_PAGE_SIZE,
      after: after ?? null,
    },
  })) as ProductsQueryResponse;

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    products: mapProductsResponse(data),
    pageInfo: data?.products.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

function mapProductDetailNode(
  node: ShopifyProductDetailNode,
): ShopifyProductDetail | null {
  const variant = node.variants.edges[0]?.node;
  if (!node.featuredImage?.url || !variant) return null;

  const { amount, currencyCode } = variant.price;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.featuredImage.url,
    imageAlt: node.featuredImage.altText ?? node.title,
    price: formatPrice(amount, currencyCode),
    colorCount: getColorCount(node.options),
    productType: node.productType,
    tags: node.tags,
    description: node.description,
    variantId: variant.id,
    availableForSale: node.availableForSale && variant.availableForSale,
  };
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProductDetail | null> {
  if (!isShopifyConfigured()) {
    return getPlaceholderProductByHandle(handle);
  }

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    })) as ProductByHandleQueryResponse;

    if (errors?.length) {
      console.error("Shopify Storefront API errors:", errors);
      return getPlaceholderProductByHandle(handle);
    }

    const node = data?.product;
    if (!node) return getPlaceholderProductByHandle(handle);

    const product = mapProductDetailNode(node);
    return product ?? getPlaceholderProductByHandle(handle);
  } catch (error) {
    console.error("Failed to fetch Shopify product:", error);
    return getPlaceholderProductByHandle(handle);
  }
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured()) {
    return getPlaceholderProducts();
  }

  try {
    const products: ShopifyProduct[] = [];
    let after: string | null = null;

    do {
      const page = await fetchProductsPage(after);
      products.push(...page.products);
      after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
    } while (after);

    return products.length > 0 ? products : getPlaceholderProducts();
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    return getPlaceholderProducts();
  }
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

    const products = mapProductsResponse(data);

    return products.length > 0 ? products : getPlaceholderProducts(limit);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    return getPlaceholderProducts(limit);
  }
}
