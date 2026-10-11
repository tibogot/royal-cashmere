export default function JournalLoading() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-24 md:px-8 md:pt-28 md:pb-32">
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-4/5 animate-pulse bg-black/5" />
              <div className="h-4 w-3/4 animate-pulse bg-black/5" />
              <div className="h-3 w-full animate-pulse bg-black/5" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
