export default function CatalogPageSkeleton() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <div className="mt-10 flex flex-col gap-6 border-b border-black/10 pb-6 md:mt-12 md:flex-row md:items-end md:justify-between">
          <div className="h-4 w-32 animate-pulse bg-black/5" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-4 w-16 animate-pulse bg-black/5" />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-4/5 animate-pulse bg-black/5" />
              <div className="h-3 w-3/4 animate-pulse bg-black/5" />
              <div className="h-3 w-1/3 animate-pulse bg-black/5" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
