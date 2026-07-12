// Client-side cart store shared by the navbar badge and cart panel.
// Fetches once on first subscription, deduplicates in-flight requests,
// and refreshes whenever the cart changes.

import { prefetchSimilarProductsForCart } from "@/lib/cart-similar-store";
import type { Cart } from "@/lib/shopify/cart";

let cart: Cart | null = null;
let hasFetched = false;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

async function fetchCart(): Promise<void> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) {
        cart = null;
        return;
      }

      const data = (await response.json()) as { cart: Cart | null };
      cart = data.cart;
      prefetchSimilarProductsForCart(cart);
    } catch {
      // Keep the last known cart on network errors.
    } finally {
      hasFetched = true;
      inFlight = null;
      emit();
    }
  })();

  return inFlight;
}

function ensureFetched() {
  if (!hasFetched && !inFlight) {
    void fetchCart();
  }
}

export function subscribeCart(callback: () => void): () => void {
  listeners.add(callback);
  ensureFetched();
  return () => listeners.delete(callback);
}

export function getCart(): Cart | null {
  return cart;
}

export function getCartCount(): number {
  return cart?.totalQuantity ?? 0;
}

export function getCartHasFetched(): boolean {
  return hasFetched;
}

export function getServerCartHasFetched(): boolean {
  return false;
}

export function getServerCart(): Cart | null {
  return null;
}

export function getServerCartCount(): number {
  return 0;
}

export function refreshCart(): Promise<void> {
  return fetchCart();
}

if (typeof window !== "undefined") {
  const handleCartChanged = () => {
    void fetchCart();
  };

  window.addEventListener("cart-updated", handleCartChanged);
  window.addEventListener("cart-item-added", handleCartChanged);
}
