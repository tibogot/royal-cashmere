"use client";

import type { FaqItem } from "@/lib/faq";
import { useState } from "react";

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
      <path
        d="M2 4.5L6 8.5L10 4.5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

type FaqProps = {
  // Passed from the server page rather than read from useDictionary, so the
  // answers don't ship in every page's client dictionary.
  copy: {
    heading: string;
    items: FaqItem[];
    footerText: string;
  };
};

export default function Faq({ copy }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white px-4 py-32 text-black md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-serif text-3xl uppercase tracking-wide md:text-4xl">
          {copy.heading}
        </h2>

        <div className="mt-16 border-t border-neutral-200">
          {copy.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-opacity hover:opacity-60"
                >
                  <span className="font-serif text-base md:text-lg">{item.question}</span>
                  <ChevronIcon open={isOpen} />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 font-serif text-base leading-relaxed text-black/70 md:text-lg">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <p className="mt-8 max-w-md text-xs leading-relaxed text-black/50">
          {copy.footerText}
        </p> */}
      </div>
    </section>
  );
}
