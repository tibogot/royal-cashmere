"use client";

import { removeFromCart, updateCartLine } from "@/app/actions/cart";
import CartLineItem from "@/components/CartLineItem";
import CartSimilarProducts from "@/components/CartSimilarProducts";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { Cart } from "@/lib/shopify/cart";
import { getCart, refreshCart } from "@/lib/cart-store";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type CartViewProps = {
  initialCart: Cart | null;
  variant?: "page" | "panel";
  onClose?: () => void;
};

function updateLineQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  const lines =
    quantity < 1
      ? cart.lines.filter((line) => line.id !== lineId)
      : cart.lines.map((line) =>
          line.id === lineId ? { ...line, quantity } : line,
        );

  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    ...cart,
    lines,
    totalQuantity,
  };
}

export default function CartView({
  initialCart,
  variant = "page",
  onClose,
}: CartViewProps) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const cartRef = useRef(cart);
  const mutationQueueRef = useRef(Promise.resolve());

  // Reset to the latest server cart when it changes (e.g. after a route-level
  // revalidation), during render rather than in a sync effect.
  const [prevInitialCart, setPrevInitialCart] = useState(initialCart);
  if (initialCart !== prevInitialCart) {
    setPrevInitialCart(initialCart);
    setCart(initialCart);
  }

  // Mirror the latest cart into a ref so async mutation callbacks read a fresh
  // value without writing to the ref during render.
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const syncCartFromServer = useCallback(async () => {
    await refreshCart();
    setCart(getCart());
  }, []);

  useEffect(() => {
    if (variant !== "panel") return;

    const handleItemAdded = () => {
      syncCartFromServer();
    };

    window.addEventListener("cart-item-added", handleItemAdded);
    return () => window.removeEventListener("cart-item-added", handleItemAdded);
  }, [variant, syncCartFromServer]);

  const runCartMutation = useCallback(
    (
      nextCart: Cart | null,
      action: () => Promise<{ ok: boolean; error?: string }>,
    ) => {
      cartRef.current = nextCart;
      setCart(nextCart);

      mutationQueueRef.current = mutationQueueRef.current
        .then(async () => {
          const result = await action();

          if (!result.ok) {
            window.alert(
              result.error ?? "Impossible de mettre à jour le panier.",
            );
          } else {
            window.dispatchEvent(new Event("cart-updated"));
          }

          await syncCartFromServer();
        })
        .catch(() => {
          // Keep queue alive if a mutation fails unexpectedly.
        });
    },
    [syncCartFromServer],
  );

  const handleDecrease = (lineId: string) => {
    const current = cartRef.current;
    if (!current) return;

    const line = current.lines.find((item) => item.id === lineId);
    if (!line) return;

    if (line.quantity <= 1) {
      handleRemove(lineId);
      return;
    }

    runCartMutation(
      updateLineQuantity(current, lineId, line.quantity - 1),
      () => updateCartLine(lineId, line.quantity - 1),
    );
  };

  const handleIncrease = (lineId: string) => {
    const current = cartRef.current;
    if (!current) return;

    const line = current.lines.find((item) => item.id === lineId);
    if (!line) return;

    runCartMutation(
      updateLineQuantity(current, lineId, line.quantity + 1),
      () => updateCartLine(lineId, line.quantity + 1),
    );
  };

  const handleRemove = (lineId: string) => {
    if (!cart) return;

    const nextCart = updateLineQuantity(cart, lineId, 0);
    runCartMutation(nextCart.lines.length ? nextCart : null, () =>
      removeFromCart(lineId),
    );
  };

  const isPanel = variant === "panel";

  if (!cart || cart.lines.length === 0) {
    if (isPanel) {
      return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="px-4 pb-4 md:px-8">
              <div className="pt-4 text-center">
                <p className="text-sm text-black/70">Votre panier est vide.</p>
                <Link
                  href={routes.shop}
                  onClick={onClose}
                  className={`${ctaLinkClassName} mt-6 inline-block`}
                >
                  Continuer vos achats
                </Link>
              </div>
              <div className="mt-6">
                <CartSimilarProducts productHandles={[]} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-12 text-center">
        <p className="text-sm text-black/70">Votre panier est vide.</p>
        <Link
          href={routes.shop}
          onClick={onClose}
          className={`${ctaLinkClassName} mt-8 inline-block`}
        >
          Continuer vos achats
        </Link>
      </div>
    );
  }

  const cartLines = (
    <ul className="divide-y divide-black/10 border-t border-black/10">
      {cart.lines.map((line) => (
        <CartLineItem
          key={line.id}
          line={line}
          quantity={line.quantity}
          variant={variant}
          onClose={onClose}
          onDecrease={() => handleDecrease(line.id)}
          onIncrease={() => handleIncrease(line.id)}
          onRemove={() => handleRemove(line.id)}
        />
      ))}
    </ul>
  );

  const checkoutFooter = (
    <div
      className={
        isPanel
          ? "flex shrink-0 flex-col gap-3 border-t border-black/10 bg-white px-4 py-4 pt-3 md:px-8"
          : "mt-10 flex flex-col gap-6 border-t border-black/10 pt-8"
      }
    >
      <p
        className={`flex items-center justify-between uppercase tracking-wide ${
          isPanel ? "text-sm" : "text-base"
        }`}
      >
        <span>Total</span>
        <span className="font-medium">{cart.totalPrice}</span>
      </p>

      <a
        href={cart.checkoutUrl}
        className={
          isPanel
            ? "w-full select-none bg-black px-6 py-3.5 text-center text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80"
            : "ml-auto select-none bg-black px-10 py-4 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80"
        }
      >
        Passer commande
      </a>
    </div>
  );

  if (isPanel) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-4 pb-4 md:px-8">
            <div className="pt-4">{cartLines}</div>
            <CartSimilarProducts
              productHandles={cart.lines.map((line) => line.productHandle)}
            />
          </div>
        </div>
        {checkoutFooter}
      </div>
    );
  }

  return (
    <div className="mt-12">
      {cartLines}
      {checkoutFooter}
    </div>
  );
}
