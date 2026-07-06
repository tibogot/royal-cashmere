import ProductColorSwatches from "@/components/ProductColorSwatches";
import ProductImageWishlist from "@/components/ProductImageWishlist";
import ShopifyProductImage from "@/components/ShopifyProductImage";
import { routes } from "@/lib/routes";
import { Draggable } from "gsap/Draggable";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductCardProps = {
  product: ShopifyProduct;
  layout?: "carousel" | "grid" | "compact";
  preventClickAfterDrag?: boolean;
};

export default function ProductCard({
  product,
  layout = "carousel",
  preventClickAfterDrag = false,
}: ProductCardProps) {
  const articleClassName =
    layout === "grid"
      ? "w-full"
      : layout === "compact"
        ? "w-48 shrink-0"
        : "w-[72vw] shrink-0 md:w-[calc((100vw-4rem)/2-0.75rem)] lg:w-[calc((100vw-4rem)/4-1.125rem)]";

  const imageSizes =
    layout === "grid"
      ? "(max-width: 1024px) 50vw, 25vw"
      : layout === "compact"
        ? "192px"
        : "(max-width: 768px) 72vw, (max-width: 1024px) 50vw, 25vw";

  const handleLinkClick = preventClickAfterDrag
    ? (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (Draggable.timeSinceDrag() < 0.15) {
          event.preventDefault();
        }
      }
    : undefined;

  return (
    <article className={articleClassName}>
      <Link
        href={routes.product(product.handle)}
        className="group block"
        onClick={handleLinkClick}
      >
        <ProductImageWishlist product={product}>
          <ShopifyProductImage
            src={product.imageUrl}
            alt={product.imageAlt}
            sizes={imageSizes}
            className="aspect-4/5"
            imageClassName="transition-opacity group-hover:opacity-90"
          />
        </ProductImageWishlist>

        <div className="mt-2 space-y-1 text-left">
          <h3 className="font-sans text-sm font-medium uppercase text-black">
            {product.title}
          </h3>
          <p className="text-sm font-normal text-neutral-800">
            {product.price}
          </p>
        </div>
      </Link>

      <ProductColorSwatches
        swatches={product.colorSwatches}
        productHandle={product.handle}
      />
    </article>
  );
}
