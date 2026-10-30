import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n/config";
import EnCgvContent from "./en/CgvContent";
import EnCookiesContent from "./en/CookiesContent";
import EnMentionsLegalesContent from "./en/MentionsLegalesContent";
import EnPolitiqueConfidentialiteContent from "./en/PolitiqueConfidentialiteContent";
import FrCgvContent from "./fr/CgvContent";
import FrCookiesContent from "./fr/CookiesContent";
import FrMentionsLegalesContent from "./fr/MentionsLegalesContent";
import FrPolitiqueConfidentialiteContent from "./fr/PolitiqueConfidentialiteContent";
import NlCgvContent from "./nl/CgvContent";
import NlCookiesContent from "./nl/CookiesContent";
import NlMentionsLegalesContent from "./nl/MentionsLegalesContent";
import NlPolitiqueConfidentialiteContent from "./nl/PolitiqueConfidentialiteContent";

/**
 * The legal texts, one component per page and language.
 *
 * Written out per language rather than through the dictionaries: a legal text
 * is a document whose sentences, links and clauses are drafted as a whole, and
 * a translation may need to word a clause differently. The French is the
 * reference; the others mirror its sections one for one.
 */
export const legalContent: Record<
  "terms" | "privacy" | "legalNotice" | "cookies",
  Record<Locale, ComponentType>
> = {
  terms: { fr: FrCgvContent, nl: NlCgvContent, en: EnCgvContent },
  privacy: {
    fr: FrPolitiqueConfidentialiteContent,
    nl: NlPolitiqueConfidentialiteContent,
    en: EnPolitiqueConfidentialiteContent,
  },
  legalNotice: {
    fr: FrMentionsLegalesContent,
    nl: NlMentionsLegalesContent,
    en: EnMentionsLegalesContent,
  },
  cookies: {
    fr: FrCookiesContent,
    nl: NlCookiesContent,
    en: EnCookiesContent,
  },
};
