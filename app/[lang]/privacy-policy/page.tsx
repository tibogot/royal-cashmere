import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalContent } from "@/components/legal";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy-policy">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { title, description } = (await getDictionary(locale))
    .shellLegalMeta.privacyPolicy;
  return createPageMetadata({
    locale,
    title,
    description,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage({
  params,
}: PageProps<"/[lang]/privacy-policy">) {
  const Content = legalContent.privacy[toLocale((await params).lang)];
  return <Content />;
}
