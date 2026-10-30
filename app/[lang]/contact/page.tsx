import type { Metadata } from "next";
import { toLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import ContactForm from "@/components/ContactForm";
import ScrollShrinkImage from "@/components/ScrollShrinkImage";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import Image from "next/image";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { contact } = await getDictionary(locale);
  return createPageMetadata({
    locale,
    title: contact.metaTitle,
    description: contact.metaDescription,
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const copy = (await getDictionary(toLocale(lang))).contact;

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="sr-only">{copy.heading}</h1>

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <div className="space-y-8 text-left">
            <p className="font-serif text-2xl uppercase leading-snug tracking-wide md:text-3xl">
              {copy.storeName}
            </p>

            <div>
              <p className="text-xs uppercase tracking-wide text-black/50">
                {copy.addressLabel}
              </p>
              <p className="mt-2 font-serif text-sm md:text-base">
                {siteConfig.contact.street}
                <br />
                {siteConfig.contact.city}, {copy.country}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-black/50">
                {copy.phoneLabel}
              </p>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="mt-2 inline-block font-serif text-sm transition-opacity hover:opacity-60 md:text-base"
              >
                {siteConfig.contact.phone}
              </a>
            </div>

            {siteConfig.contact.email ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-black/50">
                  {copy.emailLabel}
                </p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="mt-2 inline-block font-serif text-sm transition-opacity hover:opacity-60 md:text-base"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            ) : null}

            <div>
              <p className="text-xs uppercase tracking-wide text-black/50">
                {copy.hoursLabel}
              </p>
              <p className="mt-2 font-serif text-sm md:text-base">
                {copy.hours}
              </p>
            </div>

            <div className="border-t border-black/10 pt-8">
              <ContactForm />
            </div>
          </div>

          <div className="relative min-h-160 w-full overflow-hidden md:min-h-[calc(100svh-7rem)]">
            {/* Plain Image, no fade: the reveal waits for the image itself.
                Hidden from the server HTML since it's in view on desktop. */}
            <ScrollShrinkImage reveal hiddenUntilReveal>
              <Image
                src="/images/shared/manteau.jpg"
                alt={copy.imageAlt}
                fill
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </ScrollShrinkImage>
          </div>
        </div>
      </section>
    </main>
  );
}
