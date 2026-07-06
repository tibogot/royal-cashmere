"use client";

import { addToCart } from "@/app/actions/cart";
import ProductColorSwatches from "@/components/ProductColorSwatches";
import ProductImageWishlist from "@/components/ProductImageWishlist";
import ShopifyProductImage from "@/components/ShopifyProductImage";
import { routes } from "@/lib/routes";
import type { CartCarouselProduct } from "@/lib/shopify/products";
import { Draggable } from "gsap/Draggable";
import Link from "next/link";
import { useTransition } from "react";

type CartQuickAddCardProps = {
  product: CartCarouselProduct;
  layout?: "carousel" | "compact";
  preventClickAfterDrag?: boolean;
};

export default function CartQuickAddCard({
  product,
  layout = "compact",
  preventClickAfterDrag = false,
}: CartQuickAddCardProps) {
  const [isPending, startTransition] = useTransition();
  const isCompact = layout === "compact";

  const articleClassName = isCompact
    ? "group flex w-48 shrink-0 flex-col"
    : "group flex w-[72vw] shrink-0 flex-col md:w-[calc((100vw-4rem)/2-0.75rem)] lg:w-[calc((100vw-4rem)/4-1.125rem)]";

  const imageSizes = isCompact
    ? "192px"
    : "(max-width: 768px) 72vw, (max-width: 1024px) 50vw, 25vw";

  const handleLinkClick = preventClickAfterDrag
    ? (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (Draggable.timeSinceDrag() < 0.15) {
          event.preventDefault();
        }
      }
    : undefined;

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product.defaultVariantId || !product.availableForSale || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await addToCart(product.defaultVariantId);

      if (!result.ok) {
        window.alert(result.error);
        return;
      }

      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("cart-item-added"));
    });
  };

  const addLabel = isPending
    ? "Ajout…"
    : product.availableForSale
      ? "Ajouter"
      : "Rupture";

  return (
    <article className={articleClassName}>
      <div className="relative">
        <ProductImageWishlist product={product}>
          <Link
            href={routes.product(product.handle)}
            className="block"
            onClick={handleLinkClick}
          >
            <ShopifyProductImage
              src={product.imageUrl}
              alt={product.imageAlt}
              sizes={imageSizes}
              className="aspect-4/5"
              imageClassName="transition-opacity group-hover:opacity-90"
            />
          </Link>
        </ProductImageWishlist>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.availableForSale || isPending}
            className="pointer-events-auto w-full bg-white/95 py-2.5 text-xs uppercase tracking-wide backdrop-blur-sm transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {addLabel}
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-1 flex-col text-left">
        <Link
          href={routes.product(product.handle)}
          className="block transition-opacity hover:opacity-60"
          onClick={handleLinkClick}
        >
          <h3 className="line-clamp-2 min-h-10 font-sans text-sm font-medium uppercase leading-snug text-black">
            {product.title}
          </h3>
          <p className="mt-1 text-sm font-normal text-neutral-800">
            {product.price}
          </p>
        </Link>

        <div className="mt-1.5 min-h-4">
          <ProductColorSwatches
            swatches={product.colorSwatches}
            productHandle={product.handle}
          />
        </div>
      </div>
    </article>
  );
}
