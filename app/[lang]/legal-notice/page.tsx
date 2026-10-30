import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalContent } from "@/components/legal";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal-notice">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { title, description } = (await getDictionary(locale))
    .shellLegalMeta.legalNotice;
  return createPageMetadata({
    locale,
    title,
    description,
    path: "/legal-notice",
  });
}

export default async function LegalNoticePage({
  params,
}: PageProps<"/[lang]/legal-notice">) {
  const Content = legalContent.legalNotice[toLocale((await params).lang)];
  return <Content />;
}
