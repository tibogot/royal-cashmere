export const routes = {
  home: "/",
  home2: "/home2",
  about: "/a-propos",
  journal: "/journal",
  shop: "/boutique",
  collection: "/collection",
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
  collectionsAll: "/boutique",
  collectionByHandle: (handle: string) => `/collection/${handle}`,
  journalArticle: (slug: string) => `/journal/${slug}`,
  product: (handle: string, options?: { color?: string }) => {
    const path = `/products/${handle}`;
    if (!options?.color) return path;

    return `${path}?couleur=${encodeURIComponent(options.color)}`;
  },
} as const;
