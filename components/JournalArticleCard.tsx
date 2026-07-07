import SanityImage from "@/components/SanityImage";
import { formatArticleDate } from "@/lib/sanity/format";
import { routes } from "@/lib/routes";
import type { JournalArticleListItem } from "@/lib/sanity/types";
import Link from "next/link";

type JournalArticleCardProps = {
  article: JournalArticleListItem;
};

export default function JournalArticleCard({ article }: JournalArticleCardProps) {
  const category = article.categories?.[0]?.title;

  return (
    <article className="group">
      <Link
        href={routes.journalArticle(article.slug.current)}
        className="block"
      >
        <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
          {article.mainImage ? (
            <SanityImage
              image={article.mainImage}
              alt={article.mainImage.alt ?? article.title}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : null}
        </div>

        <div className="mt-4 space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wide text-black/50">
            {category ? <span>{category}</span> : null}
            {category && article.publishedAt ? (
              <span aria-hidden="true">·</span>
            ) : null}
            {article.publishedAt ? (
              <time dateTime={article.publishedAt}>
                {formatArticleDate(article.publishedAt)}
              </time>
            ) : null}
          </div>

          <h2 className="font-serif text-xl leading-snug transition-opacity group-hover:opacity-70 md:text-2xl">
            {article.title}
          </h2>

          {article.excerpt ? (
            <p className="line-clamp-3 font-serif text-sm leading-relaxed text-black/70 md:text-base">
              {article.excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
