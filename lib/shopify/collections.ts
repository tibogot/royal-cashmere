import { unstable_cache } from "next/cache";
import {
  buildCatalogNav,
  findCatalogCollection,
  isCatalogHandle,
  type CatalogMatch,
  type CatalogNavSection,
} from "@/lib/catalog";
import {
  ALL_PRODUCTS_HANDLE,
  legacyCollectionRedirects,
} from "@/lib/collection-handles";
import { getShopifyClient, isShopifyConfigured } from "./client";
import { getAllProducts, SHOPIFY_CACHE_TAG } from "./products";
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
import { buildColorSwatches, getColorCount } from "./variants";

const COLLECTIONS_PAGE_SIZE = 50;
const COLLECTION_PRODUCTS_PAGE_SIZE = 100;
const SHOPIFY_REVALIDATE = 3600;

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function mapProductNode(node: ShopifyProductNode): ShopifyProduct | null {
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
    price: formatPrice(amount, currencyCode),
    colorCount: getColorCount(node.options),
    colorSwatches: buildColorSwatches(node.options),
    productType: node.productType,
    tags: node.tags,
  };
}

function mapCollectionNode(node: ShopifyCollectionListNode): ShopifyCollection {
  const productImage = node.products.edges[0]?.node.featuredImage;
  const image = node.image ?? productImage;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: image?.url,
    imageAlt: image?.altText ?? node.title,
  };
}

export const getCollections = unstable_cache(
  async (): Promise<ShopifyCollection[]> => {
  if (!isShopifyConfigured()) return [];

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(COLLECTIONS_QUERY, {
      variables: { first: COLLECTIONS_PAGE_SIZE },
    })) as CollectionsQueryResponse;

    if (errors?.length) {
      console.error("Shopify Storefront API errors:", errors);
      return [];
    }

    return (
      data?.collections.edges
        .map(({ node }) => mapCollectionNode(node))
        .filter((collection) => collection.handle !== "frontpage") ?? []
    );
  } catch (error) {
    console.error("Failed to fetch Shopify collections:", error);
    return [];
  }
  },
  ["shopify-collections"],
  { revalidate: SHOPIFY_REVALIDATE, tags: [SHOPIFY_CACHE_TAG] },
);

export type ShopifyCollectionWithProducts = ShopifyCollection & {
  products: ShopifyProduct[];
};

export const getCollectionByHandle = unstable_cache(
  async (
    handle: string,
  ): Promise<ShopifyCollectionWithProducts | null> => {
  if (!isShopifyConfigured()) return null;

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
  },
  ["shopify-collection-by-handle"],
  { revalidate: SHOPIFY_REVALIDATE, tags: [SHOPIFY_CACHE_TAG] },
);

// The category menus: catalog sections and sub-collections that have products.
export async function getCatalogNav(): Promise<CatalogNavSection[]> {
  return buildCatalogNav(await getAllProducts());
}

// Every collection page worth listing: catalog categories that have products,
// then Shopify's own collections (Soldes, Nouveautés…) minus old category
// collections the catalog replaced. The shop itself (ALL_PRODUCTS_HANDLE) is
// left to the caller.
export async function getListedCollectionHandles(): Promise<string[]> {
  const [sections, shopifyCollections] = await Promise.all([
    getCatalogNav(),
    getCollections(),
  ]);

  return [
    ...sections.flatMap((section) => [
      section.handle,
      ...section.children.map((child) => child.handle),
    ]),
    ...shopifyCollections
      .map((collection) => collection.handle)
      .filter(
        (handle) =>
          !isCatalogHandle(handle) && !(handle in legacyCollectionRedirects),
      ),
  ];
}

export type CollectionPageData = ShopifyCollectionWithProducts & {
  description?: string;
  intro?: string;
  // Set for the category tree's pages (lib/catalog).
  catalog?: CatalogMatch;
};

// What a /collection/[handle] page shows: the all-products view for
// ALL_PRODUCTS_HANDLE, a catalog collection built from every product, or
// else the Shopify collection with that handle (Soldes, Nouveautés…).
export async function getCollectionPageData(
  handle: string,
): Promise<CollectionPageData | null> {
  if (handle === ALL_PRODUCTS_HANDLE) {
    return {
      id: ALL_PRODUCTS_HANDLE,
      handle: ALL_PRODUCTS_HANDLE,
      title: "Boutique",
      products: await getAllProducts(),
    };
  }

  const catalog = findCatalogCollection(handle);
  if (!catalog) return getCollectionByHandle(handle);

  const collection = catalog.collection ?? catalog.section;
  const products = (await getAllProducts()).filter((product) =>
    collection.matches(product),
  );

  // An empty category is no page to index; it's also missing from the menus.
  if (products.length === 0) return null;

  return {
    id: handle,
    handle,
    title: collection.title,
    description: collection.description,
    intro: collection.intro,
    catalog,
    products,
  };
}
