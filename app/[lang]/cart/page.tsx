import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import CartPageClient from "@/components/CartPageClient";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cart">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { shopMeta } = await getDictionary(locale);
  return createPageMetadata({
    locale,
    title: shopMeta.cartTitle,
    description: shopMeta.cartDescription,
    path: "/cart",
  });
}

export default async function CartPage({ params }: PageProps<"/[lang]/cart">) {
  const dict = await getDictionary(toLocale((await params).lang));

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          {dict.cart.title}
        </h1>

        <CartPageClient />
      </section>
    </main>
  );
}
