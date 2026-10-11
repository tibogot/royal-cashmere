import type { Metadata, Viewport } from "next";
import { Studio } from "./Studio";

/**
 * The Sanity Studio, served from this app instead of a separate project.
 * Access is controlled by the Sanity project members list, not by this repo.
 * The optional catch-all is required: the Studio owns its routing below
 * /studio.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <Studio />;
}
