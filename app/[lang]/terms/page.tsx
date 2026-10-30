import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalContent } from "@/components/legal";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { title, description } = (await getDictionary(locale))
    .shellLegalMeta.terms;
  return createPageMetadata({
    locale,
    title,
    description,
    path: "/terms",
  });
}

export default async function TermsPage({
  params,
}: PageProps<"/[lang]/terms">) {
  const Content = legalContent.terms[toLocale((await params).lang)];
  return <Content />;
}
