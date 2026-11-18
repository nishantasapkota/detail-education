import { articles } from "@/lib/cms/resources/articles"
import { courses } from "@/lib/cms/resources/courses"
import { destinations } from "@/lib/cms/resources/destinations"
import { events } from "@/lib/cms/resources/events"
import { partners } from "@/lib/cms/resources/partners"
import { services } from "@/lib/cms/resources/services"
import { team } from "@/lib/cms/resources/team"
import { testimonials } from "@/lib/cms/resources/testimonials"
import type { ResourceDef } from "@/lib/cms/types"

/** Every CMS content type, by URL key (/admin/<key>). */
export const RESOURCES = {
  destinations,
  articles,
  courses,
  services,
  testimonials,
  team,
  partners,
  events,
} satisfies Record<string, ResourceDef>

export type ResourceKey = keyof typeof RESOURCES

export function getResource(key: string): ResourceDef | null {
  return (RESOURCES as Record<string, ResourceDef>)[key] ?? null
}
