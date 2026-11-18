import { z } from "zod"

import { imageUrl, optionalText, order } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

export const team = defineResource({
  key: "team",
  collection: "team",
  singular: "Team member",
  plural: "Team",
  description: "Counsellors and leadership. The featured member appears in the “personal attention” card.",
  permission: "content.manage",
  schema: z.object({
    name: z.string().trim().min(2).max(60),
    title: z.string().trim().max(80).default(""),
    bio: z.string().trim().max(600).default(""),
    quote: optionalText(200),
    yearsExperience: z.coerce.number().int().min(0).max(60).default(0),
    photo: imageUrl().default(null),
    featured: z.boolean().default(false),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Profile",
      fields: [
        { type: "text", name: "name", label: "Name", required: true },
        { type: "text", name: "title", label: "Job title", help: "e.g. Senior Academic Advisor & Alum" },
        { type: "textarea", name: "bio", label: "Bio", rows: 4, wide: true },
        { type: "textarea", name: "quote", label: "Quote (optional)", rows: 2, wide: true },
        { type: "number", name: "yearsExperience", label: "Years of experience", min: 0 },
        { type: "image", name: "photo", label: "Photo", wide: true },
      ],
    },
    {
      title: "Display",
      fields: [
        { type: "boolean", name: "featured", label: "Featured on home page", help: "Only one member should be featured." },
        { type: "boolean", name: "published", label: "Published" },
        { type: "number", name: "order", label: "Order", min: 0 },
      ],
    },
  ],
  columns: [
    { name: "photo", label: "", kind: "image" },
    { name: "name", label: "Name", kind: "title" },
    { name: "title", label: "Title" },
    { name: "featured", label: "Featured", kind: "boolean" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "name",
  searchFields: ["name", "title"],
  defaultSort: { order: 1 },
  publicPath: () => "/#about",
  cacheTags: ["team"],
  defaults: { featured: false, published: true, order: 0, yearsExperience: 0, photo: null },
})
