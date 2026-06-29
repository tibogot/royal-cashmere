import LegalPage from "@/components/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mentions légales",
  description: "Mentions légales de Royal Cashmere.",
  path: "/mentions-legales",
});

export default function LegalNoticePage() {
  return <LegalPage title="Mentions légales" />;
}
