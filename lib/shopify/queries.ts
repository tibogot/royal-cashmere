export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  imageAlt: string;
  price: string;
  colorCount: number;
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
  options: {
    name: string;
    values: string[];
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
  }
`;

export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int!) {
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
  query AllProducts($first: Int!, $after: String) {
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

export type ShopifyProductDetail = ShopifyProduct & {
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  variants: ProductVariant[];
};

type ShopifyProductDetailNode = ShopifyProductNode & {
  description: string;
  descriptionHtml: string;
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
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
      description
      descriptionHtml
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

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  imageUrl?: string;
  imageAlt?: string;
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
  query Collections($first: Int!) {
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
  query CollectionByHandle($handle: String!, $first: Int!, $after: String) {
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
