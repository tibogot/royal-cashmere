import type { ShopifyProduct } from "./queries";

const placeholderCatalog: Omit<ShopifyProduct, "id">[] = [
  {
    title: "Pull ouvert",
    handle: "pull-ouvert",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Pull ouvert en cachemire",
    price: "319,00 €",
    colorCount: 5,
  },
  {
    title: "Pantalon long",
    handle: "pantalon-long",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Pantalon long en cachemire",
    price: "369,00 €",
    colorCount: 3,
  },
  {
    title: "Robe droite",
    handle: "robe-droite",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Robe droite en cachemire",
    price: "459,00 €",
    colorCount: 3,
  },
  {
    title: "Pull col V",
    handle: "pull-col-v",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Pull col V en cachemire",
    price: "359,00 €",
    colorCount: 6,
  },
  {
    title: "Pull torsadé",
    handle: "pull-torsade",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Pull torsadé en cachemire",
    price: "499,00 €",
    colorCount: 4,
  },
  {
    title: "Jupe longue",
    handle: "jupe-longue",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Jupe longue en cachemire",
    price: "519,00 €",
    colorCount: 3,
  },
  {
    title: "Poncho",
    handle: "poncho",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Poncho en cachemire",
    price: "489,00 €",
    colorCount: 3,
  },
  {
    title: "Écharpes unies",
    handle: "echarpes-unies",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Écharpe unie en cachemire",
    price: "219,00 €",
    colorCount: 5,
  },
];

export function getPlaceholderProducts(limit = 12): ShopifyProduct[] {
  const items =
    limit >= placeholderCatalog.length
      ? [...placeholderCatalog, ...placeholderCatalog]
      : placeholderCatalog;

  return items.slice(0, limit).map((product, index) => ({
    id: `placeholder-${index}`,
    ...product,
  }));
}
