import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  localeFromPath,
  type Locale,
} from "./config";

/**
 * The language of a request to a route outside `app/[lang]` — the auth
 * handlers — which has no segment to read one from.
 *
 * In order: the path the customer is heading back to, then the page they came
 * from, then the language they last picked on the switcher, then the default.
 */
export function requestLocale(
  request: NextRequest,
  returnPath?: string | null,
): Locale {
  const fromReturnPath = returnPath ? localeFromPath(returnPath) : null;
  if (fromReturnPath) return fromReturnPath;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const fromReferer = localeFromPath(new URL(referer).pathname);
      if (fromReferer) return fromReferer;
    } catch {
      // A malformed Referer is not worth failing a sign-in over.
    }
  }

  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(remembered) ? remembered : DEFAULT_LOCALE;
}
