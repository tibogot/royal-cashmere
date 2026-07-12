export default function WishlistPageSkeleton() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Wishlist
        </h1>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-12 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
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
