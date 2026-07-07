import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
// import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";
import Faq from "@/components/Faq";
// import HeroProductGlass from "@/components/HeroProductGlass";
import HeroBottomLogo from "@/components/HeroBottomLogo";
import HomeHeroBackground from "@/components/HomeHeroBackground";
// import MouseDrivenGallery from "@/components/MouseDrivenGallery";
import ProductImageBanner from "@/components/ProductImageBanner";
import ProductShowcase from "@/components/ProductShowcase";
import { getFeaturedProducts } from "@/lib/shopify/products";
import FadeInImage from "@/components/FadeInImage";
import Link from "next/link";

export const metadata = createPageMetadata({
  description:
    "Royal Cashmere, boutique de cachemire d'exception à Uccle. Découvrez nos nouveautés en pur cachemire de Mongolie — pulls, écharpes et accessoires.",
  path: "/",
});

export default async function Home() {
  // Fetch the featured products once and slice them for each section below,
  // instead of issuing a separate Shopify request per <FeaturedProducts />.
  const products = await getFeaturedProducts(12);
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
        <HomeHeroBackground />
        <HeroBottomLogo />
        {/* <Image
          src="/images/nick-karvounis.jpg"
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
        <h2 className="mx-auto mt-8 max-w-5xl font-serif mb-10 text-5xl uppercase leading-[1.12] md:mt-10 md:max-w-6xl md:text-8xl md:leading-[1.08]">
          Le cachemire d&apos;exception venu de Mongolie
        </h2>
        <Link href={routes.shop} className={`${ctaLinkClassName} inline-block`}>
          Voir les nouveautés
        </Link>
      </section>

      <FeaturedProducts products={products} />

      <section className="flex w-full flex-col md:h-svh md:flex-row">
        <div className="relative h-[40svh] w-full md:h-full md:w-1/2">
          <FadeInImage
            src="/images/Frame 63.png"
            alt="Cachemire Royal Cashmere"
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
        <div className="relative flex min-h-[40svh] w-full flex-col items-center justify-center gap-5 px-4 py-12 md:h-full md:w-1/2 md:gap-6 md:py-0">
          {/* <Image
            src="/images/Frame 64.png"
            alt="Cachemire Royal Cashmere"
            fill
            className="object-cover"
            sizes="(max-width: 767px) 100vw, 50vw"
          /> */}
          <p className="px-4 text-center font-serif text-3xl uppercase leading-[1.1] tracking-wide md:text-5xl">
            Fabriqué en
            <br />
            Mongolie
          </p>
          <div className="relative aspect-4/5 w-44 overflow-hidden md:w-56">
            <FadeInImage
              src="/images/degleex-ganzorig-SQoH2ZQd80E-unsplash.jpg"
              alt="Cachemire Royal Cashmere"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 176px, 224px"
            />
          </div>
          <p className="max-w-sm px-4 text-center font-serif text-base  text-black">
            Pur cachemire des hauts plateaux de Mongolie, sélectionné pour sa
            douceur et sa pureté exceptionnelles.
          </p>
          <Link href={routes.about} className={`${ctaLinkClassName} font-sans`}>
            Découvrir notre histoire
          </Link>
        </div>
      </section>

      <section className="relative h-svh w-full mt-20 mb-20">
        <FadeInImage
          src="/images/ekaterina-grosheva-optimized.jpg"
          alt="Cachemire Royal Cashmere"
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
      </section>

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

      <ProductShowcase />

      <FeaturedProducts products={products} limit={4} offset={4} />

      <section className="w-full">
        {bannerProduct ? (
          <ProductImageBanner
            product={bannerProduct}
            imageSrc="/images/Desktop - 20.jpg"
            imageAlt="Atelier Royal Cashmere"
          />
        ) : null}
      </section>

      {/* <CategoryShowcase /> */}

      {/* <MouseDrivenGallery /> */}

      <Faq />

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
