import { z } from "zod"

import { dateField, imageUrl, optionalText, slug, toOptions } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

export const ARTICLE_CATEGORIES = [
  "Visa Strategy",
  "Admissions & SOP",
  "Cost of Living",
  "Scholarships",
  "Test Prep",
  "Student Life",
] as const

export const ARTICLE_STATUSES = ["draft", "published"] as const

export const articles = defineResource({
  key: "articles",
  collection: "articles",
  singular: "Article",
  plural: "Journal",
  description: "Guides in “The Detail Journal”, with their own public pages.",
  permission: "content.manage",
  schema: z.object({
    title: z.string().trim().min(5).max(140),
    slug: slug(),
    category: z.enum(ARTICLE_CATEGORIES),
    excerpt: z.string().trim().min(20).max(300),
    body: z.string().trim().max(50_000).default(""),
    coverImage: imageUrl().default(null),
    author: z.string().trim().max(80).default("Detail Admissions Desk"),
    readMinutes: z.coerce.number().int().min(1).max(60).default(5),
    publishedAt: dateField().default(() => new Date()),
    status: z.enum(ARTICLE_STATUSES).default("draft"),
    featured: z.boolean().default(false),
    seoTitle: optionalText(70),
    seoDescription: optionalText(160),
  }),
  sections: [
    {
      title: "Article",
      fields: [
        { type: "text", name: "title", label: "Title", required: true, wide: true },
        { type: "slug", name: "slug", label: "Slug", from: "title", required: true },
        { type: "select", name: "category", label: "Category", options: toOptions(ARTICLE_CATEGORIES), required: true },
        { type: "textarea", name: "excerpt", label: "Excerpt", rows: 3, wide: true, required: true, help: "Shown on the card and in search results." },
        { type: "richtext", name: "body", label: "Body", rows: 18, wide: true },
      ],
    },
    {
      title: "Publishing",
      fields: [
        { type: "select", name: "status", label: "Status", options: toOptions(ARTICLE_STATUSES) },
        { type: "date", name: "publishedAt", label: "Publish date" },
        { type: "text", name: "author", label: "Author" },
        { type: "number", name: "readMinutes", label: "Read time (min)", min: 1, max: 60 },
        { type: "boolean", name: "featured", label: "Show on home page" },
        { type: "image", name: "coverImage", label: "Cover image", wide: true },
      ],
    },
    {
      title: "Search engines",
      description: "Leave empty to use the title and excerpt.",
      fields: [
        { type: "text", name: "seoTitle", label: "SEO title", wide: true },
        { type: "textarea", name: "seoDescription", label: "SEO description", rows: 2, wide: true },
      ],
    },
  ],
  columns: [
    { name: "coverImage", label: "", kind: "image" },
    { name: "title", label: "Title", kind: "title" },
    { name: "category", label: "Category" },
    { name: "status", label: "Status", kind: "badge" },
    { name: "publishedAt", label: "Date", kind: "date" },
  ],
  titleField: "title",
  searchFields: ["title", "excerpt", "author"],
  filter: { name: "status", label: "Status", options: toOptions(ARTICLE_STATUSES) },
  defaultSort: { publishedAt: -1 },
  uniqueField: "slug",
  publicPath: (d) => (d.status === "published" ? `/journal/${d.slug}` : null),
  cacheTags: ["articles"],
  defaults: { status: "draft", featured: false, readMinutes: 5, author: "Detail Admissions Desk", body: "", coverImage: null },
})
