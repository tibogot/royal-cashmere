"use client";

import { useDictionary } from "@/components/LocaleProvider";

type FooterSearchLinkProps = {
  className: string;
};

export default function FooterSearchLink({ className }: FooterSearchLinkProps) {
  const { nav } = useDictionary();

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("search-open"))}
      className={className}
    >
      {nav.search}
    </button>
  );
}
