import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import FadeInImage from "@/components/FadeInImage";

type SanityImageProps = {
  image: SanityImage;
  alt?: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
};

export default function SanityImage({
  image,
  alt,
  sizes = "100vw",
  className = "object-cover",
  preload = false,
}: SanityImageProps) {
  if (!image.asset) return null;

  const imageUrl = urlFor(image).width(1600).auto("format").url();

  return (
    <FadeInImage
      src={imageUrl}
      alt={alt ?? image.alt ?? ""}
      fill
      className={className}
      sizes={sizes}
      quality={75}
      preload={preload}
    />
  );
}
