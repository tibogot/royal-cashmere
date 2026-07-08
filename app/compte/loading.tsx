export default function AccountLoading() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="sr-only">Mon compte — Royal Cashmere</h1>

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <div className="space-y-10 text-left">
            <div className="space-y-4">
              <div className="h-8 w-40 animate-pulse bg-black/5" />
              <div className="h-4 max-w-md animate-pulse bg-black/5" />
              <div className="h-4 max-w-sm animate-pulse bg-black/5" />
            </div>

            <div className="space-y-3 border-t border-black/10 pt-8">
              <div className="h-3 w-16 animate-pulse bg-black/5" />
              <div className="h-5 w-48 animate-pulse bg-black/5" />
              <div className="h-4 w-56 animate-pulse bg-black/5" />
            </div>

            <p className="border-t border-black/10 pt-8 text-sm text-black/50">
              Chargement…
            </p>
          </div>

          <div className="relative min-h-80 w-full animate-pulse bg-black/5 md:min-h-[calc(100svh-7rem)]" />
        </div>
      </section>
    </main>
  );
}
