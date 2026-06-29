import LegalPage from "@/components/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "CGV",
  description:
    "Conditions générales de vente de Royal Cashmere.",
  path: "/cgv",
});

export default function TermsPage() {
  return <LegalPage title="Conditions générales de vente" />;
}
