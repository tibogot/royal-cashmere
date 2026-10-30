import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalContent } from "@/components/legal";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cookies">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { title, description } = (await getDictionary(locale))
    .shellLegalMeta.cookies;
  return createPageMetadata({
    locale,
    title,
    description,
    path: "/cookies",
  });
}

export default async function CookiesPage({
  params,
}: PageProps<"/[lang]/cookies">) {
  const Content = legalContent.cookies[toLocale((await params).lang)];
  return <Content />;
}
