import { z } from "zod"

import { dateField, imageUrl, optionalText, slug, toOptions } from "@/lib/cms/fields"
import { defineResource } from "@/lib/cms/types"

export const EVENT_TYPES = ["seminar", "webinar", "open day", "university fair", "workshop"] as const
export const EVENT_STATUSES = ["draft", "published", "cancelled"] as const

export const events = defineResource({
  key: "events",
  collection: "events",
  singular: "Event",
  plural: "Events",
  description: "Seminars, webinars and open days, with sign-ups.",
  permission: "events.manage",
  schema: z
    .object({
      title: z.string().trim().min(3).max(120),
      slug: slug(),
      type: z.enum(EVENT_TYPES),
      startsAt: dateField(),
      endsAt: dateField().nullable().default(null),
      location: z.string().trim().max(160).default(""),
      meetingUrl: optionalText(300).pipe(z.url().nullable()),
      summary: z.string().trim().max(300).default(""),
      body: z.string().trim().max(20_000).default(""),
      coverImage: imageUrl().default(null),
      capacity: z.coerce.number().int().min(0).max(100_000).default(0),
      registrationOpen: z.boolean().default(true),
      status: z.enum(EVENT_STATUSES).default("draft"),
    })
    .refine((e) => !e.endsAt || e.endsAt >= e.startsAt, { path: ["endsAt"], message: "Ends before it starts" }),
  sections: [
    {
      title: "Event",
      fields: [
        { type: "text", name: "title", label: "Title", required: true, wide: true },
        { type: "slug", name: "slug", label: "Slug", from: "title", required: true },
        { type: "select", name: "type", label: "Type", options: toOptions(EVENT_TYPES), required: true },
        { type: "datetime", name: "startsAt", label: "Starts", required: true },
        { type: "datetime", name: "endsAt", label: "Ends" },
        { type: "text", name: "location", label: "Venue", help: "Leave empty for online-only" },
        { type: "url", name: "meetingUrl", label: "Online link", placeholder: "https://" },
        { type: "textarea", name: "summary", label: "Summary", rows: 2, wide: true },
        { type: "richtext", name: "body", label: "Details", rows: 10, wide: true },
        { type: "image", name: "coverImage", label: "Cover image", wide: true },
      ],
    },
    {
      title: "Sign-ups",
      fields: [
        { type: "select", name: "status", label: "Status", options: toOptions(EVENT_STATUSES) },
        { type: "number", name: "capacity", label: "Capacity", min: 0, help: "0 = unlimited" },
        { type: "boolean", name: "registrationOpen", label: "Registration open" },
      ],
    },
  ],
  columns: [
    { name: "title", label: "Event", kind: "title" },
    { name: "type", label: "Type", kind: "badge" },
    { name: "startsAt", label: "Date", kind: "date" },
    { name: "status", label: "Status", kind: "badge" },
  ],
  titleField: "title",
  searchFields: ["title", "location", "summary"],
  filter: { name: "status", label: "Status", options: toOptions(EVENT_STATUSES) },
  defaultSort: { startsAt: -1 },
  uniqueField: "slug",
  publicPath: (d) => (d.status === "published" ? `/events/${d.slug}` : null),
  cacheTags: ["events"],
  defaults: { type: "seminar", status: "draft", capacity: 0, registrationOpen: true, coverImage: null, body: "" },
})
