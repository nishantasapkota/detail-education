import type { DestinationCategory } from "@/lib/validations/destination"

/** Public, serializable destination (safe to pass to client components). */
export type DestinationDTO = {
  slug: string
  name: string
  categories: DestinationCategory[]
  featured: boolean
  badge: string
  coords: string
  kicker: string
  meta: string | null
  body: string
  chips: string[]
  intakes: string[]
  cta: string
  image: string | null
  imageAlt: string
}

export type DestinationTab = { id: "all" | DestinationCategory; label: string; count: number }

export type DestinationList = { tabs: DestinationTab[]; items: DestinationDTO[] }
