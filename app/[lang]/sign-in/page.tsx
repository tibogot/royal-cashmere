import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import CartPageClient from "@/components/CartPageClient";
import { getDictionary } from "@/lib/i18n/dictionaries";
import SignInView from "@/components/SignInView";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { createPageMetadata } from "@/lib/seo";
import Image from "next/image";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/sign-in">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { shopMeta } = await getDictionary(locale);
  return createPageMetadata({
    locale,
    title: shopMeta.signInTitle,
    description: shopMeta.signInDescription,
    path: "/sign-in",
  });
}

type SignInPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({
  params: routeParams,
  searchParams,
}: SignInPageProps) {
  const params = await searchParams;
  const dict = await getDictionary(toLocale((await routeParams).lang));

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="sr-only">{dict.shopHeadings.signIn}</h1>

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <SignInView
            configured={isCustomerAccountConfigured()}
            hasError={params.error === "auth_failed"}
            copy={dict.signIn}
          />

          <div className="relative min-h-80 w-full md:min-h-[calc(100svh-7rem)]">
            <Image
              src="/images/shared/paysage-mongolie.jpg"
              alt={dict.signIn.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
