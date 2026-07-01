import { collectionHandles, getCollectionLabel, getCollectionNavCardImage } from "@/lib/categories";
import { getShopifyClient, isShopifyConfigured } from "./client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  type CollectionByHandleQueryResponse,
  type CollectionsQueryResponse,
  type ShopifyCollection,
  type ShopifyCollectionListNode,
  type ShopifyProduct,
  type ShopifyProductNode,
} from "./queries";
import { getColorCount } from "./variants";

const COLLECTIONS_PAGE_SIZE = 50;
const COLLECTION_PRODUCTS_PAGE_SIZE = 100;

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
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

function mapCollectionNode(
  node: ShopifyCollectionListNode,
  index: number,
): ShopifyCollection {
  const productImage = node.products.edges[0]?.node.featuredImage;
  const fallback = getCollectionNavCardImage(node.handle, index);

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.image?.url ?? productImage?.url ?? fallback.imageUrl,
    imageAlt:
      node.image?.altText ??
      productImage?.altText ??
      fallback.imageAlt ??
      node.title,
  };
}

function getPlaceholderCollections(): ShopifyCollection[] {
  return collectionHandles.map((handle, index) => {
    const fallback = getCollectionNavCardImage(handle, index);

    return {
      id: handle,
      handle,
      title: getCollectionLabel(handle) ?? handle,
      imageUrl: fallback.imageUrl,
      imageAlt: fallback.imageAlt,
    };
  });
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  if (!isShopifyConfigured()) {
    return getPlaceholderCollections();
  }

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(COLLECTIONS_QUERY, {
      variables: { first: COLLECTIONS_PAGE_SIZE },
    })) as CollectionsQueryResponse;

    if (errors?.length) {
      console.error("Shopify Storefront API errors:", errors);
      return getPlaceholderCollections();
    }

    const collections =
      data?.collections.edges
        .map(({ node }, index) => mapCollectionNode(node, index))
        .filter((collection) => collection.handle !== "frontpage") ?? [];

    return collections.length > 0
      ? collections
      : getPlaceholderCollections();
  } catch (error) {
    console.error("Failed to fetch Shopify collections:", error);
    return getPlaceholderCollections();
  }
}

export type ShopifyCollectionWithProducts = ShopifyCollection & {
  products: ShopifyProduct[];
};

export async function getCollectionByHandle(
  handle: string,
): Promise<ShopifyCollectionWithProducts | null> {
  if (!isShopifyConfigured()) {
    const title = getCollectionLabel(handle);
    if (!title) return null;

    const { getAllProducts } = await import("./products");
    const { filterProducts } = await import("@/lib/boutique-filters");
    const products = filterProducts(await getAllProducts(), handle);

    return {
      id: handle,
      handle,
      title,
      products,
    };
  }

  try {
    const client = getShopifyClient();
    const products: ShopifyProduct[] = [];
    let after: string | null = null;
    let collectionMeta: ShopifyCollection | null = null;

    do {
      const { data, errors } = (await client.request(
        COLLECTION_BY_HANDLE_QUERY,
        {
          variables: {
            handle,
            first: COLLECTION_PRODUCTS_PAGE_SIZE,
            after,
          },
        },
      )) as CollectionByHandleQueryResponse;

      if (errors?.length) {
        console.error("Shopify Storefront API errors:", errors);
        return null;
      }

      const collection = data?.collection;
      if (!collection) return null;

      if (!collectionMeta) {
        collectionMeta = {
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
        };
      }

      products.push(
        ...collection.products.edges
          .map(({ node }) => mapProductNode(node))
          .filter((product): product is ShopifyProduct => product !== null),
      );

      after = collection.products.pageInfo.hasNextPage
        ? collection.products.pageInfo.endCursor
        : null;
    } while (after);

    if (!collectionMeta) return null;

    return {
      ...collectionMeta,
      products,
    };
  } catch (error) {
    console.error("Failed to fetch Shopify collection:", error);
    return null;
  }
}
