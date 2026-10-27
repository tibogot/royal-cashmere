import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import type { StaticImageData } from "next/image";
import { sanityClient } from "./client";
import type { SanityHotspotImage } from "./types";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type EditableImageProps = {
  src: string | StaticImageData;
  alt: string;
  placeholder: "blur" | "empty";
  blurDataURL?: string;
  style?: { objectPosition: string };
};

// next/image props for a photo the client can replace in the Studio, or for
// the bundled one when none is set. The hotspot becomes object-position
// rather than a fixed crop, so the chosen focus holds whatever shape the
// container takes at each breakpoint.
export function editableImageProps(
  image: SanityHotspotImage | undefined,
  fallback: StaticImageData,
  fallbackAlt: string,
  width = 1600,
): EditableImageProps {
  if (!image?.asset) {
    return { src: fallback, alt: fallbackAlt, placeholder: "blur" };
  }
  return {
    src: urlFor(image).width(width).auto("format").url(),
    alt: image.alt || fallbackAlt,
    placeholder: image.lqip ? "blur" : "empty",
    blurDataURL: image.lqip,
    style: image.hotspot
      ? {
          objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`,
        }
      : undefined,
  };
}
