import { routes } from "@/lib/routes";

export type CategoryItem = {
  label: string;
  image: string;
  imageAlt: string;
  href: string;
};

export const showcaseCategories: CategoryItem[] = [
  {
    label: "Robes",
    image: "/images/Frame 53.jpg",
    imageAlt: "Robes en cachemire Royal Cashmere",
    href: routes.collection,
  },
  {
    label: "Pantalons",
    image: "/images/Frame 54.jpg",
    imageAlt: "Pantalons en cachemire Royal Cashmere",
    href: routes.collection,
  },
  {
    label: "Écharpes",
    image: "/images/Frame 55.jpg",
    imageAlt: "Écharpes en cachemire Royal Cashmere",
    href: routes.collection,
  },
  {
    label: "Pulls",
    image: "/images/Frame 12.jpg",
    imageAlt: "Pulls en cachemire Royal Cashmere",
    href: routes.collection,
  },
];
