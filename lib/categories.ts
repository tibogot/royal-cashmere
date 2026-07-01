import { routes } from "@/lib/routes";
import { boutiqueFilters } from "@/lib/boutique-filters";

export type CategoryItem = {
  label: string;
  image: string;
  imageAlt: string;
  href: string;
};

const categoryConfig = [
  {
    id: "robes",
    label: "Robes",
    image: "/images/Frame 53.jpg",
    imageAlt: "Robes en cachemire Royal Cashmere",
  },
  {
    id: "pantalons",
    label: "Pantalons",
    image: "/images/Frame 54.jpg",
    imageAlt: "Pantalons en cachemire Royal Cashmere",
  },
  {
    id: "echarpes",
    label: "Écharpes",
    image: "/images/Frame 55.jpg",
    imageAlt: "Écharpes en cachemire Royal Cashmere",
  },
  {
    id: "pulls",
    label: "Pulls",
    image: "/images/Frame 12.jpg",
    imageAlt: "Pulls en cachemire Royal Cashmere",
  },
] as const;

export const showcaseCategories: CategoryItem[] = categoryConfig.map(
  (category) => ({
    label: category.label,
    image: category.image,
    imageAlt: category.imageAlt,
    href: routes.collectionByHandle(category.id),
  }),
);

export const popularSearches = boutiqueFilters
  .filter((filter) => filter.id !== "all")
  .map((filter) => ({
    label: filter.label,
    href: routes.collectionByHandle(filter.id),
  }));

export const collectionHandles = categoryConfig.map((category) => category.id);

export function getCollectionLabel(handle: string) {
  return boutiqueFilters.find((filter) => filter.id === handle)?.label;
}

const navCardFallbacks = [
  {
    imageUrl: "/images/Frame 53.jpg",
    imageAlt: "Collection Royal Cashmere",
  },
  {
    imageUrl: "/images/Frame 54.jpg",
    imageAlt: "Collection Royal Cashmere",
  },
] as const;

export function getCollectionNavCardImage(handle: string, index: number) {
  const match = categoryConfig.find((category) => category.id === handle);
  if (match) {
    return { imageUrl: match.image, imageAlt: match.imageAlt };
  }

  return navCardFallbacks[index % navCardFallbacks.length];
}
