import { z } from "zod"

import { imageUrl, optionalText, order, slug, stringList, toOptions } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"
import { DESTINATION_CATEGORIES, DESTINATION_CATEGORY_IDS } from "@/lib/validations/destination"

const categoryOptions = DESTINATION_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))

export const destinations = defineResource({
  key: "destinations",
  collection: "destinations",
  singular: "Destination",
  plural: "Destinations",
  description: "Study countries shown in the “Find your place in the world” tabs.",
  permission: "content.manage",
  schema: z.object({
    name: z.string().trim().min(2).max(60),
    slug: slug(),
    categories: z.array(z.enum(DESTINATION_CATEGORY_IDS)).min(1, "Pick at least one tab"),
    featured: z.boolean().default(false),
    badge: z.string().trim().max(40).default(""),
    coords: z.string().trim().max(40).default(""),
    kicker: z.string().trim().max(60).default(""),
    meta: optionalText(40),
    body: z.string().trim().max(240).default(""),
    chips: stringList(4, 30).default([]),
    cta: z.string().trim().max(40).default("Explore Programs"),
    image: imageUrl().default(null),
    imageAlt: z.string().trim().max(120).default(""),
    order: order().default(0),
    published: z.boolean().default(true),
  }),
  sections: [
    {
      title: "Basics",
      fields: [
        { type: "text", name: "name", label: "Country", required: true },
        { type: "slug", name: "slug", label: "Slug", from: "name", required: true },
        { type: "checkboxes", name: "categories", label: "Tabs", options: categoryOptions, wide: true, help: "Which tabs show this destination." },
        { type: "boolean", name: "featured", label: "Featured hub", help: "Big title and a solid button." },
        { type: "boolean", name: "published", label: "Published" },
      ],
    },
    {
      title: "Card content",
      fields: [
        { type: "text", name: "badge", label: "Badge", help: "e.g. Russell Group Elite" },
        { type: "text", name: "coords", label: "Coordinates", help: "e.g. 51.5074° N, 0.1278° W" },
        { type: "text", name: "kicker", label: "Italic kicker" },
        { type: "text", name: "meta", label: "Meta (optional)", help: "e.g. 4,000+ Colleges" },
        { type: "textarea", name: "body", label: "Description", rows: 3, wide: true },
        { type: "list", name: "chips", label: "Chips", max: 4, wide: true },
        { type: "text", name: "cta", label: "Button text" },
        { type: "number", name: "order", label: "Order", min: 0 },
      ],
    },
    {
      title: "Image",
      fields: [
        { type: "image", name: "image", label: "Photo", wide: true },
        { type: "text", name: "imageAlt", label: "Alt text", wide: true },
      ],
    },
  ],
  columns: [
    { name: "image", label: "", kind: "image" },
    { name: "name", label: "Country", kind: "title" },
    { name: "categories", label: "Tabs", kind: "list" },
    { name: "order", label: "Order", kind: "number" },
    { name: "published", label: "Live", kind: "boolean" },
  ],
  titleField: "name",
  searchFields: ["name", "kicker", "body"],
  filter: { name: "categories", label: "Tab", options: categoryOptions },
  defaultSort: { order: 1, name: 1 },
  uniqueField: "slug",
  publicPath: () => "/#destinations",
  cacheTags: ["destinations"],
  defaults: { categories: [], featured: false, chips: [], cta: "Explore Programs", order: 0, published: true, image: null },
})

export const DESTINATION_COUNTRY_OPTIONS = toOptions(["USA", "United Kingdom", "Australia", "Canada", "Germany", "Japan"])
