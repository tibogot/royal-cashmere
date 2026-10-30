import { unstable_cache } from "next/cache";
import { getShopifyClient, isShopifyConfigured } from "./client";
import {
  getPlaceholderProductByHandle,
  getPlaceholderProducts,
} from "./placeholder-products";
import {
  ALL_PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  type ProductByHandleQueryResponse,
  type ProductRecommendationsQueryResponse,
  type ProductsQueryResponse,
  type ShopifyProduct,
  type ShopifyProductDetail,
  type ShopifyProductDetailNode,
  type ShopifyProductNode,
} from "./queries";
import { getColorCount, buildColorSwatches } from "./variants";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/i18n/format";
import { shopifyLanguage } from "./language";

const PRODUCTS_PAGE_SIZE = 100;

// Shopify catalog data changes infrequently; cache it so pages aren't fully
// dynamic (re-fetching from the Storefront API on every request). Invalidate
// on-demand with `revalidateTag(SHOPIFY_CACHE_TAG)` from a webhook/route.
const SHOPIFY_REVALIDATE = 3600;
export const SHOPIFY_CACHE_TAG = "shopify-products";

export function mapProductNode(
  node: ShopifyProductNode,
  locale: Locale,
): ShopifyProduct | null {
  if (!node.featuredImage?.url) return null;

  const { amount, currencyCode } = node.priceRange.minVariantPrice;
  const imageUrl = node.featuredImage.url;
  const imageAlt = node.featuredImage.altText ?? node.title;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl,
    imageAlt,
    price: formatMoney(locale, amount, currencyCode),
    colorCount: getColorCount(node.options),
    colorSwatches: buildColorSwatches(node.options),
    productType: node.productType,
    tags: node.tags,
  };
}

function mapProductsResponse(
  data: ProductsQueryResponse["data"],
  locale: Locale,
) {
  const edges = data?.products.edges ?? [];

  return edges
    .map(({ node }) => mapProductNode(node, locale))
    .filter((product): product is ShopifyProduct => product !== null);
}

async function fetchProductsPage(locale: Locale, after?: string | null) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(ALL_PRODUCTS_QUERY, {
    variables: {
      first: PRODUCTS_PAGE_SIZE,
      after: after ?? null,
      language: shopifyLanguage(locale),
    },
  })) as ProductsQueryResponse;

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return {
    products: mapProductsResponse(data, locale),
    pageInfo: data?.products.pageInfo ?? {
      hasNextPage: false,
      endCursor: null,
    },
  };
}

function mapProductDetailNode(
  node: ShopifyProductDetailNode,
  locale: Locale,
): ShopifyProductDetail | null {
  const variants = node.variants.edges
    .map(({ node: variant }) => ({
      id: variant.id,
      availableForSale: variant.availableForSale,
      price: formatMoney(
        locale,
        variant.price.amount,
        variant.price.currencyCode,
      ),
      imageUrl: variant.image?.url,
      imageAlt: variant.image?.altText ?? undefined,
      selectedOptions: variant.selectedOptions,
    }))
    .filter((variant) => variant.selectedOptions.length > 0);

  if (!node.featuredImage?.url || variants.length === 0) return null;

  const { amount, currencyCode } = node.priceRange.minVariantPrice;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.featuredImage.url,
    imageAlt: node.featuredImage.altText ?? node.title,
    price: formatMoney(locale, amount, currencyCode),
    colorCount: getColorCount(node.options),
    colorSwatches: buildColorSwatches(node.options),
    productType: node.productType,
    tags: node.tags,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    seoDescription: node.seo?.description?.trim() || undefined,
    details: {
      composition: node.composition?.value.trim() || undefined,
      fit: node.fit?.value.trim() || undefined,
      care: node.care?.value.trim() || undefined,
    },
    options: node.options.map((option) => ({
      name: option.name,
      values: option.values,
    })),
    variants,
  };
}

export const getProductByHandle = unstable_cache(
  async (
    handle: string,
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<ShopifyProductDetail | null> => {
  if (!isShopifyConfigured()) {
    return getPlaceholderProductByHandle(handle);
  }

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle, language: shopifyLanguage(locale) },
    })) as ProductByHandleQueryResponse;

    if (errors?.length) {
      console.error("Shopify Storefront API errors:", errors);
      return getPlaceholderProductByHandle(handle);
    }

    const node = data?.product;
    if (!node) return getPlaceholderProductByHandle(handle);

    const product = mapProductDetailNode(node, locale);
    return product ?? getPlaceholderProductByHandle(handle);
  } catch (error) {
    console.error("Failed to fetch Shopify product:", error);
    return getPlaceholderProductByHandle(handle);
  }
  },
  ["shopify-product-by-handle"],
  { revalidate: SHOPIFY_REVALIDATE, tags: [SHOPIFY_CACHE_TAG] },
);

export const getAllProducts = unstable_cache(
  async (locale: Locale = DEFAULT_LOCALE): Promise<ShopifyProduct[]> => {
  if (!isShopifyConfigured()) {
    return getPlaceholderProducts();
  }

  try {
    const products: ShopifyProduct[] = [];
    let after: string | null = null;

    do {
      const page = await fetchProductsPage(locale, after);
      products.push(...page.products);
      after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
    } while (after);

    return products.length > 0 ? products : getPlaceholderProducts();
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    return getPlaceholderProducts();
  }
  },
  ["shopify-all-products"],
  { revalidate: SHOPIFY_REVALIDATE, tags: [SHOPIFY_CACHE_TAG] },
);

export const getFeaturedProducts = unstable_cache(
  async (
    limit = 12,
    locale: Locale = DEFAULT_LOCALE,
  ): Promise<ShopifyProduct[]> => {
  if (!isShopifyConfigured()) {
    return getPlaceholderProducts(limit);
  }

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(FEATURED_PRODUCTS_QUERY, {
      variables: { first: limit, language: shopifyLanguage(locale) },
    })) as ProductsQueryResponse;

    if (errors?.length) {
      console.error("Shopify Storefront API errors:", errors);
      return getPlaceholderProducts(limit);
    }

    const products = mapProductsResponse(data, locale);

    return products.length > 0 ? products : getPlaceholderProducts(limit);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
    return getPlaceholderProducts(limit);
  }
  },
  ["shopify-featured-products"],
  { revalidate: SHOPIFY_REVALIDATE, tags: [SHOPIFY_CACHE_TAG] },
);

function getSimilarityScore(reference: ShopifyProduct, candidate: ShopifyProduct) {
  let score = 0;

  if (
    reference.productType &&
    candidate.productType &&
    reference.productType === candidate.productType
  ) {
    score += 3;
  }

  for (const tag of reference.tags) {
    if (candidate.tags.includes(tag)) {
      score += 1;
    }
  }

  return score;
}

function pickSimilarProducts(
  product: ShopifyProduct,
  catalog: ShopifyProduct[],
  limit: number,
) {
  const ranked = catalog
    .filter((item) => item.handle !== product.handle)
    .map((item) => ({ item, score: getSimilarityScore(product, item) }))
    .sort((a, b) => b.score - a.score);

  const similar = ranked
    .filter(({ score }) => score > 0)
    .map(({ item }) => item);
  const fallback = ranked
    .filter(({ score }) => score === 0)
    .map(({ item }) => item);

  return [...similar, ...fallback].slice(0, limit);
}

async function getRecommendedProducts(
  productId: string,
  limit: number,
  locale: Locale,
): Promise<ShopifyProduct[]> {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(
    PRODUCT_RECOMMENDATIONS_QUERY,
    { variables: { productId, language: shopifyLanguage(locale) } },
  )) as ProductRecommendationsQueryResponse;

  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  return (data?.productRecommendations ?? [])
    .map((node) => mapProductNode(node, locale))
    .filter((item): item is ShopifyProduct => item !== null)
    .slice(0, limit);
}

export type CartCarouselProduct = ShopifyProduct & {
  defaultVariantId: string;
  availableForSale: boolean;
};

export async function enrichProductsForQuickAdd(
  products: ShopifyProduct[],
  locale: Locale,
): Promise<CartCarouselProduct[]> {
  return Promise.all(
    products.map(async (product) => {
      const detail = await getProductByHandle(product.handle, locale);
      const variant =
        detail?.variants.find((item) => item.availableForSale) ??
        detail?.variants[0];

      return {
        ...product,
        defaultVariantId: variant?.id ?? "",
        availableForSale: variant?.availableForSale ?? false,
      };
    }),
  );
}

export async function getSimilarProductsByHandle(
  handle: string,
  locale: Locale,
  options?: { limit?: number; excludeHandles?: string[] },
): Promise<ShopifyProduct[]> {
  const limit = options?.limit ?? 4;
  const exclude = new Set(options?.excludeHandles ?? []);
  const product = await getProductByHandle(handle, locale);

  if (!product) return [];

  const similar = await getSimilarProducts(
    product,
    locale,
    limit + exclude.size,
  );

  return similar
    .filter((item) => !exclude.has(item.handle))
    .slice(0, limit);
}

export async function getSimilarProducts(
  product: ShopifyProduct,
  locale: Locale,
  limit = 4,
): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured()) {
    return pickSimilarProducts(product, getPlaceholderProducts(), limit);
  }

  try {
    const recommendations = await getRecommendedProducts(
      product.id,
      limit,
      locale,
    );
    const filteredRecommendations = recommendations.filter(
      (item) => item.handle !== product.handle,
    );

    if (filteredRecommendations.length >= limit) {
      return filteredRecommendations.slice(0, limit);
    }

    const catalog = await getAllProducts(locale);
    const fallback = pickSimilarProducts(product, catalog, limit).filter(
      (item) =>
        item.handle !== product.handle &&
        !filteredRecommendations.some(
          (recommended) => recommended.handle === item.handle,
        ),
    );

    return [...filteredRecommendations, ...fallback].slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch similar products:", error);
    const catalog = await getAllProducts(locale);
    return pickSimilarProducts(product, catalog, limit);
  }
}

export async function getProductsByHandles(
  handles: string[],
  locale: Locale,
): Promise<ShopifyProduct[]> {
  const uniqueHandles = [...new Set(handles.filter(Boolean))];
  if (uniqueHandles.length === 0) return [];

  const products = await Promise.all(
    uniqueHandles.map((handle) => getProductByHandle(handle, locale)),
  );

  return products
    .filter((product): product is ShopifyProductDetail => product !== null)
    .map(
      ({
        id,
        title,
        handle,
        imageUrl,
        imageAlt,
        price,
        colorCount,
        colorSwatches,
        productType,
        tags,
      }) => ({
        id,
        title,
        handle,
        imageUrl,
        imageAlt,
        price,
        colorCount,
        colorSwatches,
        productType,
        tags,
      }),
    );
}
