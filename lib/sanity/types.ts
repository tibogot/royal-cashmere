import type { PortableTextBlock } from "@portabletext/types";

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
};

export type JournalArticleListItem = {
  _id: string;
  title: string;
  slug: SanitySlug;
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImage;
  author?: { name?: string };
  categories?: { title?: string }[];
};

export type JournalArticle = JournalArticleListItem & {
  body?: PortableTextBlock[];
};
