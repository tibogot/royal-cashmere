import type {
  ProductOption,
  ProductVariant,
  ShopifyProduct,
  ShopifyProductDetail,
} from "./queries";

const PLACEHOLDER_OPTIONS: ProductOption[] = [
  { name: "Couleur", values: ["Noir", "Camel", "Ivoire"] },
  { name: "Taille", values: ["XS", "S", "M", "L", "XL"] },
];

function buildPlaceholderVariants(
  basePrice: string,
  index: number,
): ProductVariant[] {
  const variants: ProductVariant[] = [];

  for (const color of PLACEHOLDER_OPTIONS[0].values) {
    for (const size of PLACEHOLDER_OPTIONS[1].values) {
      variants.push({
        id: `placeholder-variant-${index}-${color}-${size}`,
        availableForSale: true,
        price: basePrice,
        selectedOptions: [
          { name: "Couleur", value: color },
          { name: "Taille", value: size },
        ],
      });
    }
  }

  return variants;
}

const placeholderCatalog: Omit<ShopifyProduct, "id">[] = [
  {
    title: "Pull ouvert",
    handle: "pull-ouvert",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Pull ouvert en cachemire",
    price: "319,00 €",
    colorCount: 5,
    productType: "Pulls",
    tags: ["pull", "cachemire"],
  },
  {
    title: "Pantalon long",
    handle: "pantalon-long",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Pantalon long en cachemire",
    price: "369,00 €",
    colorCount: 3,
    productType: "Pantalons",
    tags: ["pantalon", "cachemire"],
  },
  {
    title: "Robe droite",
    handle: "robe-droite",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Robe droite en cachemire",
    price: "459,00 €",
    colorCount: 3,
    productType: "Robes",
    tags: ["robe", "cachemire"],
  },
  {
    title: "Pull col V",
    handle: "pull-col-v",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Pull col V en cachemire",
    price: "359,00 €",
    colorCount: 6,
    productType: "Pulls",
    tags: ["pull", "cachemire"],
  },
  {
    title: "Pull torsadé",
    handle: "pull-torsade",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Pull torsadé en cachemire",
    price: "499,00 €",
    colorCount: 4,
    productType: "Pulls",
    tags: ["pull", "cachemire"],
  },
  {
    title: "Jupe longue",
    handle: "jupe-longue",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Jupe longue en cachemire",
    price: "519,00 €",
    colorCount: 3,
    productType: "Robes",
    tags: ["jupe", "cachemire"],
  },
  {
    title: "Poncho",
    handle: "poncho",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ.png",
    imageAlt: "Poncho en cachemire",
    price: "489,00 €",
    colorCount: 3,
    productType: "Pulls",
    tags: ["poncho", "cachemire"],
  },
  {
    title: "Écharpes unies",
    handle: "echarpes-unies",
    imageUrl: "/images/unsplash_mjtLS0CDuIQ-1.png",
    imageAlt: "Écharpe unie en cachemire",
    price: "219,00 €",
    colorCount: 5,
    productType: "Écharpes",
    tags: ["écharpe", "cachemire"],
  },
];

export function getPlaceholderProductByHandle(
  handle: string,
): ShopifyProductDetail | null {
  const index = placeholderCatalog.findIndex(
    (product) => product.handle === handle,
  );

  if (index < 0) return null;

  const product = placeholderCatalog[index];

  return {
    id: `placeholder-${index}`,
    ...product,
    description:
      "Pièce en cachemire d'exception, sélectionnée pour sa douceur et sa pureté. Fabriquée avec un savoir-faire exigeant, issue des hauts plateaux de Mongolie.",
    descriptionHtml:
      "<p>Pièce en cachemire d'exception, sélectionnée pour sa douceur et sa pureté. Fabriquée avec un savoir-faire exigeant, issue des hauts plateaux de Mongolie.</p>",
    options: PLACEHOLDER_OPTIONS,
    variants: buildPlaceholderVariants(product.price, index),
  };
}

export function getPlaceholderProducts(limit?: number): ShopifyProduct[] {
  const items =
    limit && limit > placeholderCatalog.length
      ? [...placeholderCatalog, ...placeholderCatalog]
      : placeholderCatalog;

  const slice = limit ? items.slice(0, limit) : items;

  return slice.map((product, index) => ({
    id: `placeholder-${index}`,
    ...product,
  }));
}
