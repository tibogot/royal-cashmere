export const routes = {
  home: "/",
  about: "/a-propos",
  shop: "/boutique",
  collection: "/collection",
  contact: "/contact",
  search: "/recherche",
  signIn: "/connexion",
  account: "/compte",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  cart: "/panier",
  legal: "/mentions-legales",
  privacy: "/politique-de-confidentialite",
  terms: "/cgv",
  cookies: "/cookies",
  collectionsAll: "/boutique",
  collectionByHandle: (handle: string) => `/collection/${handle}`,
  product: (handle: string, options?: { color?: string }) => {
    const path = `/products/${handle}`;
    if (!options?.color) return path;

    return `${path}?couleur=${encodeURIComponent(options.color)}`;
  },
} as const;
