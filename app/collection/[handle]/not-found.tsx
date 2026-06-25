import Link from "next/link";
import { routes } from "@/lib/routes";

export default function CollectionNotFound() {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-center text-black md:px-8 md:pt-40 md:pb-32">
        <h1 className="font-serif text-5xl uppercase md:text-7xl">
          Collection introuvable
        </h1>
        <Link
          href={routes.shop}
          className="mt-10 inline-block text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          Retour à la boutique
        </Link>
      </section>
    </main>
  );
}
