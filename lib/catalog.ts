import type { Dictionary } from "@/lib/i18n/dictionaries";
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
//
// The copy (menu labels, H1s, meta descriptions, intros, image alts) lives in
// the dictionaries, keyed by handle: `catalog.labels` (shipped to the client
// for the menus) and `collection.pages` / `collection.imageAlts` (server only).

type CatalogProduct = Pick<ShopifyProduct, "title" | "productType" | "tags">;

// Every handle in the tree must have its copy in French, or this won't compile.
type CatalogHandle = keyof Dictionary["catalog"]["labels"] &
  keyof Dictionary["collection"]["pages"];
type CatalogSectionHandle = CatalogHandle &
  keyof Dictionary["collection"]["imageAlts"];

export type CatalogCopy = Pick<Dictionary, "catalog" | "collection">;

type CatalogNode = {
  handle: CatalogHandle;
  matches: (product: CatalogProduct) => boolean;
};

type CatalogSectionNode = CatalogNode & {
  handle: CatalogSectionHandle;
  image: string;
  children: CatalogNode[];
};

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
  config: Omit<CatalogSectionNode, "matches">,
): CatalogSectionNode {
  return {
    ...config,
    // A section lists everything its sub-collections do, so a product's
    // breadcrumb always leads to pages that contain it.
    matches: (product) =>
      config.children.some((child) => child.matches(product)),
  };
}

const catalogTree: CatalogSectionNode[] = [
  section({
    handle: "femme",
    image: "/images/shared/pull-et-pantalon.jpg",
    children: [
      {
        handle: "pulls-femme",
        matches: (product) => isForWomen(product) && isKind(product, "pull"),
      },
      {
        handle: "pulls-col-roule-femme",
        matches: (product) =>
          isForWomen(product) &&
          isKind(product, "pull") &&
          isTurtleneck(product),
      },
      {
        handle: "gilets-femme",
        matches: (product) => isForWomen(product) && isKind(product, "gilet"),
      },
      {
        handle: "robes-cachemire",
        matches: (product) => isForWomen(product) && isKind(product, "robe"),
      },
      {
        handle: "jupes-cachemire",
        matches: (product) => isForWomen(product) && isKind(product, "jupe"),
      },
      {
        handle: "pantalons-femme",
        matches: (product) =>
          isForWomen(product) && isKind(product, "pantalon"),
      },
    ],
  }),
  section({
    handle: "homme",
    image: "/images/categories/pulls.jpg",
    children: [
      {
        handle: "pulls-homme",
        matches: (product) => isForMen(product) && isKind(product, "pull"),
      },
      {
        handle: "pulls-col-roule-homme",
        matches: (product) =>
          isForMen(product) && isKind(product, "pull") && isTurtleneck(product),
      },
      {
        handle: "gilets-homme",
        matches: (product) => isForMen(product) && isKind(product, "gilet"),
      },
      {
        handle: "pantalons-homme",
        matches: (product) => isForMen(product) && isKind(product, "pantalon"),
      },
    ],
  }),
  section({
    handle: ACCESSORIES_SECTION_HANDLE,
    image: "/images/categories/echarpes.jpg",
    children: [
      {
        handle: "echarpes-cachemire",
        matches: (product) => isKind(product, "echarpe"),
      },
      {
        handle: "bonnets-cachemire",
        matches: (product) => isKind(product, "bonnet"),
      },
      {
        handle: "gants-cachemire",
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

function describeCollection(
  node: CatalogNode,
  copy: CatalogCopy,
): CatalogCollection {
  return {
    ...node,
    label: copy.catalog.labels[node.handle],
    ...copy.collection.pages[node.handle],
  };
}

function describeSection(
  node: CatalogSectionNode,
  copy: CatalogCopy,
): CatalogSection {
  return {
    ...describeCollection(node, copy),
    image: node.image,
    imageAlt: copy.collection.imageAlts[node.handle],
    children: node.children.map((child) => describeCollection(child, copy)),
  };
}

function findCatalogNode(
  handle: string,
): { section: CatalogSectionNode; collection?: CatalogNode } | null {
  for (const catalogSection of catalogTree) {
    if (catalogSection.handle === handle) return { section: catalogSection };

    const collection = catalogSection.children.find(
      (child) => child.handle === handle,
    );
    if (collection) return { section: catalogSection, collection };
  }

  return null;
}

export function findCatalogCollection(
  handle: string,
  copy: CatalogCopy,
): CatalogMatch | null {
  const match = findCatalogNode(handle);
  if (!match) return null;

  return {
    section: describeSection(match.section, copy),
    collection: match.collection
      ? describeCollection(match.collection, copy)
      : undefined,
  };
}

export function isCatalogHandle(handle: string) {
  return findCatalogNode(handle) !== null;
}

// The collection a product's breadcrumb leads back to: its first match in
// menu order, so mixed pieces sit under Femme, and a turtleneck under Pulls
// rather than Col roulé.
export function getPrimaryCatalogCollection(
  product: CatalogProduct,
  copy: CatalogCopy,
): Required<CatalogMatch> | null {
  for (const catalogSection of catalogTree) {
    const collection = catalogSection.children.find((child) =>
      child.matches(product),
    );
    if (collection) {
      return {
        section: describeSection(catalogSection, copy),
        collection: describeCollection(collection, copy),
      };
    }
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
  copy: CatalogCopy,
): CatalogNavSection[] {
  const hasProducts = (collection: CatalogNode) =>
    products.some((product) => collection.matches(product));

  return catalogTree.filter(hasProducts).map((catalogSection) => ({
    handle: catalogSection.handle,
    label: copy.catalog.labels[catalogSection.handle],
    image: catalogSection.image,
    imageAlt: copy.collection.imageAlts[catalogSection.handle],
    children: catalogSection.children
      .filter(hasProducts)
      .map(({ handle }) => ({ handle, label: copy.catalog.labels[handle] })),
  }));
}

/**
 * A menu label in the reader's language. The /api/collections JSON is the
 * same for every language (French), so the client relabels the catalog's
 * handles; Shopify collections (Soldes…) keep their own title.
 */
export function catalogLabel(
  labels: Dictionary["catalog"]["labels"],
  handle: string,
  fallback: string,
) {
  return handle in labels ? labels[handle as CatalogHandle] : fallback;
}

export function localizeShopNav(
  nav: ShopNav,
  labels: Dictionary["catalog"]["labels"],
): ShopNav {
  const relabel = <T extends CatalogNavLink>(link: T): T => ({
    ...link,
    label: catalogLabel(labels, link.handle, link.label),
  });

  return {
    sections: nav.sections.map((navSection) => ({
      ...relabel(navSection),
      children: navSection.children.map(relabel),
    })),
    collections: nav.collections,
  };
}
