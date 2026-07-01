import {
  isShopifyCdnUrl,
  shopifyImageUrl,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import Image from "next/image";

type ShopifyProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  padding?: "sm" | "md" | "lg";
  priority?: boolean;
  width?: number;
};

const paddingClassName = {
  sm: "p-2",
  md: "p-4",
  lg: "p-6 md:p-10",
} as const;

export default function ShopifyProductImage({
  src,
  alt,
  sizes,
  className = "",
  imageClassName = "",
  padding = "md",
  priority,
  width = SHOPIFY_IMAGE_WIDTH.card,
}: ShopifyProductImageProps) {
  const resolvedSrc = shopifyImageUrl(src, width);
  const useShopifyCdn = isShopifyCdnUrl(src);

  return (
    <div className={`relative w-full overflow-hidden bg-white ${className}`}>
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        unoptimized={useShopifyCdn}
        className={`box-border object-contain ${paddingClassName[padding]} ${imageClassName}`}
        sizes={sizes}
      />
    </div>
  );
}
