"use client";

import { removeFromCart, updateCartLine } from "@/app/actions/cart";
import CartLineItem from "@/components/CartLineItem";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { Cart } from "@/lib/shopify/cart";
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

  cartRef.current = cart;

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const syncCartFromServer = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) return;

      const data = (await response.json()) as { cart: Cart | null };
      setCart(data.cart);
    } catch {
      // Keep optimistic state on network errors.
    }
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
    return (
      <div className={isPanel ? "mt-8 text-center" : "mt-12 text-center"}>
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

  return (
    <div className={isPanel ? "mt-8" : "mt-12"}>
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

      <div
        className={
          isPanel
            ? "mt-8 flex flex-col gap-6 border-t border-black/10 pt-6"
            : "mt-10 flex flex-col items-end gap-6 border-t border-black/10 pt-8"
        }
      >
        <p className={isPanel ? "text-base" : "text-lg"}>
          Total <span className="font-medium">{cart.totalPrice}</span>
        </p>

        <a
          href={cart.checkoutUrl}
          className={
            isPanel
              ? "w-full select-none bg-black px-8 py-4 text-center text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80"
              : "select-none bg-black px-10 py-4 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80"
          }
        >
          Passer commande
        </a>
      </div>
    </div>
  );
}
