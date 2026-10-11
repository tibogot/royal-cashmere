import MentionsLegalesContent from "@/components/legal/MentionsLegalesContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Mentions légales",
  description: "Mentions légales de Royal Cashmere.",
  path: "/mentions-legales",
});

export default function LegalNoticePage() {
  return <MentionsLegalesContent />;
}
