import type { Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { formatMoney } from "@/lib/i18n/format";
import { getShopifyClient, isShopifyConfigured } from "./client";
import { shopifyLanguage } from "./language";
import { isColorOption, isSizeOption } from "./variants";

export const CART_COOKIE_NAME = "shopify_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14;

export type CartLine = {
  id: string;
  quantity: number;
  title: string;
  productHandle: string;
  variantTitle: string;
  colorValue: string;
  sizeValue: string;
  imageUrl: string;
  imageAlt: string;
  price: string;
  lineTotal: string;
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
    cartLinesUpdate?: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
    cartLinesRemove?: {
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
            cost: {
              totalAmount: {
                amount: string;
                currencyCode: string;
              };
            };
            merchandise: {
              id: string;
              title: string;
              selectedOptions: {
                name: string;
                value: string;
              }[];
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
  mutation CartCreate($input: CartInput!, $language: LanguageCode) @inContext(country: BE, language: $language) {
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
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode) @inContext(country: BE, language: $language) {
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

const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode) @inContext(country: BE, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
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

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode) @inContext(country: BE, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
  query GetCart($cartId: ID!, $language: LanguageCode) @inContext(country: BE, language: $language) {
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
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                selectedOptions {
                  name
                  value
                }
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

function formatUserErrors(
  userErrors: { message: string }[] | undefined,
  fallback: string,
) {
  if (!userErrors?.length) return fallback;
  return userErrors.map((error) => error.message).join(" ");
}

function mapCartNode(
  node: NonNullable<CartQueryResponse["data"]>["cart"],
  locale: Locale,
): Cart | null {
  if (!node) return null;

  const { amount, currencyCode } = node.cost.totalAmount;

  const lines = node.lines.edges
    .map(({ node: line }) => {
      const merchandise = line.merchandise;
      if (!merchandise?.product) return null;

      const variantTitle =
        merchandise.title === "Default Title" ? "" : merchandise.title;
      const colorValue =
        merchandise.selectedOptions?.find((option) =>
          isColorOption(option.name),
        )?.value ?? "";
      const sizeValue =
        merchandise.selectedOptions?.find((option) =>
          isSizeOption(option.name),
        )?.value ?? "";
      const lineCost = line.cost.totalAmount;

      return {
        id: line.id,
        quantity: line.quantity,
        title: merchandise.product.title,
        productHandle: merchandise.product.handle,
        variantTitle,
        colorValue,
        sizeValue,
        imageUrl: merchandise.image?.url ?? "/images/placeholders/produit.png",
        imageAlt:
          merchandise.image?.altText ?? merchandise.product.title,
        price: formatMoney(locale, 
          merchandise.price.amount,
          merchandise.price.currencyCode,
        ),
        lineTotal: formatMoney(locale, lineCost.amount, lineCost.currencyCode),
        variantId: merchandise.id,
      } satisfies CartLine;
    })
    .filter((line): line is CartLine => line !== null);

  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    totalPrice: formatMoney(locale, amount, currencyCode),
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

// Each mutation's fallback copy, in the visitor's language.
type CartErrorMessages = Dictionary["cart"]["errors"];

async function getCartErrorMessages(locale: Locale): Promise<CartErrorMessages> {
  return (await getDictionary(locale)).cart.errors;
}

async function createCart(
  variantId: string,
  locale: Locale,
  messages: CartErrorMessages,
) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(CART_CREATE_MUTATION, {
    variables: {
      language: shopifyLanguage(locale),
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
    messages.create,
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

async function addLinesToCart(
  locale: Locale,
  cartId: string,
  variantId: string,
  messages: CartErrorMessages,
) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(CART_LINES_ADD_MUTATION, {
    variables: {
      language: shopifyLanguage(locale),
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
    messages.add,
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

async function updateLineQuantity(
  locale: Locale,
  cartId: string,
  lineId: string,
  quantity: number,
  messages: CartErrorMessages,
) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(CART_LINES_UPDATE_MUTATION, {
    variables: {
      language: shopifyLanguage(locale),
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  })) as CartMutationResponse;

  if (errors?.length) {
    console.error("Shopify cartLinesUpdate errors:", errors);
    return {
      ok: false as const,
      error: errors.map((error) => error.message).join(" "),
    };
  }

  const payload = data?.cartLinesUpdate;
  const userError = formatUserErrors(
    payload?.userErrors,
    messages.update,
  );

  if (!payload?.cart) {
    console.error("Shopify cartLinesUpdate userErrors:", payload?.userErrors);
    return { ok: false as const, error: userError };
  }

  return {
    ok: true as const,
    cartId: payload.cart.id,
    checkoutUrl: payload.cart.checkoutUrl,
    totalQuantity: payload.cart.totalQuantity,
  };
}

async function removeLinesFromCart(
  locale: Locale,
  cartId: string,
  lineIds: string[],
  messages: CartErrorMessages,
) {
  const client = getShopifyClient();
  const { data, errors } = (await client.request(CART_LINES_REMOVE_MUTATION, {
    variables: {
      language: shopifyLanguage(locale),
      cartId,
      lineIds,
    },
  })) as CartMutationResponse;

  if (errors?.length) {
    console.error("Shopify cartLinesRemove errors:", errors);
    return {
      ok: false as const,
      error: errors.map((error) => error.message).join(" "),
    };
  }

  const payload = data?.cartLinesRemove;
  const userError = formatUserErrors(
    payload?.userErrors,
    messages.remove,
  );

  if (!payload?.cart) {
    console.error("Shopify cartLinesRemove userErrors:", payload?.userErrors);
    return { ok: false as const, error: userError };
  }

  return {
    ok: true as const,
    cartId: payload.cart.id,
    checkoutUrl: payload.cart.checkoutUrl,
    totalQuantity: payload.cart.totalQuantity,
  };
}

export async function getCartById(
  cartId: string,
  locale: Locale,
): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null;

  try {
    const client = getShopifyClient();
    const { data, errors } = (await client.request(CART_QUERY, {
      variables: { cartId, language: shopifyLanguage(locale) },
    })) as CartQueryResponse;

    if (errors?.length) {
      console.error("Shopify getCart errors:", errors);
      return null;
    }

    return mapCartNode(data?.cart ?? null, locale);
  } catch (error) {
    console.error("Failed to fetch Shopify cart:", error);
    return null;
  }
}

export async function addVariantToCart(
  variantId: string,
  locale: Locale,
  existingCartId?: string,
) {
  const messages = await getCartErrorMessages(locale);

  if (!isShopifyConfigured()) {
    return { ok: false as const, error: messages.notConfigured };
  }

  if (isPlaceholderVariantId(variantId)) {
    return {
      ok: false as const,
      error: messages.demoProduct,
    };
  }

  if (existingCartId) {
    const addResult = await addLinesToCart(locale, existingCartId, variantId, messages);
    if (addResult.ok) return addResult;
  }

  return createCart(variantId, locale, messages);
}

export async function updateCartLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number,
  locale: Locale,
) {
  const messages = await getCartErrorMessages(locale);

  if (!isShopifyConfigured()) {
    return { ok: false as const, error: messages.notConfigured };
  }

  if (quantity < 1) {
    return removeCartLines(cartId, [lineId], locale);
  }

  return updateLineQuantity(locale, cartId, lineId, quantity, messages);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
  locale: Locale,
) {
  const messages = await getCartErrorMessages(locale);

  if (!isShopifyConfigured()) {
    return { ok: false as const, error: messages.notConfigured };
  }

  return removeLinesFromCart(locale, cartId, lineIds, messages);
}
