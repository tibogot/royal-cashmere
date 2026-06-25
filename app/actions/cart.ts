"use server";

import {
  addVariantToCart,
  getCartById,
  getCartCookieOptions,
} from "@/lib/shopify/cart";
import { isShopifyConfigured } from "@/lib/shopify/client";
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

async function clearCartCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(getCartCookieOptions().name);
}

export async function getCart() {
  if (!isShopifyConfigured()) return null;

  const cartId = await getCartIdFromCookies();
  if (!cartId) return null;

  const cart = await getCartById(cartId);
  if (!cart) {
    await clearCartCookie();
    return null;
  }

  return cart;
}

export async function getCartCount() {
  const cart = await getCart();
  return cart?.totalQuantity ?? 0;
}

export async function addToCart(variantId: string) {
  if (!isShopifyConfigured()) {
    return { ok: false as const, error: "Boutique non configurée." };
  }

  const existingCartId = await getCartIdFromCookies();
  const result = await addVariantToCart(variantId, existingCartId);

  if (!result.ok) {
    if (existingCartId) {
      await clearCartCookie();
      const retryResult = await addVariantToCart(variantId);

      if (!retryResult.ok) {
        return retryResult;
      }

      await setCartCookie(retryResult.cartId);
      revalidatePath("/panier");

      return {
        ok: true as const,
        totalQuantity: retryResult.totalQuantity,
      };
    }

    return result;
  }

  await setCartCookie(result.cartId);
  revalidatePath("/panier");

  return {
    ok: true as const,
    totalQuantity: result.totalQuantity,
  };
}
