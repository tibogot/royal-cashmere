export default function AccountLoading() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          Mon compte
        </h1>

        <p className="mt-16 text-center text-sm text-black/50">Chargement…</p>
      </section>
    </main>
  );
}
