"use client";

import Link from "@/components/LocaleLink";
import { useDictionary } from "@/components/LocaleProvider";
import type { ProductDetailFields } from "@/lib/shopify/queries";
import { routes } from "@/lib/routes";
import { useState, type ReactNode } from "react";

type ProductInfoAccordionProps = {
  descriptionHtml: string | null;
  details?: ProductDetailFields;
};

type Section = {
  title: string;
  content: ReactNode;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// Same for every product, so it lives here rather than in a Shopify metafield.
// Mirrors section 6–7 of the CGV.
function DeliveryAndReturns() {
  const dict = useDictionary();

  return (
    <>
      <p>{dict.product.deliveryText}</p>
      <p className="mt-3">
        {dict.product.returnsText}{" "}
        <Link href={routes.terms} className="underline underline-offset-2">
          {dict.product.termsLink}
        </Link>
      </p>
    </>
  );
}

function TextBlock({ text }: { text: string }) {
  return <p className="whitespace-pre-line">{text}</p>;
}

export default function ProductInfoAccordion({
  descriptionHtml,
  details,
}: ProductInfoAccordionProps) {
  const dict = useDictionary();
  const sections: Section[] = [];

  if (descriptionHtml) {
    sections.push({
      title: dict.product.description,
      content: (
        <div
          className="product-description"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ),
    });
  }
  if (details?.composition) {
    sections.push({
      title: dict.product.composition,
      content: <TextBlock text={details.composition} />,
    });
  }
  if (details?.fit) {
    sections.push({
      title: dict.product.fit,
      content: <TextBlock text={details.fit} />,
    });
  }
  if (details?.care) {
    sections.push({
      title: dict.product.care,
      content: <TextBlock text={details.care} />,
    });
  }
  sections.push({
    title: dict.product.deliveryAndReturns,
    content: <DeliveryAndReturns />,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-12 max-w-lg border-t border-neutral-200 md:mt-16">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={section.title} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-4 text-left text-xs uppercase tracking-wide transition-opacity hover:opacity-60"
            >
              <span>{section.title}</span>
              <ChevronIcon open={isOpen} />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 font-sans text-sm font-light leading-relaxed text-black/75 md:text-base">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
