import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/lib/i18n/config";

export type SanitySlug = {
  current: string;
};

export type SanityImage = {
  _type: "image";
  alt?: string;
  asset?: {
    _ref: string;
    _type: "reference";
  };
};

export type SanityHotspotImage = SanityImage & {
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  // Base64 blur preview, projected from the asset metadata by the query.
  lqip?: string;
};

export type HomePageContent = {
  saleCardImage?: SanityHotspotImage;
  bestsellersCardImage?: SanityHotspotImage;
  storyBannerImage?: SanityHotspotImage;
  newInCardImage?: SanityHotspotImage;
  boutiqueVisitImage?: SanityHotspotImage;
};

export type ArticleTranslation = {
  language: Locale;
  slug: string;
};

export type JournalArticleListItem = {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: SanitySlug;
  language: Locale;
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImage;
  author?: { name?: string };
  categories?: { title?: string }[];
};

export type JournalArticle = JournalArticleListItem & {
  body?: PortableTextBlock[];
  /** Every language version, this one included; null until it has any. */
  translations?: ArticleTranslation[] | null;
};
