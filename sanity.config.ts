import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { structureTool } from "sanity/structure";
import { LOCALES, LOCALE_NAME } from "@/lib/i18n/config";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/lib/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

// The same languages as the site, in the switcher's order (French first).
const LANGUAGES = LOCALES.map((id) => ({ id, title: LOCALE_NAME[id] }));

/** The Studio, mounted by `app/studio/[[...tool]]`. */
export default defineConfig({
  name: "default",
  title: "Royal Cashmere — Brussels",
  basePath: "/studio",

  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,

  plugins: [
    structureTool({ structure }),
    /**
     * Articles are written per language: one document each, so a translation
     * can be published (or not) on its own schedule. The plugin links them
     * through a `translation.metadata` document, which is what the site reads
     * for the language switcher and hreflang.
     */
    documentInternationalization({
      supportedLanguages: LANGUAGES,
      schemaTypes: ["article"],
      // The three French articles predate the plugin; this lets them be tied
      // to translations created later.
      allowCreateMetaDoc: true,
    }),
    /**
     * Short labels that sit on shared content — image alt texts, category
     * names — are translated in place, side by side, rather than duplicating
     * the image or the category per language.
     */
    internationalizedArray({
      languages: LANGUAGES,
      defaultLanguages: ["fr"],
      fieldTypes: ["string"],
      languageDisplay: "titleOnly",
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
