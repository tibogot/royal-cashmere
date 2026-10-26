import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  // From the first level under the home page down to the current page.
  items: BreadcrumbItem[];
  className?: string;
};

// Visible trail plus its BreadcrumbList structured data, so search results
// show "Royal Cashmere › Femme › Pulls" instead of the raw URL.
export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const trail = [{ label: "Accueil", href: routes.home }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
    })),
  };

  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wide text-black/50 md:text-xs">
        {trail.map((item, index) => {
          const isCurrent = index === trail.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {isCurrent ? (
                <span aria-current="page" className="text-black">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-black"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
