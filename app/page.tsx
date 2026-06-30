import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import Faq from "@/components/Faq";
import HeroProductGlass from "@/components/HeroProductGlass";
import HomeHeroBackground from "@/components/HomeHeroBackground";
import ProductImageBanner from "@/components/ProductImageBanner";
import ProductShowcase from "@/components/ProductShowcase";
import { getFeaturedProducts } from "@/lib/shopify/products";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  description:
    "Royal Cashmere, boutique de cachemire d'exception à Uccle. Découvrez nos nouveautés en pur cachemire de Mongolie — pulls, écharpes et accessoires.",
});

export default async function Home() {
  const products = await getFeaturedProducts(8);
  const heroProduct = products[0];
  const bannerProduct = products[6] ?? products[0];

  return (
    <main className="w-full">
      <section id="home-hero" className="relative h-svh w-full overflow-hidden">
        <h1 className="sr-only">
          Royal Cashmere — Boutique de cachemire d&apos;exception à Uccle,
          Bruxelles
        </h1>
        <HomeHeroBackground />
        {/* <Image
          src="/images/nick-karvounis.jpg"
          alt="Boutique Royal Cashmere — cachemire d'exception à Bruxelles"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        /> */}
        <div
          className="pointer-events-none absolute inset-0 z-1 bg-linear-to-b from-black/50 via-black/20 to-transparent"
          aria-hidden="true"
        />
        {heroProduct ? <HeroProductGlass product={heroProduct} /> : null}
      </section>

      <section className="bg-white px-4 pt-6 pb-20 text-center text-black md:px-8 md:pt-10 md:pb-32">
        <Link
          href={routes.shop}
          className="inline-block select-none text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          Voir les nouveautés
        </Link>

        <h2 className="mx-auto mt-8 max-w-5xl font-serif text-5xl uppercase leading-[1.12] md:mt-10 md:max-w-6xl md:text-8xl md:leading-[1.08]">
          Le cachemire d&apos;exception venu de Mongolie
        </h2>
      </section>

      <FeaturedProducts />

      <section className="flex w-full flex-col md:h-[80svh] md:flex-row">
        <div className="relative h-[40svh] w-full md:h-full md:w-1/2">
          <Image
            src="/images/unsplash_mjtLS0CDuIQ.png"
            alt="Cachemire Royal Cashmere"
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
        <div className="relative h-[40svh] w-full md:h-full md:w-1/2">
          <Image
            src="/images/unsplash_mjtLS0CDuIQ-1.png"
            alt="Cachemire Royal Cashmere"
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="bg-white px-4 py-32 text-center text-black md:px-8">
        <h2 className="mx-auto max-w-4xl font-serif text-2xl uppercase leading-snug md:max-w-3xl md:text-3xl">
          Nous vous présentons Royal Cashmere, où le luxe rencontre la raison
          d&apos;être, où la durabilité s&apos;entrelace avec le style, et où
          chaque fibre raconte un voyage des hauts plateaux de Mongolie jusqu&apos;à
          votre garde-robe.
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
          className="mt-10 inline-block select-none font-sans text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60 md:mt-12"
        >
          Découvrir notre histoire
        </Link>
      </section>

      <ProductShowcase />

      <FeaturedProducts limit={4} offset={4} />

      <section className="w-full">
        {bannerProduct ? (
          <ProductImageBanner
            product={bannerProduct}
            imageSrc="/images/Desktop - 20.jpg"
            imageAlt="Atelier Royal Cashmere"
          />
        ) : null}
      </section>

      <CategoryShowcase />

      <Faq />

      <section className="bg-white px-4 py-32 text-center text-black md:px-8">
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
          className="mt-10 inline-block select-none font-sans text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60 md:mt-12"
        >
          Nous rendre visite
        </Link>
      </section>
    </main>
  );
}
