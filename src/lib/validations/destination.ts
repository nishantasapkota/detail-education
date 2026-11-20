import { z } from "zod"

/** Tab categories for the destinations section. A destination can be in several. */
export const DESTINATION_CATEGORIES = [
  { id: "stem", label: "STEM & Tech" },
  { id: "psw", label: "Post-Study Work" },
  { id: "budget", label: "Low Tuition" },
] as const

export type DestinationCategory = (typeof DESTINATION_CATEGORIES)[number]["id"]
export const DESTINATION_CATEGORY_IDS = DESTINATION_CATEGORIES.map((c) => c.id) as [
  DestinationCategory,
  ...DestinationCategory[],
]

/** GET /api/destinations?category=stem (omit category for all). */
export const listDestinationsQuerySchema = z.object({
  category: z.enum(DESTINATION_CATEGORY_IDS).optional(),
})

/** Shape of one destination as stored and as returned by the API. */
export const destinationSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{2,40}$/),
  name: z.string().min(2).max(60),
  categories: z.array(z.enum(DESTINATION_CATEGORY_IDS)).min(1),
  featured: z.boolean().default(false),
  badge: z.string().max(40),
  coords: z.string().max(40),
  kicker: z.string().max(60),
  meta: z.string().max(40).nullish(),
  body: z.string().max(240),
  chips: z.array(z.string().max(30)).max(4),
  intakes: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
  cta: z.string().max(40),
  /** Local path, /api/images/<id> or a Cloudinary URL. Null shows a styled placeholder. */
  image: z.string().max(1024).nullish(),
  imageAlt: z.string().max(120).default(""),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
})
export type DestinationInput = z.input<typeof destinationSchema>
