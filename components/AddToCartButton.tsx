"use client";

import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type AddToCartButtonProps = {
  variantId: string;
  availableForSale: boolean;
};

export default function AddToCartButton({
  variantId,
  availableForSale,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await addToCart(variantId);

      if (!result.ok) {
        window.alert(result.error);
        return;
      }

      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("cart-item-added"));
      window.dispatchEvent(new Event("cart-open"));
      router.refresh();
    });
  };

  const handleViewCart = () => {
    window.dispatchEvent(new Event("cart-open"));
  };

  const label = isPending
    ? "Ajout en cours…"
    : availableForSale
      ? "Ajouter au panier"
      : "Rupture de stock";

  return (
    <div className="mt-10 flex flex-col gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={!availableForSale || isPending}
        className="w-full max-w-sm select-none bg-black px-8 py-4 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {label}
      </button>

      <button
        type="button"
        onClick={handleViewCart}
        className="w-fit select-none text-xs uppercase tracking-wide text-black/60 underline underline-offset-4 transition-opacity hover:opacity-80"
      >
        Voir le panier
      </button>
    </div>
  );
}
