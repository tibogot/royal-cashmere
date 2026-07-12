export default function JournalArticleLoading() {
  return (
    <main className="w-full">
      <article>
        <header className="bg-white px-4 pt-24 pb-12 text-black md:px-8 md:pt-28 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-3">
              <div className="h-3 w-20 animate-pulse bg-black/5" />
              <div className="h-3 w-24 animate-pulse bg-black/5" />
            </div>
            <div className="mt-6 h-10 w-full max-w-2xl animate-pulse bg-black/5 md:h-14" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full animate-pulse bg-black/5" />
              <div className="h-4 w-4/5 animate-pulse bg-black/5" />
            </div>
          </div>
        </header>

        <div className="relative mx-auto aspect-4/5 w-full max-w-4xl animate-pulse bg-black/5 md:aspect-16/10" />

        <section className="bg-white px-4 py-16 text-black md:px-8 md:py-20">
          <div className="mx-auto max-w-2xl space-y-3">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="h-3 w-full animate-pulse bg-black/5" />
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
