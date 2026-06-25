import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type HeroProductGlassProps = {
  product: ShopifyProduct;
};

export default function HeroProductGlass({ product }: HeroProductGlassProps) {
  return (
    <Link
      href={routes.product(product.handle)}
      className="absolute right-4 bottom-6 z-10 w-56 md:right-8 md:bottom-10 md:w-72"
    >
      <div className="flex aspect-5/6 flex-col overflow-hidden border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
        <div className="relative min-h-0 flex-1 p-4 md:p-5">
          <Image
            src="/images/image_5-removebg-preview 1.png"
            alt={product.imageAlt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 224px, 288px"
          />
        </div>

        <div className="shrink-0 px-4 pb-4 text-left text-white md:px-5 md:pb-5">
          <h2 className="line-clamp-2 font-serif font-medium text-sm leading-snug md:text-base">
            {product.title}
          </h2>
          <p className="mt-2 text-sm text-white/75 md:text-base">{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
