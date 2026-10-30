import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import WishlistView from "@/components/WishlistView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/wishlist">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { shopMeta } = await getDictionary(locale);
  return createPageMetadata({
    locale,
    title: shopMeta.wishlistTitle,
    description: shopMeta.wishlistDescription,
    path: "/wishlist",
  });
}

export default async function WishlistPage({
  params,
}: PageProps<"/[lang]/wishlist">) {
  const dict = await getDictionary(toLocale((await params).lang));

  return (
    <main className="flex w-full flex-1 flex-col">
      <section className="flex-1 bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="text-center font-serif text-5xl uppercase leading-[1.12] md:text-7xl">
          {dict.wishlist.title}
        </h1>

        <WishlistView />
      </section>
    </main>
  );
}
