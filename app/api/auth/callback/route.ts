import { completeAuthorizationCallback } from "@/lib/shopify/customer-account/auth";
import {
  OAUTH_RETURN_TO_COOKIE,
  isCustomerAccountConfigured,
} from "@/lib/shopify/customer-account/config";
import { withLocale } from "@/lib/i18n/config";
import { requestLocale } from "@/lib/i18n/request-locale";
import { routes } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Read before the callback clears it: the return path carries the language
  // the customer started signing in from. The Referer here is Shopify's.
  const locale = requestLocale(
    request,
    request.cookies.get(OAUTH_RETURN_TO_COOKIE)?.value,
  );
  const signIn = withLocale(routes.signIn, locale);

  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(new URL(signIn, request.url));
  }

  try {
    const returnTo = await completeAuthorizationCallback(
      request.nextUrl.searchParams,
    );
    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch {
    const errorUrl = new URL(signIn, request.url);
    errorUrl.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(errorUrl);
  }
}
