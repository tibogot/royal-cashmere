export default function CollectionsLoading() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-64 animate-pulse bg-black/5" />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-4/5 animate-pulse bg-black/5" />
                <div className="h-4 w-1/2 animate-pulse bg-black/5" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
