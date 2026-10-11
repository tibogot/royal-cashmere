import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center bg-white px-4 pt-24 text-center text-black">
      <h1 className="font-serif text-3xl uppercase md:text-5xl">
        Produit introuvable
      </h1>
      <p className="mt-6 max-w-md text-sm text-black/70">
        Ce produit n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <Link
        href={routes.shop}
        className={`${ctaLinkClassName} mt-10`}
      >
        Retour à la boutique
      </Link>
    </main>
  );
}
