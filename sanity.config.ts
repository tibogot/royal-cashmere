import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/lib/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

/** The Studio, mounted by `app/studio/[[...tool]]`. */
export default defineConfig({
  name: "default",
  title: "Royal Cashmere — Brussels",
  basePath: "/studio",

  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
