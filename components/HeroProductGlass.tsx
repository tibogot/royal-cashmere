import Image from "next/image";
import Link from "next/link";
import ProductImageWishlist from "@/components/ProductImageWishlist";
import { routes } from "@/lib/routes";
import type { ShopifyProduct } from "@/lib/shopify/queries";

const HERO_PRODUCT_IMAGE = "/images/image_5-removebg-preview 1.png";

type HeroProductGlassProps = {
  product: ShopifyProduct;
  imageSrc?: string;
};

export default function HeroProductGlass({
  product,
  imageSrc = HERO_PRODUCT_IMAGE,
}: HeroProductGlassProps) {
  return (
    <Link
      href={routes.product(product.handle)}
      className="group absolute right-4 bottom-6 z-10 block w-56 md:right-8 md:bottom-10 md:w-84 "
    >
      <div className="flex flex-col overflow-hidden  bg-linear-to-b from-black/20 via-black/15 to-black/10 backdrop-blur-xl">
        <ProductImageWishlist
          product={product}
          className="relative aspect-4/5 w-full"
          heartClassName="absolute top-2 right-2 z-10"
          tone="light"
        >
          <Image
            src={imageSrc}
            alt={product.imageAlt}
            fill
            className="box-border object-contain object-center p-3 transition-opacity group-hover:opacity-90"
            sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
          />
        </ProductImageWishlist>

        <div className="space-y-1 px-3.5 pb-3.5 text-left text-white md:px-4 md:pb-4">
          <h2 className="line-clamp-2 text-base font-medium font-sans">
            {product.title}
          </h2>
          <p className="text-sm font-normal text-white/80">{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
