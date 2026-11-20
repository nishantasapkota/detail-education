import { z } from "zod"

import { imageUrl, optionalText, order } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"
import { DESTINATION_COUNTRY_OPTIONS } from "@/lib/cms/resources/destinations"

export const visaSuccesses = defineResource({
  key: "visas",
  collection: "visa_successes",
  singular: "Visa success",
  plural: "Visa success",
  description: "Photos of students who received their visas, shown in the home page “Visa success” gallery.",
  permission: "content.manage",
  schema: z.object({
    name: z.string().trim().min(2).max(60),
    country: z.string().trim().max(40).default(""),
    university: optionalText(120),
    intake: optionalText(40),
    photo: imageUrl().refine((v) => !!v, "Add a photo"),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Student",
      fields: [
        { type: "text", name: "name", label: "Student name", required: true, help: "e.g. Anisha S." },
        { type: "select", name: "country", label: "Visa country", options: DESTINATION_COUNTRY_OPTIONS },
        { type: "text", name: "university", label: "University (optional)" },
        { type: "text", name: "intake", label: "Intake (optional)", help: "e.g. Feb 2026" },
        { type: "image", name: "photo", label: "Photo", wide: true, required: true, help: "The student with their visa, or the grant letter. Get the student’s consent first." },
      ],
    },
    {
      title: "Display",
      fields: [
        { type: "boolean", name: "published", label: "Published" },
        { type: "number", name: "order", label: "Order", min: 0 },
      ],
    },
  ],
  columns: [
    { name: "photo", label: "", kind: "image" },
    { name: "name", label: "Student", kind: "title" },
    { name: "country", label: "Country" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "name",
  searchFields: ["name", "country", "university"],
  filter: { name: "country", label: "Country", options: DESTINATION_COUNTRY_OPTIONS },
  defaultSort: { order: 1, createdAt: -1 },
  publicPath: () => "/#visas",
  cacheTags: ["visas"],
  defaults: { published: true, order: 0, photo: null, university: null, intake: null },
})
