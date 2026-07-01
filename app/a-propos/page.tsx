import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import aboutHeroImage from "@/public/images/ekaterina-grosheva.jpg";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Royal Cashmere à Uccle, Bruxelles : histoire, savoir-faire et engagement durable. Cachemire et soie d'exception de la steppe mongole, boutique à la chaussée de Waterloo.",
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-center text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="mx-auto max-w-5xl font-serif text-5xl uppercase leading-[1.12] md:max-w-6xl md:text-8xl md:leading-[1.08]">
          Une maison de cachemire d&apos;exception, ancrée à Bruxelles
        </h1>
      </section>

      <section className="relative h-[80svh] w-full">
        <Image
          src={aboutHeroImage}
          alt="Atelier Royal Cashmere à Uccle"
          fill
          className="object-cover"
          sizes="100vw"
          quality={70}
          placeholder="blur"
          priority
        />
      </section>

      <section className="bg-white px-4 py-16 text-left text-black md:px-8">
        <div className="max-w-2xl">
          <h2 className="font-serif text-xl uppercase leading-snug md:text-2xl">
            Une maison où le luxe rencontre la raison d&apos;être
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Nous vous présentons Royal Cashmere, boutique de cachemire
            d&apos;exception à Uccle, à Bruxelles, où la durabilité
            s&apos;entrelace avec le style. Nous proposons des pièces
            exquises en cachemire et en soie, issues des paysages intemporels
            de la steppe mongole, et sélectionnées pour leur pureté et leur
            douceur incomparable.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Installés chaussée de Waterloo, nous accueillons chaque visite
            comme une rencontre. En choisissant Royal Cashmere, vous
            participez à une histoire qui soutient les éleveurs nomades et
            leurs terres ancestrales, tout en investissant dans un vestiaire
            intemporel, pensé pour durer.
          </p>
        </div>
      </section>

      <section className="relative h-svh w-full">
        <Image
          src="/images/fadhil-abhimantra.jpg"
          alt="Cachemire Royal Cashmere"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <section className="bg-white px-4 py-16 text-left text-black md:px-8">
        <div className="max-w-2xl">
          <h2 className="font-serif text-xl uppercase leading-snug md:text-2xl">
            Cachemire mongol, héritage nomade
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Sur les hauts plateaux de Mongolie, le cachemire naît d&apos;un lien
            ancestral entre les éleveurs, leurs troupeaux et des steppes d&apos;une
            beauté rare. Nous sélectionnons nos fibres à la source, en
            privilégiant des filières respectueuses des nomades et de leur
            environnement, pour un avenir durable des générations à venir.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Nos créations sont conçues avec une attention méticuleuse aux
            détails, garantissant une qualité inégalée, une grande douceur au
            toucher et une durabilité réelle au quotidien. Chaque pièce
            reflète notre engagement à préserver la beauté de la nature et à
            honorer le riche héritage de la culture nomade mongole.
          </p>
        </div>
      </section>

      <section className="relative h-svh w-full">
        <Image
          src="/images/Frame 49.jpg"
          alt="Collections Royal Cashmere"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </section>

      <section className="bg-white px-4 py-32 text-center text-black md:px-8">
        <h2 className="mx-auto max-w-4xl font-serif text-2xl uppercase leading-snug md:max-w-3xl md:text-3xl">
          Un style élégant et responsable, de la steppe mongole à Uccle
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm text-black/70 md:mt-10 md:text-base">
          De la sélection du cachemire mongol à la finition dans notre boutique
          bruxelloise, nous cultivons une approche exigeante à chaque étape.
          Rejoignez-nous et adoptez un style de vie raffiné, durable et
          profondément ancré dans le savoir-faire. Chaque achat chez Royal
          Cashmere est un pas vers un vestiaire plus beau, plus durable — pour
          vous, pour les nomades et pour la planète.
        </p>

        <Link
          href={routes.shop}
          className="mt-10 inline-block select-none font-sans text-xs uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60 md:mt-12"
        >
          Explorer la boutique
        </Link>
      </section>
    </main>
  );
}
