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
