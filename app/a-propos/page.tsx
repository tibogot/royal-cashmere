import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Découvrez l'histoire de Royal Cashmere, maison de cachemire d'exception à Uccle, Bruxelles. Savoir-faire, durabilité et pièces en pur cachemire de Mongolie.",
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
          src="/images/ekaterina-grosheva.jpg"
          alt="Atelier Royal Cashmere à Uccle"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </section>

      <section className="bg-white px-4 py-16 text-left text-black md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm leading-relaxed text-black/80 md:text-base">
            Fondée à Uccle, Royal Cashmere est née d&apos;une conviction simple :
            proposer un cachemire d&apos;exception, sélectionné à la source sur
            les hauts plateaux de Mongolie, et travaillé avec une exigence
            artisanale jusqu&apos;à la dernière finition.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Dans notre boutique de la chaussée de Waterloo, nous accueillons
            chaque visite comme une rencontre. Nous prenons le temps de
            conseiller, d&apos;écouter et de partager notre passion pour des
            matières nobles — cachemire, soie — et pour des pièces conçues pour
            durer, saison après saison.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Chaque création reflète notre engagement envers la qualité, la
            durabilité et une élégance discrète. C&apos;est cette vision qui
            guide notre maison, entre savoir-faire mongol et art de vivre
            bruxellois.
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
          <p className="text-sm leading-relaxed text-black/80 md:text-base">
            Sur les hauts plateaux de Mongolie, le cachemire naît d&apos;un
            lien ancestral entre les éleveurs, les troupeaux de chèvres et des
            paysages d&apos;une beauté austère. C&apos;est là, à plus de 4 000
            mètres d&apos;altitude, que se tisse l&apos;histoire de la fibre la
            plus précieuse au monde.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            Nous sélectionnons nos matières au plus près de la source, en
            privilégiant des filières respectueuses des éleveurs et de leur
            environnement. Chaque lot de cachemire est choisi pour sa finesse, sa
            longueur de fibre et sa douceur exceptionnelle — les critères qui
            font toute la différence dans une pièce finie.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-black/80 md:text-base">
            De ces steppes immenses à notre atelier d&apos;Uccle, nous préservons
            l&apos;intégrité de la matière première. C&apos;est ce voyage, entre
            tradition nomade et exigence contemporaine, qui donne à Royal
            Cashmere son caractère unique.
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
          Un savoir-faire transmis avec exigence, pour des pièces qui
          traversent le temps.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm text-black/70 md:mt-10 md:text-base">
          De la sélection des fibres mongoles à la finition dans notre atelier
          d&apos;Uccle, nous cultivons une approche attentive à chaque étape.
          Royal Cashmere, c&apos;est une vision du luxe sobre, durable et
          profondément humaine.
        </p>

        <Link
          href={routes.shop}
          className="mt-10 inline-block font-sans text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60 md:mt-12"
        >
          Explorer la boutique
        </Link>
      </section>
    </main>
  );
}
