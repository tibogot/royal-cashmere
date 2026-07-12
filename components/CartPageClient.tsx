"use client";

import CartPageView from "@/components/CartPageView";
import {
  getCart,
  getCartHasFetched,
  getServerCart,
  getServerCartHasFetched,
  refreshCart,
  subscribeCart,
} from "@/lib/cart-store";
import { useEffect, useSyncExternalStore } from "react";

export default function CartPageClient() {
  const cart = useSyncExternalStore(subscribeCart, getCart, getServerCart);
  const hasFetched = useSyncExternalStore(
    subscribeCart,
    getCartHasFetched,
    getServerCartHasFetched,
  );

  useEffect(() => {
    void refreshCart();
  }, []);

  if (!hasFetched) {
    return (
      <div className="mx-auto mt-12 max-w-4xl">
        <ul className="divide-y divide-black/10 border-t border-black/10">
          {Array.from({ length: 2 }, (_, index) => (
            <li
              key={index}
              className="grid grid-cols-[96px_1fr_auto] items-start gap-6 py-8 md:grid-cols-[120px_1fr_auto]"
            >
              <div className="aspect-4/5 animate-pulse bg-black/5" />
              <div className="space-y-3">
                <div className="h-4 w-48 animate-pulse bg-black/5" />
                <div className="h-3 w-32 animate-pulse bg-black/5" />
                <div className="h-8 w-24 animate-pulse bg-black/5" />
              </div>
              <div className="h-4 w-16 animate-pulse bg-black/5" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <CartPageView cart={cart} />
    </div>
  );
}
