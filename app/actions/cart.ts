"use server";

import {
  addVariantToCart,
  getCartById,
  getCartCookieOptions,
  removeCartLines,
  updateCartLineQuantity,
} from "@/lib/shopify/cart";
import { isShopifyConfigured } from "@/lib/shopify/client";
import { toLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getCartIdFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(getCartCookieOptions().name)?.value;
}

async function setCartCookie(cartId: string) {
  const cookieStore = await cookies();
  const cartCookie = getCartCookieOptions();

  cookieStore.set(cartCookie.name, cartId, {
    maxAge: cartCookie.maxAge,
    httpOnly: cartCookie.httpOnly,
    sameSite: cartCookie.sameSite,
    secure: cartCookie.secure,
    path: cartCookie.path,
  });
}

// The language comes from the client, so it is re-validated rather than
// trusted; error messages are returned in it.
async function cartErrors(locale: Locale) {
  return (await getDictionary(toLocale(locale))).cart.errors;
}

async function clearCartCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(getCartCookieOptions().name);
}

export async function getCart(locale: Locale) {
  if (!isShopifyConfigured()) return null;

  const cartId = await getCartIdFromCookies();
  if (!cartId) return null;

  const cart = await getCartById(cartId, toLocale(locale));
  if (!cart) {
    await clearCartCookie();
    return null;
  }

  return cart;
}

export async function getCartCount(locale: Locale) {
  const cart = await getCart(locale);
  return cart?.totalQuantity ?? 0;
}

export async function addToCart(variantId: string, locale: Locale) {
  if (!isShopifyConfigured()) {
    return {
      ok: false as const,
      error: (await cartErrors(locale)).notConfigured,
    };
  }

  const existingCartId = await getCartIdFromCookies();
  const result = await addVariantToCart(variantId, locale, existingCartId);

  if (!result.ok) {
    if (existingCartId) {
      await clearCartCookie();
      const retryResult = await addVariantToCart(variantId, locale);

      if (!retryResult.ok) {
        return retryResult;
      }

      await setCartCookie(retryResult.cartId);
      revalidatePath("/[lang]/cart", "page");

      return {
        ok: true as const,
        totalQuantity: retryResult.totalQuantity,
      };
    }

    return result;
  }

  await setCartCookie(result.cartId);
  revalidatePath("/[lang]/cart", "page");

  return {
    ok: true as const,
    totalQuantity: result.totalQuantity,
  };
}

export async function updateCartLine(
  lineId: string,
  quantity: number,
  locale: Locale,
) {
  if (!isShopifyConfigured()) {
    return {
      ok: false as const,
      error: (await cartErrors(locale)).notConfigured,
    };
  }

  const cartId = await getCartIdFromCookies();
  if (!cartId) {
    return { ok: false as const, error: (await cartErrors(locale)).notFound };
  }

  const result = await updateCartLineQuantity(
    cartId,
    lineId,
    quantity,
    locale,
  );

  if (!result.ok) {
    return result;
  }

  revalidatePath("/[lang]/cart", "page");

  return {
    ok: true as const,
    totalQuantity: result.totalQuantity,
  };
}

export async function removeFromCart(lineId: string, locale: Locale) {
  if (!isShopifyConfigured()) {
    return {
      ok: false as const,
      error: (await cartErrors(locale)).notConfigured,
    };
  }

  const cartId = await getCartIdFromCookies();
  if (!cartId) {
    return { ok: false as const, error: (await cartErrors(locale)).notFound };
  }

  const result = await removeCartLines(cartId, [lineId], locale);

  if (!result.ok) {
    return result;
  }

  if (result.totalQuantity === 0) {
    await clearCartCookie();
  }

  revalidatePath("/[lang]/cart", "page");

  return {
    ok: true as const,
    totalQuantity: result.totalQuantity,
  };
}
