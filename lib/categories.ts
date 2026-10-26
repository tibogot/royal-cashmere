import { routes } from "@/lib/routes";

export type CategoryItem = {
  label: string;
  image: string;
  imageAlt: string;
  href: string;
};

const categoryConfig = [
  {
    id: "robes-cachemire",
    label: "Robes",
    image: "/images/categories/robes.jpg",
    imageAlt: "Robes en cachemire Royal Cashmere",
  },
  {
    id: "pantalons-femme",
    label: "Pantalons",
    image: "/images/categories/pantalons.jpg",
    imageAlt: "Pantalons en cachemire Royal Cashmere",
  },
  {
    id: "echarpes-cachemire",
    label: "Écharpes",
    image: "/images/categories/echarpes.jpg",
    imageAlt: "Écharpes en cachemire Royal Cashmere",
  },
  {
    id: "pulls-femme",
    label: "Pulls",
    image: "/images/categories/pulls.jpg",
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

// Search panel shortcuts to the main categories (handles from lib/catalog).
export const popularSearches = [
  { label: "Pulls femme", href: routes.collectionByHandle("pulls-femme") },
  { label: "Pulls homme", href: routes.collectionByHandle("pulls-homme") },
  { label: "Robes", href: routes.collectionByHandle("robes-cachemire") },
  { label: "Écharpes", href: routes.collectionByHandle("echarpes-cachemire") },
];
