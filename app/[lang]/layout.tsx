import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import Navbar from "@/components/Navbar";
import OrganizationJsonLd from "@/components/OrganizationJsonLd";
import SmoothScroll from "@/components/SmoothScroll";
import { LOCALES, isLocale, toLocale } from "@/lib/i18n/config";
import { clientDictionary, getDictionary } from "@/lib/i18n/dictionaries";
import { rootMetadata } from "@/lib/seo";
import { ivyPrestoHeadline, neueHaasDisplay } from "./fonts";
import "./globals.css";

// Every route is three routes; this is what tells Next to build all of them.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return rootMetadata(toLocale(lang));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  // The proxy prefixes every URL it forwards, but cannot stop someone typing
  // /de/cart by hand.
  if (!isLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${neueHaasDisplay.variable} ${ivyPrestoHeadline.variable} h-full antialiased`}
    >
      <body className="min-h-svh flex flex-col font-sans font-light">
        <OrganizationJsonLd locale={lang} />
        <LocaleProvider locale={lang} dictionary={clientDictionary(dictionary)}>
          <SmoothScroll>
            <Navbar />
            <div className="relative flex flex-1 flex-col">{children}</div>
            <Footer dictionary={dictionary} />
          </SmoothScroll>
          <CookieConsent />
        </LocaleProvider>
      </body>
    </html>
  );
}
