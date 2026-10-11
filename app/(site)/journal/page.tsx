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
      <h1 className="sr-only">Journal</h1>

      <section className="bg-white px-4 pt-24 pb-24 md:px-8 md:pt-28 md:pb-32">
        {articles.length > 0 ? (
          <div className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
            {articles.map((article) => (
              <JournalArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-xl text-center font-serif text-sm text-black/70 md:text-base">
            Aucun article pour le moment. Revenez bientÃ´t.
          </p>
        )}
      </section>
    </main>
  );
}
