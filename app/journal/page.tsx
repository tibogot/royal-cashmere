import JournalArticleCard from "@/components/JournalArticleCard";
import { createPageMetadata } from "@/lib/seo";
import { getJournalArticles } from "@/lib/sanity/queries";

export const metadata = createPageMetadata({
  title: "Journal",
  description:
    "Le journal Royal Cashmere : conseils d'entretien, savoir-faire cachemire et histoire de la fibre mongole.",
  path: "/journal",
});

export default async function JournalPage() {
  const articles = await getJournalArticles();

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-16 text-black md:px-8 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
            Journal
          </h1>
          <p className="mx-auto mt-8 max-w-xl font-serif text-sm leading-relaxed text-black/70 md:text-base">
            Conseils, savoir-faire et inspirations autour du cachemire d&apos;exception.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 md:px-8 md:pb-32">
        {articles.length > 0 ? (
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
            {articles.map((article) => (
              <JournalArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-xl text-center font-serif text-sm text-black/70 md:text-base">
            Aucun article pour le moment. Revenez bientôt.
          </p>
        )}
      </section>
    </main>
  );
}
