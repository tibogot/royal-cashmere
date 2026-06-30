"use client";

import AddToCartButton from "@/components/AddToCartButton";
import { getProductDescriptionHtml } from "@/lib/shopify/format-description";
import type { ShopifyProductDetail } from "@/lib/shopify/queries";
import {
  findVariantBySelections,
  getDefaultSelections,
  getSelectableValues,
  isColorOption,
  isSizeOption,
  sortProductOptions,
} from "@/lib/shopify/variants";
import { useMemo, useState } from "react";

type ProductPurchasePanelProps = {
  product: ShopifyProductDetail;
};

function getOptionLabel(name: string) {
  if (isColorOption(name)) return "Couleur";
  if (isSizeOption(name)) return "Taille";
  return name;
}

export default function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const sortedOptions = useMemo(
    () => sortProductOptions(product.options),
    [product.options],
  );

  const [selections, setSelections] = useState(() =>
    getDefaultSelections(product.options, product.variants),
  );

  const selectedVariant = useMemo(
    () => findVariantBySelections(product.variants, selections),
    [product.variants, selections],
  );

  const handleOptionChange = (optionName: string, value: string) => {
    setSelections((current) => ({
      ...current,
      [optionName]: value,
    }));
  };

  const descriptionHtml = getProductDescriptionHtml(
    product.description,
    product.descriptionHtml,
  );

  return (
    <div className="flex min-w-0 w-full max-w-full flex-col">
      <h1 className="break-words font-serif text-3xl uppercase leading-tight md:text-4xl lg:text-5xl">
        {product.title}
      </h1>

      <p className="mt-6 text-lg text-black/80 md:mt-8 md:text-xl">
        {selectedVariant?.price ?? product.price}
      </p>

      {sortedOptions.length > 0 ? (
        <div className="mt-8 space-y-6">
          {sortedOptions.map((option) => {
            const selectableValues = getSelectableValues(
              option.name,
              product.options,
              product.variants,
              selections,
            );

            return (
              <div key={option.name}>
                <p className="text-xs uppercase tracking-wide text-black/60">
                  {getOptionLabel(option.name)}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selections[option.name] === value;
                    const isAvailable = selectableValues.includes(value);

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleOptionChange(option.name, value)}
                        disabled={!isAvailable}
                        aria-pressed={isSelected}
                        className={`min-w-11 border px-4 py-2 text-sm transition-colors ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-black/20 bg-white text-black hover:border-black/50"
                        } disabled:cursor-not-allowed disabled:border-black/10 disabled:text-black/30`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <AddToCartButton
        variantId={selectedVariant?.id ?? product.variants[0]?.id ?? ""}
        availableForSale={selectedVariant?.availableForSale ?? false}
      />

      {descriptionHtml ? (
        <div
          className="product-description font-sans mt-12 text-sm font-light leading-relaxed text-black/75 md:mt-16 md:text-base"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : null}
    </div>
  );
}
