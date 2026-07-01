import { routes } from "@/lib/routes";

export type MouseDrivenGalleryItem = {
  id: string;
  title: string;
  image: string;
  href: string;
};

export const mouseDrivenGalleryItems: MouseDrivenGalleryItem[] = [
  {
    id: "robes",
    title: "Robes",
    image: "/images/Frame 53.jpg",
    href: routes.collectionByHandle("robes"),
  },
  {
    id: "chales",
    title: "Châles",
    image: "/images/Frame 55.jpg",
    href: routes.collectionByHandle("echarpes"),
  },
  {
    id: "bonnets",
    title: "Bonnets",
    image: "/images/1140.3 coat 1.jpg",
    href: routes.shop,
  },
  {
    id: "pulls",
    title: "Pulls",
    image: "/images/Frame 12.jpg",
    href: routes.collectionByHandle("pulls"),
  },
  {
    id: "pantalons",
    title: "Pantalons",
    image: "/images/Frame 54.jpg",
    href: routes.collectionByHandle("pantalons"),
  },
  {
    id: "echarpes",
    title: "Écharpes",
    image: "/images/Catalog+Org-1 1.jpg",
    href: routes.collectionByHandle("echarpes"),
  },
  {
    id: "manteaux",
    title: "Manteaux",
    image: "/images/0179.1 jumper 1239 pants 1.jpg",
    href: routes.shop,
  },
  {
    id: "gants",
    title: "Gants",
    image: "/images/fadhil-abhimantra.jpg",
    href: routes.shop,
  },
  {
    id: "ponchos",
    title: "Ponchos",
    image: "/images/Frame 49.jpg",
    href: routes.shop,
  },
  {
    id: "cardigans",
    title: "Cardigans",
    image: "/images/Frame 63.png",
    href: routes.collectionByHandle("pulls"),
  },
  {
    id: "cachemire",
    title: "Cachemire",
    image: "/images/ekaterina-grosheva-optimized.jpg",
    href: routes.about,
  },
  {
    id: "maille",
    title: "Maille",
    image: "/images/Desktop - 20.jpg",
    href: routes.shop,
  },
];
