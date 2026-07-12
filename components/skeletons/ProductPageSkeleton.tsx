export default function ProductPageSkeleton() {
  return (
    <main className="w-full overflow-x-hidden pt-24 md:pt-0">
      <section className="grid gap-8 md:grid-cols-2 md:gap-0">
        <div className="aspect-4/5 animate-pulse bg-black/5 md:min-h-svh" />
        <div className="flex flex-col justify-center px-4 py-8 md:px-12 md:py-16 lg:px-20">
          <div className="h-8 w-2/3 animate-pulse bg-black/5" />
          <div className="mt-4 h-4 w-24 animate-pulse bg-black/5" />
          <div className="mt-8 space-y-2">
            <div className="h-3 w-full animate-pulse bg-black/5" />
            <div className="h-3 w-full animate-pulse bg-black/5" />
            <div className="h-3 w-4/5 animate-pulse bg-black/5" />
          </div>
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="size-8 animate-pulse bg-black/5" />
            ))}
          </div>
          <div className="mt-10 h-12 w-full max-w-xs animate-pulse bg-black/5" />
        </div>
      </section>
    </main>
  );
}
