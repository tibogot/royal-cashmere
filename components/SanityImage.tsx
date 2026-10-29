import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";
import FadeInImage from "@/components/FadeInImage";
import Image from "next/image";

type SanityImageProps = {
  image: SanityImage;
  alt?: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
  // Source width requested from the Sanity CDN; raise for full-bleed images.
  width?: number;
  // false renders a plain Image, for when a parent animates the reveal
  // (e.g. ScrollShrinkImage) and a fade on top would double it.
  fade?: boolean;
};

export default function SanityImage({
  image,
  alt,
  sizes = "100vw",
  className = "object-cover",
  preload = false,
  width = 1600,
  fade = true,
}: SanityImageProps) {
  if (!image.asset) return null;

  const imageUrl = urlFor(image).width(width).auto("format").url();

  const ImageComponent = fade ? FadeInImage : Image;

  return (
    <ImageComponent
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
