import { z } from "zod"

import { optionalText, order, slug, stringList } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

export const courses = defineResource({
  key: "courses",
  collection: "courses",
  singular: "Test prep course",
  plural: "Test prep",
  description: "IELTS, PTE, TOEFL, SAT and other cohorts in the test prep section.",
  permission: "content.manage",
  schema: z.object({
    name: z.string().trim().min(2).max(40),
    slug: slug(),
    tag: z.string().trim().max(40).default(""),
    summary: z.string().trim().max(240).default(""),
    points: stringList(5, 60).default([]),
    duration: z.string().trim().max(40).default(""),
    fee: optionalText(40),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Course",
      fields: [
        { type: "text", name: "name", label: "Name", required: true, help: "e.g. IELTS" },
        { type: "slug", name: "slug", label: "Slug", from: "name", required: true },
        { type: "text", name: "tag", label: "Tag", help: "e.g. Academic & UKVI" },
        { type: "text", name: "duration", label: "Duration", help: "e.g. 4 weeks" },
        { type: "textarea", name: "summary", label: "Summary", rows: 3, wide: true },
        { type: "list", name: "points", label: "Highlights", max: 5, wide: true, help: "Include class times here, e.g. 7:00 AM or 5:00 PM" },
        { type: "text", name: "fee", label: "Fee (optional)", help: "e.g. NPR 12,000" },
        { type: "number", name: "order", label: "Order", min: 0 },
        { type: "boolean", name: "published", label: "Published" },
      ],
    },
  ],
  columns: [
    { name: "name", label: "Course", kind: "title" },
    { name: "tag", label: "Tag" },
    { name: "duration", label: "Duration" },
    { name: "order", label: "Order", kind: "number" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "name",
  searchFields: ["name", "tag", "summary"],
  defaultSort: { order: 1 },
  uniqueField: "slug",
  publicPath: () => "/#testprep",
  cacheTags: ["courses"],
  defaults: { points: [], order: 0, published: true },
})
