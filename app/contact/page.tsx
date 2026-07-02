import ContactForm from "@/components/ContactForm";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

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
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h1 className="font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
              Contact
            </h1>

            <p className="mx-auto mt-8 max-w-lg text-sm text-black/70 md:mt-10 md:text-base">
              Notre équipe vous accueille en boutique pour vous conseiller et
              vous faire découvrir nos collections en cachemire et soie.
            </p>
          </div>

          <div className="mt-16 grid gap-16 md:mt-20 md:grid-cols-2 md:gap-20">
            <ContactForm />

            <div className="space-y-8 text-left">
              <div>
                <p className="text-xs uppercase tracking-wide text-black/50">
                  Adresse
                </p>
                <p className="mt-2 font-serif text-sm md:text-base">
                  {siteConfig.contact.street}
                  <br />
                  {siteConfig.contact.city}, {siteConfig.contact.country}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-black/50">
                  Téléphone
                </p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="mt-2 inline-block font-serif text-sm transition-opacity hover:opacity-60 md:text-base"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>

              {siteConfig.contact.email ? (
                <div>
                  <p className="text-xs uppercase tracking-wide text-black/50">
                    E-mail
                  </p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-2 inline-block font-serif text-sm transition-opacity hover:opacity-60 md:text-base"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              ) : null}

              <div>
                <p className="text-xs uppercase tracking-wide text-black/50">
                  Horaires d&apos;ouverture
                </p>
                <p className="mt-2 font-serif text-sm md:text-base">
                  Du lundi au vendredi de 10 h à 18 h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
