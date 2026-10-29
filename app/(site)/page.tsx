import { createPageMetadata } from "@/lib/seo";
import {
  BESTSELLERS_COLLECTION_HANDLE,
  NEW_IN_COLLECTION_HANDLE,
  SALE_COLLECTION_HANDLE,
} from "@/lib/collection-handles";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
// import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import Faq from "@/components/Faq";
// import HeroProductGlass from "@/components/HeroProductGlass";
// import HeroBottomLogo from "@/components/HeroBottomLogo";
// import HomeHeroBackground from "@/components/HomeHeroBackground";
// import MouseDrivenGallery from "@/components/MouseDrivenGallery";
import ProductImageBanner from "@/components/ProductImageBanner";
import ProductShowcase from "@/components/ProductShowcase";
import { getFeaturedProducts } from "@/lib/shopify/products";
import FadeInImage from "@/components/FadeInImage";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import SplitTextReveal from "@/components/SplitTextReveal";
import { getHomePageContent } from "@/lib/sanity/queries";
import { editableImageProps } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import heroImage from "@/public/images/about/cavaliere-steppe-mongolie.jpg";
import saleImage from "@/public/images/home/soldes.webp";
import bestsellersImage from "@/public/images/home/bestsellers.webp";
import boutiqueVisitImage from "@/public/images/home/visite-boutique.webp";
import newInImage from "@/public/images/home/nouveautes.webp";
import bannerImage from "@/public/images/home/banniere-histoire.webp";

// Below-the-fold editorial photos. Static imports give each a blur
// placeholder (shown instantly) and an immutable cache URL; eager + low
// priority starts the downloads right after the hero instead of waiting for
// the visitor to scroll near them, so a fast scroll doesn't land on blanks.
const editorialImageProps = {
  placeholder: "blur",
  loading: "eager",
  fetchPriority: "low",
} as const;

// Order of the first homepage carousel, by product handle. Shopify returns
// newest first; anything not listed here keeps that order after these.
const CAROUSEL_ORDER = [
  "robe-droite",
  "poncho",
  "robe-de-ligne-a",
  "pull-col-v",
  "pull-torsade",
  "pull-ouvert",
  "jupe-longue",
  "pull-ouvert-copy",
  "echarpes-unies",
  "chales-tissees-avec-franges",
  "chales-a-motif-tresse",
  "chales",
  "bonnet-reversible",
  "bonnet-cotele",
  "mitaines",
  "mitaines-longues",
];

function sortByCarouselOrder<T extends { handle: string }>(items: T[]): T[] {
  const rank = (handle: string) => {
    const index = CAROUSEL_ORDER.indexOf(handle);
    return index === -1 ? CAROUSEL_ORDER.length : index;
  };
  return [...items].sort((a, b) => rank(a.handle) - rank(b.handle));
}

export const metadata = createPageMetadata({
  description:
    "Royal Cashmere, boutique de cachemire d'exception à Uccle. Découvrez nos nouveautés en pur cachemire de Mongolie — pulls, écharpes et accessoires.",
  path: "/",
});

export default async function Home() {
  preload("/brand/logo-nav.svg", { as: "image", fetchPriority: "high" });

  // Fetch the featured products once and slice them for each section below,
  // instead of issuing a separate Shopify request per <FeaturedProducts />.
  // A Studio outage shouldn't take the homepage down: fall back to the
  // bundled photos instead.
  const [products, homePage] = await Promise.all([
    getFeaturedProducts(16),
    getHomePageContent().catch(() => null),
  ]);
  const bannerProduct = products[6] ?? products[0];
  // If you re-enable <HeroProductGlass /> below, fetch its product here:
  // const heroProduct = await getProductByHandle("pull-col-v");

  return (
    <main className="w-full">
      <section
        id="home-hero"
        data-transparent-nav
        className="relative h-svh w-full"
      >
        <h1 className="sr-only">
          Royal Cashmere — Boutique de cachemire d&apos;exception à Uccle,
          Bruxelles
        </h1>
        {/* <HomeHeroBackground /> */}
        <Image
          src={heroImage}
          alt=""
          fill
          preload
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
        {/* <HeroBottomLogo priority raised /> */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center p-4 md:p-8">
          <Link
            href={routes.collectionByHandle(NEW_IN_COLLECTION_HANDLE)}
            className={`${ctaLinkClassName} text-white!`}
          >
            Voir les nouveautés
          </Link>
        </div>
        {/* <Image
          src="/images/_archive/nick-karvounis.jpg"
          alt="Boutique Royal Cashmere — cachemire d'exception à Bruxelles"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        /> */}
        {/* <div
          className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-black/50 via-black/20 to-transparent"
          aria-hidden="true"
        /> */}
        {/* {heroProduct ? <HeroProductGlass product={heroProduct} /> : null} */}
      </section>

      <section className="bg-white px-4 pt-6 pb-6 text-center text-black md:px-8 md:pt-10 md:pb-10">
        <SplitTextReveal
          as="h2"
          className="mx-auto mt-8 max-w-5xl font-serif mb-10 text-5xl uppercase leading-[1.12] md:mt-10 md:max-w-6xl md:text-8xl md:leading-[1.08]"
        >
          Le cachemire d&apos;exception venu de Mongolie
        </SplitTextReveal>
        <Link href={routes.shop} className={`${ctaLinkClassName} inline-block`}>
          Voir les nouveautés
        </Link>
      </section>

      <FeaturedProducts products={sortByCarouselOrder(products)} limit={16} />

      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Link
            href={routes.collectionByHandle(SALE_COLLECTION_HANDLE)}
            className="group relative block aspect-5/4 cursor-pointer overflow-hidden md:aspect-4/5"
          >
            <ScrollShrinkImage reveal>
              <FadeInImage
                {...editorialImageProps}
                {...editableImageProps(
                  homePage?.saleCardImage,
                  saleImage,
                  "Pull en cachemire Royal Cashmere",
                )}
                fill
                className="object-cover object-[50%_15%] md:object-center"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </ScrollShrinkImage>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 p-4 text-center md:gap-8 md:p-8">
              <SplitTextReveal
                as="h3"
                triggerClosest="a"
                delay={0.5}
                className="font-serif text-5xl uppercase leading-[1.1] text-white md:text-7xl"
              >
                Soldes
              </SplitTextReveal>
              <SplitTextReveal triggerClosest="a" delay={0.8} splitLines={false}>
                <span className={`${ctaLinkClassName} text-white!`}>
                  Voir les soldes
                </span>
              </SplitTextReveal>
            </div>
          </Link>
          <Link
            href={routes.collectionByHandle(BESTSELLERS_COLLECTION_HANDLE)}
            className="group relative block aspect-5/4 cursor-pointer overflow-hidden md:aspect-4/5"
          >
            <ScrollShrinkImage reveal>
              <FadeInImage
                {...editorialImageProps}
                {...editableImageProps(
                  homePage?.bestsellersCardImage,
                  bestsellersImage,
                  "Ensembles jogging en cachemire Royal Cashmere",
                )}
                fill
                className="object-cover object-[50%_15%] md:object-center"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </ScrollShrinkImage>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 p-4 text-center md:gap-8 md:p-8">
              <SplitTextReveal
                as="h3"
                triggerClosest="a"
                delay={0.5}
                className="font-serif text-5xl uppercase leading-[1.1] text-white md:text-7xl"
              >
                Bestsellers
              </SplitTextReveal>
              <SplitTextReveal triggerClosest="a" delay={0.8} splitLines={false}>
                <span className={`${ctaLinkClassName} text-white!`}>
                  Voir les best-sellers
                </span>
              </SplitTextReveal>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-6 text-left text-black md:flex md:px-8 md:py-10">
        <div className="hidden md:block md:w-2/3" aria-hidden="true" />
        <div className="md:w-1/3">
          <div className="max-w-xl">
            <p className="font-serif text-base leading-relaxed text-black/80 md:text-lg">
              Royal Cashmere est une boutique de cachemire installée à Uccle,
              à Bruxelles. Notre propriétaire est mongole, et nos pièces sont
              réalisées dans le meilleur cachemire de Mongolie : doux, chaud et
              fait pour durer. Pulls, robes, ponchos, écharpes, châles,
              bonnets et mitaines : chaque pièce est choisie pour sa finesse,
              sa douceur et sa tenue dans le temps. Vous les retrouvez à la
              boutique comme en ligne, avec la livraison en Europe.
            </p>
            <Link
              href={routes.about}
              className={`${ctaLinkClassName} mt-8 inline-block`}
            >
              Découvrir notre histoire
            </Link>
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} limit={4} offset={4} />

      <section className="w-full">
        {bannerProduct ? (
          <ProductImageBanner
            product={bannerProduct}
            image={editableImageProps(
              homePage?.storyBannerImage,
              bannerImage,
              "Veste zippée en cachemire Royal Cashmere",
              2400,
            )}
            eyebrow="Notre histoire"
            title="Le meilleur cachemire de Mongolie"
            description="Le cachemire de Mongolie est réputé parmi les plus fins au monde. Notre propriétaire, mongole elle-même, a choisi de le faire découvrir à Bruxelles : des pièces d'une douceur rare, pensées pour vous accompagner longtemps. À retrouver en boutique à Uccle comme en ligne."
            ctaLabel="Découvrir la pièce"
          />
        ) : null}
      </section>

      <section className="bg-white px-4 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Link
            href={routes.shop}
            aria-label="Voir les nouveautés"
            className="group relative block aspect-5/4 cursor-pointer overflow-hidden md:aspect-4/5"
          >
            <ScrollShrinkImage reveal>
              <FadeInImage
                {...editorialImageProps}
                {...editableImageProps(
                  homePage?.newInCardImage,
                  newInImage,
                  "Ensemble polo et jogging en cachemire Royal Cashmere",
                )}
                fill
                className="object-cover object-[50%_15%] md:object-center"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
            </ScrollShrinkImage>
          </Link>
          <div className="flex flex-col gap-10 md:px-8">
            <div className="md:flex-1">
              <div className="flex flex-col items-start justify-start py-6 text-left text-black md:sticky md:top-24 md:py-0">
                <p className="max-w-xl font-serif text-base leading-relaxed text-black/80 md:text-lg">
                  Passez nous voir à la boutique, chaussée de Waterloo 1251B à
                  Uccle. Touchez la matière, essayez les pièces et laissez-vous
                  conseiller : rien ne remplace le toucher d&apos;un vrai
                  cachemire de Mongolie.
                </p>
                <Link
                  href={routes.contact}
                  className={`${ctaLinkClassName} mt-8 inline-block`}
                >
                  Nous rendre visite
                </Link>
              </div>
            </div>
            <div className="relative aspect-4/5 w-2/3 self-end overflow-hidden md:w-1/2">
              <ScrollShrinkImage reveal>
                <FadeInImage
                  {...editorialImageProps}
                  {...editableImageProps(
                    homePage?.boutiqueVisitImage,
                    boutiqueVisitImage,
                    "Ensemble en cachemire Royal Cashmere",
                  )}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 66vw, 25vw"
                />
              </ScrollShrinkImage>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-white">
        <ProductShowcase />

        {/* <CategoryShowcase /> */}

        {/* <MouseDrivenGallery /> */}

        <Faq />
      </div>

      {/* <section className="relative h-svh w-full mt-20 mb-20">
        <FadeInImage
          src="/images/_archive/ekaterina-grosheva-optimized.jpg"
          alt="Pull en cachemire Royal Cashmere"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="relative z-10 h-full">
          <h2 className="sticky top-20 px-4 py-10 text-left font-serif text-5xl  leading-[1.1] text-white md:px-8 md:text-5xl ">
            Collection
            <br />
            2026
          </h2>
        </div>
      </section> */}

      {/* <section className="bg-white px-4 py-32 text-center text-black md:px-8">
        <h2 className="mx-auto max-w-4xl font-serif text-2xl uppercase leading-snug md:max-w-3xl md:text-3xl">
          Nous vous présentons Royal Cashmere, où le luxe rencontre la raison
          d&apos;être, où la durabilité s&apos;entrelace avec le style, et où
          chaque fibre raconte un voyage des hauts plateaux de Mongolie
          jusqu&apos;à votre garde-robe.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm text-black/70 md:mt-10 md:text-base">
          Nous vous proposons des pièces exquises en cachemire et en soie
          provenant des hauts plateaux de Mongolie, sélectionnées pour leur
          pureté et leur douceur incomparable. Dans notre atelier d&apos;Uccle,
          chaque création incarne un savoir-faire exigeant et un engagement
          durable, pour un vestiaire intemporel pensé à Bruxelles.
        </p>

        <Link
          href={routes.about}
          className={`${ctaLinkClassName} mt-10 inline-block font-sans md:mt-12`}
        >
          Découvrir notre histoire
        </Link>
      </section> */}

      {/* <section className="bg-white px-4 py-32 text-center text-black md:px-8">
        <h2 className="mx-auto max-w-4xl font-serif text-2xl uppercase leading-snug md:max-w-3xl md:text-3xl">
          Une invitation à découvrir l&apos;art du cachemire, au cœur
          d&apos;Uccle, dans un écrin où l&apos;élégance se vit, se touche et se
          partage.
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-sm text-black/70 md:mt-10 md:text-base">
          Notre boutique vous accueille pour une expérience personnalisée au
          milieu de collections raffinées en cachemire et soie. Que vous
          recherchiez une pièce intemporelle ou un conseil sur mesure, notre
          équipe vous accompagne avec la même exigence de qualité et
          d&apos;élégance discrète.
        </p>

        <Link
          href={routes.contact}
          className={`${ctaLinkClassName} mt-10 inline-block font-sans md:mt-12`}
        >
          Nous rendre visite
        </Link>
      </section> */}
    </main>
  );
}
