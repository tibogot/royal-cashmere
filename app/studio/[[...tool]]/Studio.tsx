"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Client half of the Studio route. `sanity.config.ts` pulls in the whole
 * `sanity` package; imported from a Server Component it lands in the RSC
 * module graph, where the Studio's dependencies fail to resolve.
 */
export function Studio() {
  return <NextStudio config={config} />;
}
