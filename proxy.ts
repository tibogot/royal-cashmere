import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  localeFromPath,
  stripLocale,
} from "@/lib/i18n/config";
import { routes } from "@/lib/routes";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/shopify/customer-account/config";

/**
 * Puts a language on every URL that does not already have one, and keeps the
 * French URLs the site was indexed under working.
 *
 * This is `proxy.ts`, the Next 16 name for what used to be `middleware.ts`.
 *
 * Deliberately not content negotiation on `Accept-Language`: Googlebot crawls
 * with `en-US`, so it would only ever be shown English and the French pages —
 * the ones this shop ranks on — would drop out of the index.
 */

/**
 * The slugs the site shipped with before it went multilingual. Search engines
 * and old shared links still point here; a 308 carries their ranking across to
 * the new URL. Never remove an entry — the old URL lives on in backlinks.
 */
const LEGACY_PATHS: Record<string, string> = {
  "/a-propos": routes.about,
  "/cgv": routes.terms,
  "/compte": routes.account,
  "/connexion": routes.signIn,
  "/mentions-legales": routes.legal,
  "/panier": routes.cart,
  "/politique-de-confidentialite": routes.privacy,
  "/recherche": routes.search,
};

function hasCustomerSessionCookie(request: NextRequest): boolean {
  if (!process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID) return false;

  const raw = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!raw) return false;

  try {
    const session = JSON.parse(raw) as {
      accessToken?: string;
      refreshToken?: string;
    };

    return Boolean(session.accessToken && session.refreshToken);
  } catch {
    return false;
  }
}

function redirectTo(
  request: NextRequest,
  pathname: string,
  status: 307 | 308,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = localeFromPath(pathname);

  if (!locale) {
    // The bare domain is the one place a preference is honoured, and only from
    // a cookie this site set itself. A crawler has no cookie and always lands
    // on French. Temporary, because the answer depends on the visitor.
    if (pathname === "/") {
      const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
      return redirectTo(
        request,
        `/${isLocale(remembered) ? remembered : DEFAULT_LOCALE}`,
        307,
      );
    }

    // Every pre-multilingual URL was French, so it moves to /fr for good.
    const target = LEGACY_PATHS[pathname] ?? pathname;
    return redirectTo(request, `/${DEFAULT_LOCALE}${target}`, 308);
  }

  // The old French slugs, typed under a language prefix.
  const bare = stripLocale(pathname);
  const legacy = LEGACY_PATHS[bare];
  if (legacy) return redirectTo(request, `/${locale}${legacy}`, 308);

  // Signed-in customers skip the sign-in page, and signed-out ones never see
  // the account page. Temporary: the answer changes when the session does.
  if (bare === routes.signIn || bare === routes.account) {
    const loggedIn = hasCustomerSessionCookie(request);

    if (bare === routes.signIn && loggedIn) {
      return redirectTo(request, `/${locale}${routes.account}`, 307);
    }

    if (bare === routes.account && !loggedIn) {
      return redirectTo(request, `/${locale}${routes.signIn}`, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Skips Next's internals, API routes, the Studio (its own routing would never
   * mount under /fr), anything with a file extension, and the metadata routes
   * that must stay at fixed paths.
   */
  matcher: [
    "/((?!_next|api|studio|.*\\..*|icon|robots\\.txt|sitemap\\.xml).*)",
  ],
};
