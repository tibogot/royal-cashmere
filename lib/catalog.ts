import type { ShopifyProduct } from "@/lib/shopify/queries";

// The shop's category tree. These collections aren't set up in Shopify: each
// page is built from every product, sorted by its product type and tags.
//
// Tagging in Shopify:
// - Audience: no tag = femme, `homme` = homme only, `mixte` = both sides.
//   Mixed pieces appear in the femme and the homme collections, while the
//   product itself keeps a single URL.
// - Kind: the product type (Pull, Gilet, Robe, Jupe, Pantalon, Écharpe,
//   Bonnet, Gants) or the same word as a tag. Add `col-roule` to turtlenecks.
// - Accessories are unisex and listed once, whatever the audience tag.

type CatalogProduct = Pick<ShopifyProduct, "title" | "productType" | "tags">;

export type CatalogCollection = {
  handle: string;
  // Short name for menus and the category links: "Pulls".
  label: string;
  // H1 and meta title, worded like the search it should rank for.
  title: string;
  description: string;
  intro: string;
  matches: (product: CatalogProduct) => boolean;
};

export type CatalogSection = CatalogCollection & {
  image: string;
  imageAlt: string;
  children: CatalogCollection[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .toLowerCase();
}

function productTerms(product: CatalogProduct) {
  return new Set([product.productType, ...product.tags].map(normalize));
}

function hasTerm(product: CatalogProduct, terms: readonly string[]) {
  const productTermSet = productTerms(product);
  return terms.some((term) => productTermSet.has(term));
}

const WOMEN_TERMS = ["femme", "pour femme"];
const MEN_TERMS = ["homme", "pour homme"];
const UNISEX_TERMS = ["mixte", "unisexe", "unisex"];

function isUnisex(product: CatalogProduct) {
  return (
    hasTerm(product, UNISEX_TERMS) ||
    (hasTerm(product, WOMEN_TERMS) && hasTerm(product, MEN_TERMS))
  );
}

// Untagged pieces are women's: most of the catalog is.
function isForWomen(product: CatalogProduct) {
  return isUnisex(product) || !hasTerm(product, MEN_TERMS);
}

function isForMen(product: CatalogProduct) {
  return isUnisex(product) || hasTerm(product, MEN_TERMS);
}

const KIND_TERMS = {
  pull: ["pull", "pulls", "sweater", "poncho", "ponchos"],
  gilet: ["gilet", "gilets", "cardigan", "cardigans"],
  robe: ["robe", "robes"],
  jupe: ["jupe", "jupes"],
  pantalon: ["pantalon", "pantalons"],
  echarpe: [
    "echarpe",
    "echarpes",
    "etole",
    "etoles",
    "chale",
    "chales",
    "foulard",
    "foulards",
    "scarf",
  ],
  bonnet: ["bonnet", "bonnets"],
  gants: ["gant", "gants", "mitaines"],
} as const;

type Kind = keyof typeof KIND_TERMS;

function isKind(product: CatalogProduct, kind: Kind) {
  return hasTerm(product, KIND_TERMS[kind]);
}

function isTurtleneck(product: CatalogProduct) {
  return (
    hasTerm(product, ["col roule", "col roules"]) ||
    normalize(product.title).includes("col roule")
  );
}

export const ACCESSORIES_SECTION_HANDLE = "accessoires";

function section(
  config: Omit<CatalogSection, "matches">,
): CatalogSection {
  return {
    ...config,
    // A section lists everything its sub-collections do, so a product's
    // breadcrumb always leads to pages that contain it.
    matches: (product) =>
      config.children.some((child) => child.matches(product)),
  };
}

export const catalogSections: CatalogSection[] = [
  section({
    handle: "femme",
    label: "Femme",
    title: "Vêtements en cachemire pour femme",
    description:
      "Pulls, gilets, robes, jupes et pantalons en pur cachemire de Mongolie pour femme. Découvrez la collection Royal Cashmere en ligne et en boutique à Uccle, Bruxelles.",
    intro:
      "Pulls, gilets, robes, jupes et pantalons en pur cachemire de Mongolie, pensés pour durer d'une saison à l'autre. Chaque pièce est choisie pour sa douceur et la qualité de sa fibre.",
    image: "/images/shared/pull-et-pantalon.jpg",
    imageAlt: "Pull et pantalon en cachemire pour femme Royal Cashmere",
    children: [
      {
        handle: "pulls-femme",
        label: "Pulls",
        title: "Pulls en cachemire pour femme",
        description:
          "Pulls en cachemire pour femme : col roulé, col V, col rond, coupes amples ou ajustées. Pur cachemire de Mongolie, boutique à Uccle, Bruxelles.",
        intro:
          "Col roulé, col V ou col rond : nos pulls en pur cachemire de Mongolie allient chaleur et légèreté. Une pièce essentielle, à porter seule ou en superposition.",
        matches: (product) => isForWomen(product) && isKind(product, "pull"),
      },
      {
        handle: "pulls-col-roule-femme",
        label: "Col roulé",
        title: "Pulls col roulé en cachemire pour femme",
        description:
          "Pulls col roulé en cachemire pour femme : la chaleur du pur cachemire de Mongolie au plus près du cou. Collection Royal Cashmere, Uccle, Bruxelles.",
        intro:
          "Le col roulé en cachemire protège du froid sans épaissir la silhouette. Un classique de l'hiver, en pur cachemire de Mongolie.",
        matches: (product) =>
          isForWomen(product) &&
          isKind(product, "pull") &&
          isTurtleneck(product),
      },
      {
        handle: "gilets-femme",
        label: "Gilets",
        title: "Gilets et cardigans en cachemire pour femme",
        description:
          "Gilets et cardigans en cachemire pour femme, à boutons ou ouverts. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Boutonnés ou ouverts, nos gilets en cachemire se superposent facilement et accompagnent les journées de mi-saison comme les soirées d'hiver.",
        matches: (product) => isForWomen(product) && isKind(product, "gilet"),
      },
      {
        handle: "robes-cachemire",
        label: "Robes",
        title: "Robes en cachemire",
        description:
          "Robes en cachemire pour femme : maille douce et fluide en pur cachemire de Mongolie. Collection Royal Cashmere, boutique à Uccle, Bruxelles.",
        intro:
          "La douceur d'un pull, l'allure d'une robe. Nos robes en maille de cachemire se portent du bureau au dîner, en toute saison froide.",
        matches: (product) => isForWomen(product) && isKind(product, "robe"),
      },
      {
        handle: "jupes-cachemire",
        label: "Jupes",
        title: "Jupes en cachemire",
        description:
          "Jupes en cachemire pour femme, longues ou mi-longues. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Une jupe en maille de cachemire, souple et chaude, qui s'associe naturellement à nos pulls pour une silhouette tout en douceur.",
        matches: (product) => isForWomen(product) && isKind(product, "jupe"),
      },
      {
        handle: "pantalons-femme",
        label: "Pantalons",
        title: "Pantalons en cachemire pour femme",
        description:
          "Pantalons en cachemire pour femme, droits ou larges. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Confortables comme un vêtement d'intérieur, assez élégants pour sortir : nos pantalons en cachemire s'assortissent à nos pulls pour un ensemble complet.",
        matches: (product) =>
          isForWomen(product) && isKind(product, "pantalon"),
      },
    ],
  }),
  section({
    handle: "homme",
    label: "Homme",
    title: "Vêtements en cachemire pour homme",
    description:
      "Pulls et gilets en pur cachemire de Mongolie pour homme. Découvrez la collection Royal Cashmere en ligne et en boutique à Uccle, Bruxelles.",
    intro:
      "Des pulls et des gilets en pur cachemire de Mongolie, aux coupes sobres et intemporelles. Plusieurs pièces sont mixtes : consultez le guide des tailles sur chaque fiche.",
    image: "/images/categories/pulls.jpg",
    imageAlt: "Pull en cachemire pour homme Royal Cashmere",
    children: [
      {
        handle: "pulls-homme",
        label: "Pulls",
        title: "Pulls en cachemire pour homme",
        description:
          "Pulls en cachemire pour homme : col roulé, col V, col rond. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Col roulé, col V ou col rond : des pulls en pur cachemire de Mongolie, chauds et légers, à porter au quotidien comme sous une veste.",
        matches: (product) => isForMen(product) && isKind(product, "pull"),
      },
      {
        handle: "pulls-col-roule-homme",
        label: "Col roulé",
        title: "Pulls col roulé en cachemire pour homme",
        description:
          "Pulls col roulé en cachemire pour homme, en pur cachemire de Mongolie. Collection Royal Cashmere, boutique à Uccle, Bruxelles.",
        intro:
          "Le col roulé en cachemire, seul ou sous un manteau : une pièce de caractère, en pur cachemire de Mongolie.",
        matches: (product) =>
          isForMen(product) && isKind(product, "pull") && isTurtleneck(product),
      },
      {
        handle: "gilets-homme",
        label: "Gilets",
        title: "Gilets et cardigans en cachemire pour homme",
        description:
          "Gilets et cardigans en cachemire pour homme. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Un gilet en cachemire remplace aisément une veste les jours de mi-saison. Coupes sobres, pur cachemire de Mongolie.",
        matches: (product) => isForMen(product) && isKind(product, "gilet"),
      },
      {
        handle: "pantalons-homme",
        label: "Pantalons",
        title: "Pantalons en cachemire pour homme",
        description:
          "Pantalons en cachemire pour homme. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Le confort du cachemire dans un pantalon à la coupe nette, à porter chez soi comme en ville.",
        matches: (product) => isForMen(product) && isKind(product, "pantalon"),
      },
    ],
  }),
  section({
    handle: ACCESSORIES_SECTION_HANDLE,
    label: "Accessoires",
    title: "Accessoires en cachemire",
    description:
      "Écharpes, bonnets et gants en pur cachemire de Mongolie, pour homme et femme. Accessoires Royal Cashmere, boutique à Uccle, Bruxelles.",
    intro:
      "Écharpes, bonnets et gants en pur cachemire de Mongolie, pour homme et femme. Les accessoires idéaux pour se protéger du froid, ou pour offrir.",
    image: "/images/categories/echarpes.jpg",
    imageAlt: "Écharpe en cachemire Royal Cashmere",
    children: [
      {
        handle: "echarpes-cachemire",
        label: "Écharpes",
        title: "Écharpes en cachemire",
        description:
          "Écharpes et étoles en cachemire pour homme et femme, unies ou à motifs. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Écharpes et étoles en pur cachemire de Mongolie, pour homme et femme. Légères, chaudes et douces au contact de la peau.",
        matches: (product) => isKind(product, "echarpe"),
      },
      {
        handle: "bonnets-cachemire",
        label: "Bonnets",
        title: "Bonnets en cachemire",
        description:
          "Bonnets en cachemire pour homme et femme. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Des bonnets en pur cachemire de Mongolie, pour homme et femme : toute la chaleur du cachemire, sans gratter.",
        matches: (product) => isKind(product, "bonnet"),
      },
      {
        handle: "gants-cachemire",
        label: "Gants",
        title: "Gants en cachemire",
        description:
          "Gants et mitaines en cachemire pour homme et femme. Pur cachemire de Mongolie, boutique Royal Cashmere à Uccle, Bruxelles.",
        intro:
          "Gants et mitaines en pur cachemire de Mongolie, pour homme et femme, à assortir à votre écharpe ou à votre bonnet.",
        matches: (product) => isKind(product, "gants"),
      },
    ],
  }),
];

export type CatalogMatch = {
  section: CatalogSection;
  // Undefined when the handle is the section itself.
  collection?: CatalogCollection;
};

export function findCatalogCollection(handle: string): CatalogMatch | null {
  for (const catalogSection of catalogSections) {
    if (catalogSection.handle === handle) return { section: catalogSection };

    const collection = catalogSection.children.find(
      (child) => child.handle === handle,
    );
    if (collection) return { section: catalogSection, collection };
  }

  return null;
}

export function isCatalogHandle(handle: string) {
  return findCatalogCollection(handle) !== null;
}

// The collection a product's breadcrumb leads back to: its first match in
// menu order, so mixed pieces sit under Femme, and a turtleneck under Pulls
// rather than Col roulé.
export function getPrimaryCatalogCollection(
  product: CatalogProduct,
): Required<CatalogMatch> | null {
  for (const catalogSection of catalogSections) {
    const collection = catalogSection.children.find((child) =>
      child.matches(product),
    );
    if (collection) return { section: catalogSection, collection };
  }

  return null;
}

// What menus need: sections and sub-collections that have products, with no
// matching functions, so it can go through the /api/collections JSON.
export type CatalogNavLink = {
  handle: string;
  label: string;
};

export type CatalogNavSection = CatalogNavLink & {
  image: string;
  imageAlt: string;
  children: CatalogNavLink[];
};

// Everything the navbar menus link to: the category tree, plus Shopify
// collections (Nouveautés, Soldes…) that exist and have products.
export type ShopNav = {
  sections: CatalogNavSection[];
  collections: CatalogNavLink[];
};

export function buildCatalogNav(
  products: CatalogProduct[],
): CatalogNavSection[] {
  const hasProducts = (collection: CatalogCollection) =>
    products.some((product) => collection.matches(product));

  return catalogSections.filter(hasProducts).map((catalogSection) => ({
    handle: catalogSection.handle,
    label: catalogSection.label,
    image: catalogSection.image,
    imageAlt: catalogSection.imageAlt,
    children: catalogSection.children
      .filter(hasProducts)
      .map(({ handle, label }) => ({ handle, label })),
  }));
}
