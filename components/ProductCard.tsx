import ShopifyProductImage from "@/components/ShopifyProductImage";
import { Draggable } from "gsap/Draggable";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductCardProps = {
  product: ShopifyProduct;
  layout?: "carousel" | "grid";
  preventClickAfterDrag?: boolean;
};

export default function ProductCard({
  product,
  layout = "carousel",
  preventClickAfterDrag = false,
}: ProductCardProps) {
  const colorLabel =
    product.colorCount > 0
      ? product.colorCount === 1
        ? "1 couleur"
        : `${product.colorCount} couleurs`
      : null;

  const articleClassName =
    layout === "grid"
      ? "w-full"
      : "w-[72vw] shrink-0 md:w-[calc((100vw-4rem)/2-0.75rem)] lg:w-[calc((100vw-4rem)/4-1.125rem)]";

  const imageSizes =
    layout === "grid"
      ? "(max-width: 1024px) 50vw, 25vw"
      : "(max-width: 768px) 72vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <article className={articleClassName}>
      <Link
        href={`/products/${product.handle}`}
        className="group block"
        onClick={
          preventClickAfterDrag
            ? (event) => {
                if (Draggable.timeSinceDrag() < 0.15) {
                  event.preventDefault();
                }
              }
            : undefined
        }
      >
        <ShopifyProductImage
          src={product.imageUrl}
          alt={product.imageAlt}
          sizes={imageSizes}
          className="aspect-4/5"
          imageClassName="transition-opacity group-hover:opacity-90"
        />

        <div className="mt-4 space-y-1 text-left">
          <h3 className="font-serif text-base font-medium text-black">
            {product.title}
          </h3>
          <p className="text-sm font-normal text-neutral-800">{product.price}</p>
          {colorLabel ? (
            <p className="text-sm font-normal text-neutral-600">{colorLabel}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
