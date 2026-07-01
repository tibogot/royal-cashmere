import Image from "next/image";

type ShopifyProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  padding?: "sm" | "md" | "lg";
  priority?: boolean;
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
}: ShopifyProductImageProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-white ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={`box-border object-contain ${paddingClassName[padding]} ${imageClassName}`}
        sizes={sizes}
      />
    </div>
  );
}
