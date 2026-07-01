import type { ProductOption, ProductVariant } from "./queries";

export const COLOR_OPTION_NAMES = ["color", "couleur", "colour"];
export const SIZE_OPTION_NAMES = ["size", "taille", "sizes"];

export function isColorOption(name: string) {
  return COLOR_OPTION_NAMES.includes(name.toLowerCase());
}

export function isSizeOption(name: string) {
  return SIZE_OPTION_NAMES.includes(name.toLowerCase());
}

export function getColorCount(
  options: { name: string; values: string[] }[],
): number {
  const colorOption = options.find((option) =>
    COLOR_OPTION_NAMES.includes(option.name.toLowerCase()),
  );

  return colorOption?.values.length ?? 0;
}

export function sortProductOptions(options: ProductOption[]) {
  return [...options].sort((a, b) => {
    const aIsColor = isColorOption(a.name);
    const bIsColor = isColorOption(b.name);
    if (aIsColor && !bIsColor) return -1;
    if (!aIsColor && bIsColor) return 1;
    return 0;
  });
}

export function selectionsFromVariant(variant: ProductVariant) {
  return Object.fromEntries(
    variant.selectedOptions.map((option) => [option.name, option.value]),
  );
}

export function findVariantBySelections(
  variants: ProductVariant[],
  selections: Record<string, string>,
) {
  return variants.find((variant) =>
    variant.selectedOptions.every(
      (option) => selections[option.name] === option.value,
    ),
  );
}

export function getDefaultSelections(
  options: ProductOption[],
  variants: ProductVariant[],
) {
  const availableVariant =
    variants.find((variant) => variant.availableForSale) ?? variants[0];

  if (!availableVariant) {
    return Object.fromEntries(
      options.map((option) => [option.name, option.values[0] ?? ""]),
    );
  }

  return selectionsFromVariant(availableVariant);
}

export function getSelectableValues(
  optionName: string,
  options: ProductOption[],
  variants: ProductVariant[],
  selections: Record<string, string>,
) {
  const option = options.find((item) => item.name === optionName);
  if (!option) return [];

  return option.values.filter((value) =>
    variants.some((variant) => {
      if (!variant.availableForSale) return false;

      return variant.selectedOptions.every((selected) => {
        if (selected.name === optionName) {
          return selected.value === value;
        }

        const currentSelection = selections[selected.name];
        return !currentSelection || currentSelection === selected.value;
      });
    }),
  );
}

export function getProductImageForSelections(
  product: {
    imageUrl: string;
    imageAlt: string;
    variants: ProductVariant[];
  },
  selections: Record<string, string>,
) {
  const selectedVariant = findVariantBySelections(product.variants, selections);

  if (selectedVariant?.imageUrl) {
    return {
      imageUrl: selectedVariant.imageUrl,
      imageAlt: selectedVariant.imageAlt ?? product.imageAlt,
    };
  }

  const colorSelection = Object.entries(selections).find(([name]) =>
    isColorOption(name),
  );

  if (colorSelection) {
    const [, colorValue] = colorSelection;
    const colorVariant = product.variants.find(
      (variant) =>
        variant.imageUrl &&
        variant.selectedOptions.some(
          (option) => isColorOption(option.name) && option.value === colorValue,
        ),
    );

    if (colorVariant?.imageUrl) {
      return {
        imageUrl: colorVariant.imageUrl,
        imageAlt: colorVariant.imageAlt ?? product.imageAlt,
      };
    }
  }

  return {
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
  };
}

export function getColorValueImage(
  variants: ProductVariant[],
  colorOptionName: string,
  colorValue: string,
  fallback: { imageUrl: string; imageAlt: string },
) {
  const variant = variants.find(
    (item) =>
      item.imageUrl &&
      item.selectedOptions.some(
        (option) =>
          option.name === colorOptionName && option.value === colorValue,
      ),
  );

  return {
    imageUrl: variant?.imageUrl ?? fallback.imageUrl,
    imageAlt: variant?.imageAlt ?? fallback.imageAlt ?? colorValue,
  };
}
