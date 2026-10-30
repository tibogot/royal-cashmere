export type ProductColorSwatch = {
  value: string;
  color: string;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  imageAlt: string;
  price: string;
  colorCount: number;
  colorSwatches: ProductColorSwatch[];
  productType: string;
  tags: string[];
};

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  options: ShopifyProductOptionNode[];
};

export type ShopifyProductOptionNode = {
  name: string;
  values: string[];
  optionValues: {
    name: string;
    swatch: {
      color: string | null;
    } | null;
  }[];
};

type ProductsQueryResponse = {
  data?: {
    products: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      edges: {
        node: ShopifyProductNode;
      }[];
    };
  };
  errors?: { message: string }[];
};

const PRODUCT_FIELDS = `
  id
  title
  handle
  productType
  tags
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  featuredImage {
    url
    altText
  }
  options {
    name
    values
    optionValues {
      name
      swatch {
        color
      }
    }
  }
`;

export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int!, $language: LanguageCode) @inContext(country: BE, language: $language) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

export const ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int!, $after: String, $language: LanguageCode) @inContext(country: BE, language: $language) {
    products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
`;

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  availableForSale: boolean;
  price: string;
  imageUrl?: string;
  imageAlt?: string;
  selectedOptions: { name: string; value: string }[];
};

// Plain-text product metafields (namespace "custom", type multi_line_text_field).
// Each needs "Storefront API access" enabled on its definition in Shopify admin.
export type ProductDetailFields = {
  composition?: string;
  fit?: string;
  care?: string;
};

export type ShopifyProductDetail = ShopifyProduct & {
  description: string;
  descriptionHtml: string;
  // The search-result description set in Shopify, when there is one.
  seoDescription?: string;
  details?: ProductDetailFields;
  options: ProductOption[];
  variants: ProductVariant[];
};

type ShopifyMetafieldNode = { value: string } | null;

type ShopifyProductDetailNode = Omit<ShopifyProductNode, "options"> & {
  options: ShopifyProductOptionNode[];
  description: string;
  descriptionHtml: string;
  seo: { description: string | null } | null;
  composition: ShopifyMetafieldNode;
  fit: ShopifyMetafieldNode;
  care: ShopifyMetafieldNode;
  variants: {
    edges: {
      node: {
        id: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: {
          name: string;
          value: string;
        }[];
        image: {
          url: string;
          altText: string | null;
        } | null;
      };
    }[];
  };
};

type ProductByHandleQueryResponse = {
  data?: {
    product: ShopifyProductDetailNode | null;
  };
  errors?: { message: string }[];
};

export const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!, $language: LanguageCode) @inContext(country: BE, language: $language) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
      description
      descriptionHtml
      seo {
        description
      }
      composition: metafield(namespace: "custom", key: "composition") {
        value
      }
      fit: metafield(namespace: "custom", key: "fit") {
        value
      }
      care: metafield(namespace: "custom", key: "care") {
        value
      }
      variants(first: 100) {
        edges {
          node {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

type ProductRecommendationsQueryResponse = {
  data?: {
    productRecommendations: ShopifyProductNode[] | null;
  };
  errors?: { message: string }[];
};

export const PRODUCT_RECOMMENDATIONS_QUERY = `
  query ProductRecommendations($productId: ID!, $language: LanguageCode) @inContext(country: BE, language: $language) {
    productRecommendations(productId: $productId) {
      ${PRODUCT_FIELDS}
    }
  }
`;

export type { ProductRecommendationsQueryResponse };

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  imageUrl?: string;
  imageAlt?: string;
  hasProducts?: boolean;
};

type ShopifyCollectionListNode = {
  id: string;
  title: string;
  handle: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    edges: {
      node: {
        featuredImage: {
          url: string;
          altText: string | null;
        } | null;
      };
    }[];
  };
};

type ShopifyCollectionNode = {
  id: string;
  title: string;
  handle: string;
};

type CollectionsQueryResponse = {
  data?: {
    collections: {
      edges: {
        node: ShopifyCollectionListNode;
      }[];
    };
  };
  errors?: { message: string }[];
};

export const COLLECTIONS_QUERY = `
  query Collections($first: Int!, $language: LanguageCode) @inContext(country: BE, language: $language) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
          products(first: 1) {
            edges {
              node {
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

type CollectionByHandleQueryResponse = {
  data?: {
    collection: (ShopifyCollectionNode & {
      products: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        edges: {
          node: ShopifyProductNode;
        }[];
      };
    }) | null;
  };
  errors?: { message: string }[];
};

export const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!, $first: Int!, $after: String, $language: LanguageCode) @inContext(country: BE, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  }
`;

export type {
  CollectionByHandleQueryResponse,
  CollectionsQueryResponse,
  ProductByHandleQueryResponse,
  ProductsQueryResponse,
  ShopifyCollectionListNode,
  ShopifyCollectionNode,
  ShopifyProductDetailNode,
  ShopifyProductNode,
};
