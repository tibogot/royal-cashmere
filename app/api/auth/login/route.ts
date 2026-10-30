import { buildAuthorizationUrl } from "@/lib/shopify/customer-account/auth";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { localeFromPath, withLocale } from "@/lib/i18n/config";
import { requestLocale } from "@/lib/i18n/request-locale";
import { routes } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const returnTo = request.nextUrl.searchParams.get("return_to");
  const locale = requestLocale(request, returnTo);

  if (!isCustomerAccountConfigured()) {
    return NextResponse.redirect(
      new URL(withLocale(routes.signIn, locale), request.url),
    );
  }

  const safeReturnTo =
    returnTo?.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : routes.account;

  // The sign-in page links here with a bare path; the language it was read in
  // (from the Referer) is what the customer comes back to.
  const localisedReturnTo = localeFromPath(safeReturnTo)
    ? safeReturnTo
    : withLocale(safeReturnTo, locale);

  const authorizationUrl = await buildAuthorizationUrl(
    localisedReturnTo,
    localeFromPath(localisedReturnTo) ?? locale,
  );
  return NextResponse.redirect(authorizationUrl);
}
