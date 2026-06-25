import { getShopifyClient, isShopifyConfigured } from "./client";

export const CART_COOKIE_NAME = "shopify_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14;

export type CartLine = {
  id: string;
  quantity: number;
  title: string;
  productHandle: string;
  variantTitle: string;
  imageUrl: string;
  imageAlt: string;
  price: string;
  variantId: string;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  totalPrice: string;
  lines: CartLine[];
};

type CartMutationResponse = {
  data?: {
    cartCreate?: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
    cartLinesAdd?: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  };
  errors?: { message: string }[];
};

type CartQueryResponse = {
  data?: {
    cart: {
      id: string;
      checkoutUrl: string;
      totalQuantity: number;
      cost: {
        totalAmount: {
          amount: string;
          currencyCode: string;
        };
      };
      lines: {
        edges: {
          node: {
            id: string;
            quantity: number;
            merchandise: {
              id: string;
              title: string;
              image: {
                url: string;
                altText: string | null;
              } | null;
              price: {
                amount: string;
                currencyCode: string;
              };
              product: {
                title: string;
                handle: string;
              };
            };
          };
        }[];
      };
    } | null;
  };
  errors?: { message: string }[];
};

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                image {
                  url
                  altText
                }
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
`;

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function formatUserErrors(
  userErrors: { message: string }[] | undefined,
  fallback: string,
) {
  if (!userErrors?.length) return fallback;
  return userErrors.map((error) => error.message).join(" ");
}

function mapCartNode(
  node: NonNullable<CartQueryResponse["data"]>["cart"],
): Cart | null {
  if (!node) return null;

  const { amount, currencyCode } = node.cost.totalAmount;

  const lines = node.lines.edges
    .map(({ node: line }) => {
      const merchandise = line.merchandise;
      if (!merchandise?.product) return null;

      const variantTitle =
        merchandise.title === "Default Title" ? "" : merchandise.title;

      return {
        id: line.id,
        quantity: line.quantity,
        title: merchandise.product.title,
        productHandle: merchandise.product.handle,
        variantTitle,
        imageUrl: merchandise.image?.url ?? "/images/unsplash_mjtLS0CDuIQ.png",
        imageAlt:
          merchandise.image?.altText ?? merchandise.product.title,
        price: formatPrice(
          merchandise.price.amount,
          merchandise.price.currencyCode,
        ),
        variantId: merchandise.id,
      } satisfies CartLine;
    })
    .filter((line): line is CartLine => line !== null);

  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    totalPrice: formatPrice(amount, currencyCode),
    lines,
  };
}

export function getCartCookieOptions() {
  return {
    name: CART_COOKIE_NAME,
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export function isPlaceholderVariantId(variantId: string) {
  return variantId.startsWith("placeholder-");
}

async function createCart(variantId: string) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(CART_CREATE_MUTATION, {
    variables: {
      input: {
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      },
    },
  })) as CartMutationResponse;

  if (errors?.length) {
    console.error("Shopify cartCreate errors:", errors);
    return {
      ok: false as const,
      error: errors.map((error) => error.message).join(" "),
    };
  }

  const payload = data?.cartCreate;
  const userError = formatUserErrors(
    payload?.userErrors,
    "Impossible de créer le panier. Vérifiez que votre token Storefront dispose des droits « write_checkouts ».",
  );

  if (!payload?.cart) {
    console.error("Shopify cartCreate userErrors:", payload?.userErrors);
    return { ok: false as const, error: userError };
  }

  return {
    ok: true as const,
    cartId: payload.cart.id,
    checkoutUrl: payload.cart.checkoutUrl,
    totalQuantity: payload.cart.totalQuantity,
  };
}

async function addLinesToCart(cartId: string, variantId: string) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(CART_LINES_ADD_MUTATION, {
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    },
  })) as CartMutationResponse;

  if (errors?.length) {
    console.error("Shopify cartLinesAdd errors:", errors);
    return {
      ok: false as const,
      error: errors.map((error) => error.message).join(" "),
    };
  }

  const payload = data?.cartLinesAdd;
  const userError = formatUserErrors(
    payload?.userErrors,
    "Impossible d'ajouter au panier.",
  );

  if (!payload?.cart) {
    console.error("Shopify cartLinesAdd userErrors:", payload?.userErrors);
    return { ok: false as const, error: userError };
  }

  return {
    ok: true as const,
    cartId: payload.cart.id,
    checkoutUrl: payload.cart.checkoutUrl,
    totalQuantity: payload.cart.totalQuantity,
  };
}

export async function getCartById(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(CART_QUERY, {
      variables: { cartId },
    })) as CartQueryResponse;

    if (errors?.length) {
      console.error("Shopify getCart errors:", errors);
      return null;
    }

    return mapCartNode(data?.cart ?? null);
  } catch (error) {
    console.error("Failed to fetch Shopify cart:", error);
    return null;
  }
}

export async function addVariantToCart(
  variantId: string,
  existingCartId?: string,
) {
  if (!isShopifyConfigured()) {
    return { ok: false as const, error: "Boutique non configurée." };
  }

  if (isPlaceholderVariantId(variantId)) {
    return {
      ok: false as const,
      error: "Ce produit de démonstration ne peut pas être ajouté au panier.",
    };
  }

  if (existingCartId) {
    const addResult = await addLinesToCart(existingCartId, variantId);
    if (addResult.ok) return addResult;
  }

  return createCart(variantId);
}
