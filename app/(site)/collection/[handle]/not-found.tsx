import Link from "next/link";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";

export default function CollectionNotFound() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-center text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="font-serif text-5xl uppercase md:text-7xl">
          Collection introuvable
        </h1>
        <Link
          href={routes.shop}
          className={`${ctaLinkClassName} mt-10 inline-block`}
        >
          Retour à la boutique
        </Link>
      </section>
    </main>
  );
}
