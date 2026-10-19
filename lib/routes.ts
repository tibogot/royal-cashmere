import { ALL_PRODUCTS_HANDLE } from "@/lib/collection-handles";

export const routes = {
  home: "/",
  about: "/a-propos",
  journal: "/journal",
  shop: `/collection/${ALL_PRODUCTS_HANDLE}`,
  contact: "/contact",
  search: "/recherche",
  signIn: "/connexion",
  account: "/compte",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  cart: "/panier",
  wishlist: "/wishlist",
  legal: "/mentions-legales",
  privacy: "/politique-de-confidentialite",
  terms: "/cgv",
  cookies: "/cookies",
  collectionByHandle: (handle: string) => `/collection/${handle}`,
  journalArticle: (slug: string) => `/journal/${slug}`,
  product: (handle: string, options?: { color?: string }) => {
    const path = `/products/${handle}`;
    if (!options?.color) return path;

    return `${path}?couleur=${encodeURIComponent(options.color)}`;
  },
} as const;
