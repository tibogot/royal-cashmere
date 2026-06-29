"use client";

type FooterSearchLinkProps = {
  className: string;
};

export default function FooterSearchLink({ className }: FooterSearchLinkProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("search-open"))}
      className={className}
    >
      Rechercher
    </button>
  );
}
