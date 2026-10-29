import { createPageMetadata } from "@/lib/seo";
import FadeInImage from "@/components/FadeInImage";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import SplitTextReveal from "@/components/SplitTextReveal";
import Image from "next/image";

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Royal Cashmere à Uccle, Bruxelles : histoire, savoir-faire et engagement durable. Cachemire et soie d'exception de la steppe mongole, boutique à la chaussée de Waterloo.",
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-10 text-center text-black md:px-8 md:pt-28 md:pb-16">
        <SplitTextReveal
          as="h1"
          hiddenUntilReveal
          className="mx-auto max-w-5xl font-serif text-5xl uppercase leading-[1.12] md:max-w-6xl md:text-8xl md:leading-[1.08]"
        >
          Une maison de cachemire d&apos;exception, ancrée à Bruxelles
        </SplitTextReveal>
      </section>

      <section className="relative h-[70svh] w-full overflow-hidden md:h-[80svh]">
        {/* Plain Image, no fade: the reveal waits for the image itself. */}
        <ScrollShrinkImage reveal hiddenUntilReveal>
          <Image
            src="/images/about/chevreaux-cachemire-steppe.jpg"
            alt="Femme tenant un chevreau dans un enclos de chèvres cachemire, steppe mongole"
            fill
            preload
            className="object-cover object-[70%_50%] md:object-center"
            // Height-bound when the screen is narrower than the 8:5 photo at
            // 70svh / 80svh: size by height, or phones get a blurry file.
            sizes="(max-width: 767px) 112vh, (max-aspect-ratio: 32/25) 128vh, 100vw"
          />
        </ScrollShrinkImage>
      </section>

      <section className="bg-white px-4 py-16 text-left text-black md:px-8">
        <div className="max-w-2xl">
          {/* <h2 className={sectionHeadingClassName}>
            Une maison où le luxe rencontre la raison d&apos;être
          </h2> */}
          <p className="mt-6 font-serif text-base leading-relaxed text-black/80 md:text-lg">
            Nous vous présentons Royal Cashmere, boutique de cachemire
            d&apos;exception à Uccle, à Bruxelles, où la durabilité
            s&apos;entrelace avec le style. Nous proposons des pièces exquises
            en cachemire et en soie, issues des paysages intemporels de la
            steppe mongole, et sélectionnées pour leur pureté et leur douceur
            incomparable.
          </p>
          <p className="mt-6 font-serif text-base leading-relaxed text-black/80 md:text-lg">
            Installés chaussée de Waterloo, nous accueillons chaque visite comme
            une rencontre. En choisissant Royal Cashmere, vous participez à une
            histoire qui soutient les éleveurs nomades et leurs terres
            ancestrales, tout en investissant dans un vestiaire intemporel,
            pensé pour durer.
          </p>
        </div>
      </section>
      {/* Same side padding as the text sections above. Landscape photo
          first (right half), then a taller portrait one beside the text.
          Aspect ratios, not svh heights, so the shapes hold on any screen. */}
      <div className="flex flex-col gap-12 px-4 md:gap-20 md:px-8">
        <section className="flex w-full flex-col md:flex-row">
          <div className="hidden md:block md:w-1/2" aria-hidden="true" />
          <div className="relative aspect-3/2 w-full md:w-1/2">
            <FadeInImage
              src="/images/about/cachemire.jpg"
              alt="Cachemire Royal Cashmere"
              fill
              className="object-cover"
              sizes="(max-width: 767px) calc(100vw - 2rem), calc(50vw - 2rem)"
            />
          </div>
        </section>

        <section className="flex w-full flex-col pb-20 md:flex-row">
          <div className="relative aspect-4/5 w-full md:w-1/2">
            <FadeInImage
              src="/images/about/fibre-cachemire-brute.jpg"
              alt="Femme tenant une poignée de fibre de cachemire brute dans la steppe mongole"
              fill
              className="object-cover"
              sizes="(max-width: 767px) calc(100vw - 2rem), calc(50vw - 2rem)"
            />
          </div>
          <div className="flex w-full bg-white py-4 text-left text-black md:w-1/2 md:pt-0 md:pl-8">
            <div className="max-w-xl">
              {/* <h2 className={sectionHeadingClassName}>
              Cachemire mongol, héritage nomade
            </h2> */}
              <p className="font-serif text-base leading-relaxed text-black/80 md:text-lg">
                Sur les hauts plateaux de Mongolie, le cachemire naît d&apos;un
                lien ancestral entre les éleveurs, leurs troupeaux et des
                steppes d&apos;une beauté rare. Nous sélectionnons nos fibres à
                la source, en privilégiant des filières respectueuses des
                nomades et de leur environnement, pour un avenir durable des
                générations à venir.
              </p>
              <p className="mt-6 font-serif text-base leading-relaxed text-black/80 md:text-lg">
                Nos créations sont conçues avec une attention méticuleuse aux
                détails, garantissant une qualité inégalée, une grande douceur
                au toucher et une durabilité réelle au quotidien. Chaque pièce
                reflète notre engagement à préserver la beauté de la nature et à
                honorer le riche héritage de la culture nomade mongole.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="relative h-svh w-full">
        <FadeInImage
          src="/images/about/collections.jpg"
          alt="Collections Royal Cashmere"
          fill
          className="object-cover"
          sizes="(max-aspect-ratio: 16/9) 182vh, 100vw"
        />
      </section>

      {/* <section className="bg-white px-4 py-32 text-center text-black md:px-8">
        <h2 className={`${sectionHeadingClassName} mx-auto max-w-2xl`}>
          Un style élégant et responsable, de la steppe mongole à Uccle
        </h2>

        <p className="mx-auto mt-8 max-w-2xl font-serif text-sm text-black/70 md:mt-10 md:text-base">
          De la sélection du cachemire mongol à la finition dans notre boutique
          bruxelloise, nous cultivons une approche exigeante à chaque étape.
          Rejoignez-nous et adoptez un style de vie raffiné, durable et
          profondément ancré dans le savoir-faire. Chaque achat chez Royal
          Cashmere est un pas vers un vestiaire plus beau, plus durable — pour
          vous, pour les nomades et pour la planète.
        </p>

        <Link
          href={routes.shop}
          className={`${ctaLinkClassName} mt-10 inline-block font-sans md:mt-12`}
        >
          Explorer la boutique
        </Link>
      </section> */}
    </main>
  );
}
