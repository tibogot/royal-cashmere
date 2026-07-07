import CgvContent from "@/components/legal/CgvContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "CGV",
  description: "Conditions générales de vente de Royal Cashmere.",
  path: "/cgv",
});

export default function TermsPage() {
  return <CgvContent />;
}
