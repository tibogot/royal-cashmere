import { ALL_PRODUCTS_HANDLE } from "@/lib/collection-handles";

/**
 * Paths without their language. `LocaleLink` (and `withLocale` on the server)
 * puts `/fr`, `/nl` or `/en` in front. The French slugs these replaced are
 * permanently redirected in proxy.ts — see LEGACY_PATHS.
 */
export const routes = {
  home: "/",
  about: "/about",
  journal: "/journal",
  shop: `/collection/${ALL_PRODUCTS_HANDLE}`,
  contact: "/contact",
  search: "/search",
  signIn: "/sign-in",
  account: "/account",
  authLogin: "/api/auth/login",
  authLogout: "/api/auth/logout",
  cart: "/cart",
  wishlist: "/wishlist",
  legal: "/legal-notice",
  privacy: "/privacy-policy",
  terms: "/terms",
  cookies: "/cookies",
  collectionByHandle: (handle: string) => `/collection/${handle}`,
  journalArticle: (slug: string) => `/journal/${slug}`,
  product: (handle: string, options?: { color?: string }) => {
    const path = `/products/${handle}`;
    if (!options?.color) return path;

    return `${path}?couleur=${encodeURIComponent(options.color)}`;
  },
} as const;
