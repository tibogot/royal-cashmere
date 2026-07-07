import {
  isShopifyCdnUrl,
  shopifyImageUrl,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import FadeInImage from "@/components/FadeInImage";

type ShopifyProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  padding?: "sm" | "md" | "lg";
  preload?: boolean;
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
  preload,
  width = SHOPIFY_IMAGE_WIDTH.card,
}: ShopifyProductImageProps) {
  const resolvedSrc = shopifyImageUrl(src, width);
  const useShopifyCdn = isShopifyCdnUrl(src);

  return (
    <div className={`relative w-full overflow-hidden bg-white ${className}`}>
      <FadeInImage
        src={resolvedSrc}
        alt={alt}
        fill
        preload={preload}
        unoptimized={useShopifyCdn}
        className={`box-border object-contain ${paddingClassName[padding]} ${imageClassName}`}
        sizes={sizes}
      />
    </div>
  );
}
