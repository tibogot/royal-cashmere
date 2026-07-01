import ShopifyProductImage from "@/components/ShopifyProductImage";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductCardProps = {
  product: ShopifyProduct;
  layout?: "carousel" | "grid";
};

export default function ProductCard({
  product,
  layout = "carousel",
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
      : "w-[72vw] shrink-0 snap-start md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]";

  const imageSizes =
    layout === "grid"
      ? "(max-width: 1024px) 50vw, 25vw"
      : "(max-width: 768px) 72vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <article className={articleClassName}>
      <Link href={`/products/${product.handle}`} className="group block">
        <ShopifyProductImage
          src={product.imageUrl}
          alt={product.imageAlt}
          sizes={imageSizes}
          className="aspect-4/5"
          imageClassName="transition-opacity group-hover:opacity-90"
        />

        <div className="mt-4 space-y-1 text-left">
          <h3 className="font-serif text-base font-medium">{product.title}</h3>
          <p className="text-sm text-black/70">{product.price}</p>
          {colorLabel ? (
            <p className="text-sm text-black/50">{colorLabel}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
