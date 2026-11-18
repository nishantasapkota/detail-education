import { z } from "zod"

import { order, slug } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

/** The five-step process on the home page; each step is a service we offer. */
export const services = defineResource({
  key: "services",
  collection: "services",
  singular: "Service step",
  plural: "Services",
  description: "The “Five quiet, confident steps” process shown on the home page.",
  permission: "content.manage",
  schema: z.object({
    title: z.string().trim().min(2).max(60),
    slug: slug(),
    stage: z.string().trim().max(20).default(""),
    summary: z.string().trim().max(200).default(""),
    linkLabel: z.string().trim().max(40).default(""),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Step",
      fields: [
        { type: "text", name: "title", label: "Title", required: true, help: "e.g. Listening first" },
        { type: "slug", name: "slug", label: "Slug", from: "title", required: true },
        { type: "text", name: "stage", label: "Stage label", help: "e.g. Start" },
        { type: "text", name: "linkLabel", label: "Link label", help: "e.g. Discovery & goals" },
        { type: "textarea", name: "summary", label: "Summary", rows: 3, wide: true },
        { type: "number", name: "order", label: "Order", min: 0 },
        { type: "boolean", name: "published", label: "Published" },
      ],
    },
  ],
  columns: [
    { name: "order", label: "#", kind: "number" },
    { name: "title", label: "Step", kind: "title" },
    { name: "stage", label: "Stage" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "title",
  searchFields: ["title", "summary"],
  defaultSort: { order: 1 },
  uniqueField: "slug",
  publicPath: () => "/#process",
  cacheTags: ["services"],
  defaults: { order: 0, published: true },
})
