import { isLightSwatchColor } from "@/lib/shopify/color-swatch";
import type { ProductColorSwatch } from "@/lib/shopify/queries";
import { routes } from "@/lib/routes";
import Link from "next/link";

type ProductColorSwatchesProps = {
  swatches: ProductColorSwatch[];
  productHandle?: string;
};

export default function ProductColorSwatches({
  swatches,
  productHandle,
}: ProductColorSwatchesProps) {
  if (swatches.length === 0) return null;

  return (
    <div
      className="mt-1.5 flex flex-wrap gap-2"
      aria-label={`${swatches.length} couleur${swatches.length > 1 ? "s" : ""}`}
    >
      {swatches.map((swatch) => {
        const className = `block size-4 shrink-0 rounded-full transition-opacity hover:opacity-70 ${
          isLightSwatchColor(swatch.color) ? "border border-black/15" : ""
        }`;

        if (productHandle) {
          return (
            <Link
              key={swatch.value}
              href={routes.product(productHandle, { color: swatch.value })}
              title={swatch.value}
              aria-label={swatch.value}
              className={className}
              style={{ backgroundColor: swatch.color }}
              onClick={(event) => event.stopPropagation()}
            />
          );
        }

        return (
          <span
            key={swatch.value}
            title={swatch.value}
            className={className}
            style={{ backgroundColor: swatch.color }}
          />
        );
      })}
    </div>
  );
}
