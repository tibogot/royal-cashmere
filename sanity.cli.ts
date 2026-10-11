import { defineCliConfig } from "sanity/cli";
import { sanityDataset, sanityProjectId } from "@/lib/sanity/env";

/** For the `sanity` CLI only (schema deploys, dataset exports). */
export default defineCliConfig({
  api: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
  },
});
