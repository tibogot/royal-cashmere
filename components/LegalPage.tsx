type LegalPageProps = {
  title: string;
};

export default function LegalPage({ title }: LegalPageProps) {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl uppercase leading-[1.12] md:text-6xl">
            {title}
          </h1>
          <p className="mt-8 text-sm text-black/70 md:text-base">
            Cette page sera complétée prochainement.
          </p>
        </div>
      </section>
    </main>
  );
}
