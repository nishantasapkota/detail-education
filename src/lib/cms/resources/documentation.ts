import { z } from "zod"

import { DOCUMENTATION_COUNTRY_ORDER } from "@/config/documentation"
import { order, toOptions } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

const countryLabels: Record<(typeof DOCUMENTATION_COUNTRY_ORDER)[number], string> = {
  canada: "Canada",
  japan: "Japan",
  uk: "United Kingdom",
  usa: "United States",
  finland: "Finland",
  australia: "Australia",
  germany: "Germany",
}

const stageSchema = z.object({
  timing: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(600),
  /** One document per line in the CMS form. */
  documents: z.string().trim().max(1600),
})

export const documentation = defineResource({
  key: "documentation",
  collection: "documentation_timelines",
  singular: "Visa roadmap",
  plural: "Visa roadmaps",
  description:
    "Country-specific student visa timelines and document lists on the home page.",
  permission: "content.manage",
  schema: z.object({
    countryId: z.enum(DOCUMENTATION_COUNTRY_ORDER),
    country: z.string().trim().min(2).max(60),
    code: z.string().trim().min(2).max(4),
    route: z.string().trim().min(2).max(100),
    targetIntakes: z.string().trim().min(2).max(120),
    guideTimeline: z.string().trim().min(2).max(40),
    authority: z.string().trim().min(2).max(160),
    officialLabel: z.string().trim().min(2).max(100),
    officialUrl: z.url(),
    notes: z.array(z.string().trim().min(1).max(600)).max(8),
    stages: z.array(stageSchema).min(1).max(7),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Destination",
      fields: [
        {
          type: "select",
          name: "countryId",
          label: "Country",
          options: toOptions(DOCUMENTATION_COUNTRY_ORDER, countryLabels),
          required: true,
        },
        { type: "text", name: "country", label: "Display name", required: true },
        { type: "text", name: "code", label: "Map label", required: true },
        {
          type: "text",
          name: "route",
          label: "Permit or visa route",
          required: true,
          wide: true,
        },
        {
          type: "text",
          name: "targetIntakes",
          label: "Target intakes",
          required: true,
          wide: true,
        },
        { type: "text", name: "guideTimeline", label: "Guide timeline", required: true },
        {
          type: "text",
          name: "authority",
          label: "Authority and location",
          required: true,
          wide: true,
        },
        {
          type: "text",
          name: "officialLabel",
          label: "Official link label",
          required: true,
          wide: true,
        },
        {
          type: "url",
          name: "officialUrl",
          label: "Official requirements URL",
          required: true,
          wide: true,
        },
        { type: "number", name: "order", label: "Display order", min: 0 },
        { type: "boolean", name: "published", label: "Published" },
      ],
    },
    {
      title: "Local notes",
      description: "Add one note per item. These appear below the country timeline.",
      fields: [
        {
          type: "list",
          name: "notes",
          label: "Notes for Nepal applicants",
          max: 8,
          wide: true,
        },
      ],
    },
    {
      title: "Timeline stages",
      description:
        "Each stage has a target window, summary, and supporting documents. Enter documents one per line.",
      fields: [
        {
          type: "repeater",
          name: "stages",
          label: "Stages",
          itemLabel: "Stage",
          max: 7,
          wide: true,
          fields: [
            { name: "timing", label: "Target window", type: "text" },
            { name: "title", label: "Stage title", type: "text" },
            { name: "description", label: "Summary", type: "textarea", wide: true },
            {
              name: "documents",
              label: "Documents (one per line)",
              type: "textarea",
              wide: true,
            },
          ],
        },
      ],
    },
  ],
  columns: [
    { name: "country", label: "Country", kind: "title" },
    { name: "route", label: "Route" },
    { name: "guideTimeline", label: "Guide timeline" },
    { name: "order", label: "Order", kind: "number" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "country",
  searchFields: ["country", "route", "targetIntakes"],
  filter: {
    name: "countryId",
    label: "Country",
    options: toOptions(DOCUMENTATION_COUNTRY_ORDER, countryLabels),
  },
  defaultSort: { order: 1 },
  uniqueField: "countryId",
  publicPath: () => "/#documentation-timeline",
  cacheTags: ["documentation-timelines"],
  defaults: {
    countryId: "canada",
    code: "CA",
    notes: [],
    stages: [],
    order: 0,
    published: true,
  },
})
