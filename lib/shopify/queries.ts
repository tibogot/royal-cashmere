export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  imageAlt: string;
  price: string;
  colorCount: number;
};

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
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
      edges: {
        node: ShopifyProductNode;
      }[];
    };
  };
  errors?: { message: string }[];
};

export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
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
        }
      }
    }
  }
`;

export type { ProductsQueryResponse, ShopifyProductNode };
