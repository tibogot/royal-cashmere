"use client";

import ShopifyProductImage from "@/components/ShopifyProductImage";
import { SHOPIFY_IMAGE_WIDTH } from "@/lib/shopify/image";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { CartLine } from "@/lib/shopify/cart";
import Link from "next/link";

type CartLineItemProps = {
  line: CartLine;
  quantity: number;
  variant?: "page" | "panel";
  onClose?: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export default function CartLineItem({
  line,
  quantity,
  variant = "page",
  onClose,
  onDecrease,
  onIncrease,
  onRemove,
}: CartLineItemProps) {
  const isPanel = variant === "panel";

  return (
    <li
      className={
        isPanel
          ? "grid grid-cols-[72px_1fr] items-start gap-4 py-6"
          : "grid grid-cols-[96px_1fr_auto] items-start gap-6 py-8 md:grid-cols-[120px_1fr_auto]"
      }
    >
      <Link
        href={routes.product(line.productHandle)}
        onClick={onClose}
        className="block"
      >
        <ShopifyProductImage
          src={line.imageUrl}
          alt={line.imageAlt}
          padding="sm"
          width={SHOPIFY_IMAGE_WIDTH.thumb}
          className="aspect-4/5"
          sizes={isPanel ? "72px" : "120px"}
        />
      </Link>

      <div className="min-w-0 text-left">
        <Link
          href={routes.product(line.productHandle)}
          onClick={onClose}
          className="font-serif text-sm font-medium transition-opacity hover:opacity-60 md:text-base"
        >
          {line.title}
        </Link>
        {line.variantTitle ? (
          <p className="mt-1 text-sm text-black/50">{line.variantTitle}</p>
        ) : null}
        <p className="mt-2 text-sm text-black/70">{line.price}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onDecrease}
            aria-label="Diminuer la quantité"
            className="flex size-8 items-center justify-center border border-black/20 text-sm transition-opacity hover:opacity-60"
          >
            −
          </button>
          <span className="min-w-6 text-center text-sm tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            aria-label="Augmenter la quantité"
            className="flex size-8 items-center justify-center border border-black/20 text-sm transition-opacity hover:opacity-60"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className={`${ctaLinkClassName} mt-4`}
        >
          Retirer
        </button>
      </div>

      {!isPanel ? (
        <p className="self-center text-sm text-black/70">{line.price}</p>
      ) : null}
    </li>
  );
}
