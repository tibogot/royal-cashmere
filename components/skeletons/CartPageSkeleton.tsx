export default function CartPageSkeleton() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Panier
        </h1>

        <div className="mx-auto mt-12 max-w-4xl">
          <ul className="divide-y divide-black/10 border-t border-black/10">
            {Array.from({ length: 2 }, (_, index) => (
              <li
                key={index}
                className="grid grid-cols-[96px_1fr_auto] items-start gap-6 py-8 md:grid-cols-[120px_1fr_auto]"
              >
                <div className="aspect-4/5 animate-pulse bg-black/5" />
                <div className="space-y-3">
                  <div className="h-4 w-48 animate-pulse bg-black/5" />
                  <div className="h-3 w-32 animate-pulse bg-black/5" />
                  <div className="h-8 w-24 animate-pulse bg-black/5" />
                </div>
                <div className="h-4 w-16 animate-pulse bg-black/5" />
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-6 border-t border-black/10 pt-8">
            <div className="flex items-center justify-between">
              <div className="h-4 w-12 animate-pulse bg-black/5" />
              <div className="h-4 w-20 animate-pulse bg-black/5" />
            </div>
            <div className="ml-auto h-12 w-48 animate-pulse bg-black/5" />
          </div>
        </div>
      </section>
    </main>
  );
}
