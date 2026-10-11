import PolitiqueConfidentialiteContent from "@/components/legal/PolitiqueConfidentialiteContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Royal Cashmere.",
  path: "/politique-de-confidentialite",
});

export default function PrivacyPolicyPage() {
  return <PolitiqueConfidentialiteContent />;
}
