import { z } from "zod"

import { imageUrl, order } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

export const testimonials = defineResource({
  key: "testimonials",
  collection: "testimonials",
  singular: "Testimonial",
  plural: "Testimonials",
  description: "Student stories in the “Big journeys. Personal stories.” carousel.",
  permission: "testimonials.manage",
  schema: z.object({
    name: z.string().trim().min(2).max(60),
    role: z.string().trim().max(80).default(""),
    quote: z.string().trim().min(20).max(400),
    photo: imageUrl().default(null),
    verified: z.boolean().default(false),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Story",
      fields: [
        { type: "text", name: "name", label: "Student name", required: true, help: "e.g. Anisha S." },
        { type: "text", name: "role", label: "Programme & country", help: "e.g. Master's student, Australia" },
        { type: "textarea", name: "quote", label: "Quote", rows: 4, wide: true, required: true },
        { type: "image", name: "photo", label: "Photo (optional)", wide: true },
      ],
    },
    {
      title: "Display",
      fields: [
        { type: "boolean", name: "verified", label: "Verified with the student", help: "Only verified stories should go live." },
        { type: "boolean", name: "published", label: "Published" },
        { type: "number", name: "order", label: "Order", min: 0 },
      ],
    },
  ],
  columns: [
    { name: "name", label: "Student", kind: "title" },
    { name: "role", label: "Programme" },
    { name: "verified", label: "Verified", kind: "boolean" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "name",
  searchFields: ["name", "role", "quote"],
  defaultSort: { order: 1, createdAt: -1 },
  publicPath: () => "/#stories",
  cacheTags: ["testimonials"],
  defaults: { verified: false, published: true, order: 0, photo: null },
})
