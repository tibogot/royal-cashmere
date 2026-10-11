import CookiesContent from "@/components/legal/CookiesContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cookies",
  description: "Politique relative aux cookies de Royal Cashmere.",
  path: "/cookies",
});

export default function CookiesPage() {
  return <CookiesContent />;
}
