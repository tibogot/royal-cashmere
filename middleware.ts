import { CUSTOMER_SESSION_COOKIE } from "@/lib/shopify/customer-account/config";
import { routes } from "@/lib/routes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = hasCustomerSessionCookie(request);

  if (pathname === routes.signIn && loggedIn) {
    return NextResponse.redirect(new URL(routes.account, request.url));
  }

  if (pathname === routes.account && !loggedIn) {
    return NextResponse.redirect(new URL(routes.signIn, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/connexion", "/compte"],
};
