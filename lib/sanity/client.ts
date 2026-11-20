import { createClient } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./env";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
});

// Hourly, like the Shopify data. Every page that reads Sanity inherits this
// window, and at 60 s each visited page was re-rendered every minute.
export const sanityFetchOptions = {
  next: { revalidate: 3600 },
} as const;
