import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { DEFAULT_DESTINATIONS } from "@/data/destinations"
import { connectDB } from "@/lib/db/mongoose"
import {
  DESTINATION_CATEGORIES,
  destinationSchema,
  type DestinationCategory,
} from "@/lib/validations/destination"
import { Destination } from "@/models/Destination"
import type { DestinationDTO, DestinationList } from "@/types/destination"

/** Tag to pass to `updateTag()` / `revalidateTag()` after editing destinations. */
export const DESTINATIONS_TAG = "destinations"

function toDTO(d: Record<string, unknown>): DestinationDTO {
  const parsed = destinationSchema.parse(d)
  return {
    slug: parsed.slug,
    name: parsed.name,
    categories: parsed.categories,
    featured: parsed.featured,
    badge: parsed.badge,
    coords: parsed.coords,
    kicker: parsed.kicker,
    meta: parsed.meta ?? null,
    body: parsed.body,
    chips: parsed.chips,
    intakes: parsed.intakes,
    cta: parsed.cta,
    image: parsed.image ?? null,
    imageAlt: parsed.imageAlt,
  }
}

const fallback = () =>
  DEFAULT_DESTINATIONS.map((d) => toDTO(d as Record<string, unknown>))

/**
 * All published destinations in display order. Cached and tagged, so the
 * marketing page stays static; call `updateTag(DESTINATIONS_TAG)` after edits.
 * Falls back to the bundled defaults when the database has none or is down.
 */
export async function getAllDestinations(): Promise<DestinationDTO[]> {
  "use cache"
  cacheLife("hours")
  cacheTag(DESTINATIONS_TAG)

  if (!process.env.MONGODB_URI) return fallback()
  try {
    await connectDB()
    const docs = await Destination.find({ published: true })
      .sort({ order: 1, name: 1 })
      .lean()
    if (docs.length === 0) {
      console.warn("[destinations] collection is empty; using defaults. Run `pnpm db:seed`.")
      return fallback()
    }
    return docs.map((d) => toDTO(d as unknown as Record<string, unknown>))
  } catch (error) {
    console.error("[destinations] database read failed; using defaults", error)
    return fallback()
  }
}

/** Destinations plus tab metadata (label + count), optionally filtered to one category. */
export async function listDestinations(category?: DestinationCategory): Promise<DestinationList> {
  const all = await getAllDestinations()
  const tabs = [
    { id: "all" as const, label: "All Hubs", count: all.length },
    ...DESTINATION_CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      count: all.filter((d) => d.categories.includes(c.id)).length,
    })),
  ]
  return {
    tabs,
    items: category ? all.filter((d) => d.categories.includes(category)) : all,
  }
}
