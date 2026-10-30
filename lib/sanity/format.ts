import type { Locale } from "@/lib/i18n/config";
import { formatLongDate } from "@/lib/i18n/format";

export function formatArticleDate(locale: Locale, value: string) {
  return formatLongDate(locale, value);
}
