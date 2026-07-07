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
