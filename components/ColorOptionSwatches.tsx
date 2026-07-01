"use client";

import {
  isShopifyCdnUrl,
  shopifyImageUrl,
  SHOPIFY_IMAGE_WIDTH,
} from "@/lib/shopify/image";
import type { ProductVariant } from "@/lib/shopify/queries";
import { getColorValueImage } from "@/lib/shopify/variants";
import Image from "next/image";

type ColorOptionSwatchesProps = {
  optionName: string;
  values: string[];
  selectedValue: string;
  selectableValues: string[];
  variants: ProductVariant[];
  fallbackImageUrl: string;
  fallbackImageAlt: string;
  onSelect: (value: string) => void;
};

export default function ColorOptionSwatches({
  optionName,
  values,
  selectedValue,
  selectableValues,
  variants,
  fallbackImageUrl,
  fallbackImageAlt,
  onSelect,
}: ColorOptionSwatchesProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {values.map((value) => {
        const isSelected = selectedValue === value;
        const isAvailable = selectableValues.includes(value);
        const { imageUrl, imageAlt } = getColorValueImage(
          variants,
          optionName,
          value,
          { imageUrl: fallbackImageUrl, imageAlt: fallbackImageAlt },
        );
        const resolvedSrc = shopifyImageUrl(imageUrl, SHOPIFY_IMAGE_WIDTH.thumb);

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            disabled={!isAvailable}
            aria-pressed={isSelected}
            aria-label={value}
            title={value}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span
              className={`relative block size-14 overflow-hidden bg-white ${
                isSelected ? "border border-black" : ""
              }`}
            >
              <Image
                src={resolvedSrc}
                alt={imageAlt}
                width={56}
                height={56}
                unoptimized={isShopifyCdnUrl(imageUrl)}
                className="size-full object-cover"
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
