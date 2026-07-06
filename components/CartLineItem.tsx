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

function VariantOptionLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <p className="mt-1.5 text-xs uppercase tracking-wide text-black/60">
      {label}
      <span className="normal-case text-black/80"> — {value}</span>
    </p>
  );
}

function LinePrice({
  quantity,
  unitPrice,
  lineTotal,
  align = "right",
}: {
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  align?: "left" | "right";
}) {
  const alignment = align === "right" ? "text-right" : "text-left";

  return (
    <div className={`shrink-0 ${alignment}`}>
      <p className="text-sm text-black">
        {quantity > 1 ? lineTotal : unitPrice}
      </p>
      {quantity > 1 ? (
        <p className="mt-0.5 text-xs text-black/50">
          {quantity} × {unitPrice}
        </p>
      ) : null}
    </div>
  );
}

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

  if (isPanel) {
    return (
      <li className="grid grid-cols-[64px_1fr] items-start gap-3 py-3">
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
            sizes="64px"
          />
        </Link>

        <div className="min-w-0 text-left">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={routes.product(line.productHandle)}
              onClick={onClose}
              className="min-w-0 font-sans text-sm font-medium uppercase leading-snug transition-opacity hover:opacity-60"
            >
              {line.title}
            </Link>
            <LinePrice
              quantity={quantity}
              unitPrice={line.price}
              lineTotal={line.lineTotal}
            />
          </div>

          {line.colorValue ? (
            <VariantOptionLine label="Couleur" value={line.colorValue} />
          ) : null}
          {line.sizeValue ? (
            <VariantOptionLine label="Taille" value={line.sizeValue} />
          ) : null}

          <div className="mt-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDecrease}
                aria-label="Diminuer la quantité"
                className="flex size-7 items-center justify-center border border-black/20 text-sm transition-opacity hover:opacity-60"
              >
                −
              </button>
              <span className="min-w-5 text-center text-sm tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                aria-label="Augmenter la quantité"
                className="flex size-7 items-center justify-center border border-black/20 text-sm transition-opacity hover:opacity-60"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className={ctaLinkClassName}
            >
              Retirer
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="grid grid-cols-[96px_1fr_auto] items-start gap-6 py-8 md:grid-cols-[120px_1fr_auto]">
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
          sizes="120px"
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
        {line.colorValue ? (
          <VariantOptionLine label="Couleur" value={line.colorValue} />
        ) : null}
        {line.sizeValue ? (
          <VariantOptionLine label="Taille" value={line.sizeValue} />
        ) : null}
        {!line.colorValue && !line.sizeValue && line.variantTitle ? (
          <p className="mt-1 text-sm text-black/50">{line.variantTitle}</p>
        ) : null}

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

      <LinePrice
        quantity={quantity}
        unitPrice={line.price}
        lineTotal={line.lineTotal}
        align="right"
      />
    </li>
  );
}
