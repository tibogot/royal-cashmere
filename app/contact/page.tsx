import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contactez Royal Cashmere à Uccle, Bruxelles. Boutique de cachemire d'exception — adresse, horaires et téléphone.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
            Contact
          </h1>

          <p className="mx-auto mt-8 max-w-lg text-sm text-black/70 md:mt-10 md:text-base">
            Notre équipe vous accueille en boutique pour vous conseiller et
            vous faire découvrir nos collections en cachemire et soie.
          </p>

          <div className="mt-12 space-y-8 text-left md:mt-16">
            <div>
              <p className="text-xs uppercase tracking-wide text-black/50">
                Adresse
              </p>
              <p className="mt-2 text-sm md:text-base">
                Chaussée de Waterloo 1251B
                <br />
                Uccle, Belgique
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-black/50">
                Téléphone
              </p>
              <a
                href="tel:+3228505944"
                className="mt-2 inline-block text-sm transition-opacity hover:opacity-60 md:text-base"
              >
                +32 2 850 59 44
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-black/50">
                Horaires d&apos;ouverture
              </p>
              <p className="mt-2 text-sm md:text-base">
                Du lundi au vendredi de 10 h à 18 h
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
