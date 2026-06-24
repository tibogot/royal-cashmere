import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductCardProps = {
  product: ShopifyProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  const colorLabel =
    product.colorCount > 0
      ? product.colorCount === 1
        ? "1 couleur"
        : `${product.colorCount} couleurs`
      : null;

  return (
    <article className="w-[72vw] shrink-0 snap-start md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
      <Link href={`/products/${product.handle}`} className="group block">
        <div className="relative aspect-[4/5] bg-[#f3efe8]">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-contain p-6 transition-opacity group-hover:opacity-90 md:p-8"
            sizes="(max-width: 768px) 72vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        <div className="mt-4 space-y-1 text-left">
          <h3 className="text-base font-medium">{product.title}</h3>
          <p className="text-sm text-black/70">{product.price}</p>
          {colorLabel ? (
            <p className="text-sm text-black/50">{colorLabel}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
