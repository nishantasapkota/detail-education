import { z } from "zod"

import { imageUrl, optionalText, order } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"
import { DESTINATION_COUNTRY_OPTIONS } from "@/lib/cms/resources/destinations"

export const partners = defineResource({
  key: "partners",
  collection: "partners",
  singular: "Partner",
  plural: "Partners",
  description: "Partner universities and institutions.",
  permission: "content.manage",
  schema: z.object({
    name: z.string().trim().min(2).max(120),
    country: z.string().trim().max(40).default(""),
    logo: imageUrl().default(null),
    website: optionalText(300).pipe(z.url().nullable()),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Partner",
      fields: [
        { type: "text", name: "name", label: "Institution", required: true, wide: true },
        { type: "select", name: "country", label: "Country", options: DESTINATION_COUNTRY_OPTIONS },
        { type: "url", name: "website", label: "Website", placeholder: "https://" },
        { type: "image", name: "logo", label: "Logo", wide: true },
        { type: "number", name: "order", label: "Order", min: 0 },
        { type: "boolean", name: "published", label: "Published" },
      ],
    },
  ],
  columns: [
    { name: "logo", label: "", kind: "image" },
    { name: "name", label: "Institution", kind: "title" },
    { name: "country", label: "Country" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "name",
  searchFields: ["name", "country"],
  filter: { name: "country", label: "Country", options: DESTINATION_COUNTRY_OPTIONS },
  defaultSort: { order: 1, name: 1 },
  cacheTags: ["partners"],
  defaults: { order: 0, published: true, logo: null, website: null },
})
