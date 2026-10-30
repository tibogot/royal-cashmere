import type { Dictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";

export type CategoryItem = {
  // The catalog handle, stable across languages: "pantalons-femme".
  id: string;
  label: string;
  image: string;
  imageAlt: string;
  href: string;
};

type ShowcaseHandle = keyof Dictionary["catalog"]["showcaseImageAlts"];

const categoryConfig = [
  { id: "robes-cachemire", image: "/images/categories/robes.jpg" },
  { id: "pantalons-femme", image: "/images/categories/pantalons.jpg" },
  { id: "echarpes-cachemire", image: "/images/categories/echarpes.jpg" },
  { id: "pulls-femme", image: "/images/categories/pulls.jpg" },
] as const satisfies readonly { id: ShowcaseHandle; image: string }[];

// Labels and alts come from the `catalog` dictionary section.
export function getShowcaseCategories(
  copy: Dictionary["catalog"],
): CategoryItem[] {
  return categoryConfig.map((category) => ({
    id: category.id,
    label: copy.labels[category.id],
    image: category.image,
    imageAlt: copy.showcaseImageAlts[category.id],
    href: routes.collectionByHandle(category.id),
  }));
}

const popularSearchConfig = [
  { key: "womenSweaters", handle: "pulls-femme" },
  { key: "menSweaters", handle: "pulls-homme" },
  { key: "dresses", handle: "robes-cachemire" },
  { key: "scarves", handle: "echarpes-cachemire" },
] as const satisfies readonly {
  key: keyof Dictionary["search"]["popular"];
  handle: string;
}[];

// Search panel shortcuts to the main categories (handles from lib/catalog).
export function getPopularSearches(labels: Dictionary["search"]["popular"]) {
  return popularSearchConfig.map(({ key, handle }) => ({
    label: labels[key],
    href: routes.collectionByHandle(handle),
  }));
}
