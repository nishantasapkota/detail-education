import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import {
  DOCUMENTATION_COUNTRY_ORDER,
  type DocumentationCountryId,
} from "@/config/documentation"
import {
  ABOUT_DEFAULTS,
  BUSINESS_DEFAULTS,
  HOME_DEFAULTS,
  SEED_COURSES,
  SEED_SERVICES,
  SEED_TEAM,
  SEED_TESTIMONIALS,
} from "@/data/site-content"
import {
  DOCUMENTATION_TIMELINES,
  type DocumentationTimelineData,
} from "@/data/documentation-timelines"
import { serializeDoc, type CmsDoc } from "@/lib/cms/serialize"
import { about, business, home, privacy, terms } from "@/lib/cms/singletons"
import { connectDB } from "@/lib/db/mongoose"
import { readSingletonValues } from "@/services/singleton.service"

/**
 * Everything the public site reads, cached and tagged. Admin saves call
 * updateTag(<tag>), so edits show up immediately while pages stay static.
 * Each getter falls back to bundled starter content if the database is empty
 * or unreachable, so the site never renders blank.
 */

export type HomeContent = typeof HOME_DEFAULTS
export type AboutContent = typeof ABOUT_DEFAULTS
export type BusinessContent = typeof BUSINESS_DEFAULTS & { whatsappUrl: string }

export type Service = {
  slug: string
  title: string
  stage: string
  summary: string
  linkLabel: string
}
export type Course = {
  slug: string
  name: string
  tag: string
  summary: string
  points: string[]
  duration: string
  fee: string | null
}
export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  photo: string | null
  verified: boolean
}
export type Partner = {
  id: string
  name: string
  country: string
  logo: string | null
  website: string | null
}
export type VisaSuccess = {
  id: string
  name: string
  country: string
  university: string | null
  intake: string | null
  photo: string
}
export type DocumentationTimeline = DocumentationTimelineData
export type TeamMember = {
  name: string
  title: string
  bio: string
  quote: string | null
  yearsExperience: number
  photo: string | null
  featured: boolean
}
export type Article = {
  slug: string
  title: string
  category: string
  excerpt: string
  body: string
  coverImage: string | null
  author: string
  readMinutes: number
  publishedAt: string
  featured: boolean
  seoTitle: string | null
  seoDescription: string | null
}

async function find(
  collection: string,
  filter: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  limit = 0
) {
  const conn = await connectDB()
  const cursor = conn.connection.collection(collection).find(filter).sort(sort)
  if (limit) cursor.limit(limit)
  return (await cursor.toArray()).map(serializeDoc)
}

/** Runs a query; on an empty result or error, returns the fallback instead. */
async function withFallback<T>(
  label: string,
  query: () => Promise<T[]>,
  fallback: () => T[]
): Promise<T[]> {
  if (!process.env.MONGODB_URI) return fallback()
  try {
    const rows = await query()
    return rows.length ? rows : fallback()
  } catch (error) {
    console.error(`[content] ${label} read failed; using defaults`, error)
    return fallback()
  }
}

const pick = <T>(doc: CmsDoc, keys: (keyof T)[]) =>
  Object.fromEntries(keys.map((k) => [k, doc[k as string] ?? null])) as T

export async function getHomeContent(): Promise<HomeContent> {
  "use cache"
  cacheLife("days")
  cacheTag("page-home")
  return readSingletonValues<HomeContent>(home)
}

export async function getAboutContent(): Promise<AboutContent> {
  "use cache"
  cacheLife("days")
  cacheTag("page-about")
  return readSingletonValues<AboutContent>(about)
}

export async function getBusiness(): Promise<BusinessContent> {
  "use cache"
  cacheLife("days")
  cacheTag("business")
  const values = await readSingletonValues<typeof BUSINESS_DEFAULTS>(business)
  return { ...values, whatsappUrl: `https://wa.me/${values.whatsappNumber}` }
}

export async function getLegalPage(
  key: "privacy" | "terms"
): Promise<{ title: string; body: string }> {
  "use cache"
  cacheLife("days")
  cacheTag(`page-${key}`)
  return readSingletonValues(key === "privacy" ? privacy : terms)
}

export async function getServices(): Promise<Service[]> {
  "use cache"
  cacheLife("days")
  cacheTag("services")
  const keys: (keyof Service)[] = ["slug", "title", "stage", "summary", "linkLabel"]
  return withFallback(
    "services",
    async () =>
      (await find("services", { published: true }, { order: 1 })).map((d) =>
        pick<Service>(d, keys)
      ),
    () => SEED_SERVICES
  )
}

/** Published, CMS-managed student visa roadmaps, with bundled defaults for a fresh database. */
export async function getDocumentationTimelines(): Promise<DocumentationTimeline[]> {
  "use cache"
  cacheLife("days")
  cacheTag("documentation-timelines")

  const fallback = DOCUMENTATION_COUNTRY_ORDER.map((id) =>
    DOCUMENTATION_TIMELINES.find((item) => item.id === id)
  ).filter((item): item is DocumentationTimeline => item !== undefined)
  if (!process.env.MONGODB_URI) return fallback

  try {
    const rows = await find("documentation_timelines", {}, { order: 1 })
    if (!rows.length) return fallback
    return rows
      .filter((row) => Boolean(row.published))
      .map((row) => {
        const stages = Array.isArray(row.stages) ? row.stages : []
        return {
          id: String(row.countryId) as DocumentationCountryId,
          name: String(row.country ?? ""),
          code: String(row.code ?? ""),
          route: String(row.route ?? ""),
          targetIntakes: String(row.targetIntakes ?? ""),
          guideTimeline: String(row.guideTimeline ?? ""),
          authority: String(row.authority ?? ""),
          officialLabel: String(row.officialLabel ?? ""),
          officialUrl: String(row.officialUrl ?? ""),
          notes: Array.isArray(row.notes) ? row.notes.map(String) : [],
          steps: stages.map((stage) => {
            const storedDocuments = stage.documents
            const documents = Array.isArray(storedDocuments)
              ? storedDocuments.map(String)
              : String(storedDocuments ?? "")
                  .split(/\r?\n/)
                  .map((document) => document.trim())
                  .filter(Boolean)
            return {
              timing: String(stage.timing ?? ""),
              title: String(stage.title ?? ""),
              description: String(stage.description ?? ""),
              documents,
            }
          }),
        }
      })
  } catch (error) {
    console.error("[content] documentation timelines read failed; using defaults", error)
    return fallback
  }
}

export async function getCourses(): Promise<Course[]> {
  "use cache"
  cacheLife("days")
  cacheTag("courses")
  const keys: (keyof Course)[] = [
    "slug",
    "name",
    "tag",
    "summary",
    "points",
    "duration",
    "fee",
  ]
  return withFallback(
    "courses",
    async () =>
      (await find("courses", { published: true }, { order: 1 })).map((d) =>
        pick<Course>(d, keys)
      ),
    () => SEED_COURSES
  )
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache"
  cacheLife("days")
  cacheTag("testimonials")
  return withFallback(
    "testimonials",
    async () =>
      (await find("testimonials", { published: true }, { order: 1, createdAt: -1 })).map(
        (d) => ({
          id: d.id,
          name: String(d.name),
          role: String(d.role ?? ""),
          quote: String(d.quote),
          photo: (d.photo as string | null) ?? null,
          verified: !!d.verified,
        })
      ),
    () => SEED_TESTIMONIALS.map((t, i) => ({ ...t, id: String(i) }))
  )
}

/** Published partner institutions for the home page logo marquee. Empty → the section is hidden. */
export async function getPartners(): Promise<Partner[]> {
  "use cache"
  cacheLife("days")
  cacheTag("partners")
  return withFallback(
    "partners",
    async () =>
      (await find("partners", { published: true }, { order: 1, name: 1 })).map((d) => ({
        id: d.id,
        name: String(d.name),
        country: String(d.country ?? ""),
        logo: (d.logo as string | null) ?? null,
        website: (d.website as string | null) ?? null,
      })),
    () => []
  )
}

/** Published visa grants with a photo, for the home page gallery. Empty → the section is hidden. */
export async function getVisaSuccesses(): Promise<VisaSuccess[]> {
  "use cache"
  cacheLife("days")
  cacheTag("visas")
  return withFallback(
    "visas",
    async () =>
      (
        await find(
          "visa_successes",
          { published: true, photo: { $nin: [null, ""] } },
          { order: 1, createdAt: -1 }
        )
      ).map((d) => ({
        id: d.id,
        name: String(d.name),
        country: String(d.country ?? ""),
        university: (d.university as string | null) ?? null,
        intake: (d.intake as string | null) ?? null,
        photo: String(d.photo),
      })),
    () => []
  )
}

/** The member shown in the "personal attention" card: featured first, else the first. */
export async function getFeaturedTeamMember(): Promise<TeamMember | null> {
  "use cache"
  cacheLife("days")
  cacheTag("team")
  const keys: (keyof TeamMember)[] = [
    "name",
    "title",
    "bio",
    "quote",
    "yearsExperience",
    "photo",
    "featured",
  ]
  const rows = await withFallback(
    "team",
    async () =>
      (await find("team", { published: true }, { featured: -1, order: 1 }, 1)).map((d) =>
        pick<TeamMember>(d, keys)
      ),
    () => SEED_TEAM
  )
  return rows[0] ?? null
}

/** Everyone published on Team, featured first, for the about page. */
export async function getTeam(): Promise<TeamMember[]> {
  "use cache"
  cacheLife("days")
  cacheTag("team")
  const keys: (keyof TeamMember)[] = [
    "name",
    "title",
    "bio",
    "quote",
    "yearsExperience",
    "photo",
    "featured",
  ]
  return withFallback(
    "team",
    async () =>
      (await find("team", { published: true }, { featured: -1, order: 1 })).map((d) =>
        pick<TeamMember>(d, keys)
      ),
    () => SEED_TEAM
  )
}

const ARTICLE_KEYS: (keyof Article)[] = [
  "slug",
  "title",
  "category",
  "excerpt",
  "body",
  "coverImage",
  "author",
  "readMinutes",
  "publishedAt",
  "featured",
  "seoTitle",
  "seoDescription",
]

const livingArticles = () => ({ status: "published", publishedAt: { $lte: new Date() } })

/**
 * Published articles, newest first. No fallback: seed articles are drafts,
 * so an empty journal simply hides its home section.
 */
export async function getArticles(
  options: { limit?: number; featuredFirst?: boolean } = {}
): Promise<Article[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("articles")
  if (!process.env.MONGODB_URI) return []
  try {
    const sort: Record<string, 1 | -1> = options.featuredFirst
      ? { featured: -1, publishedAt: -1 }
      : { publishedAt: -1 }
    const docs = await find("articles", livingArticles(), sort, options.limit ?? 0)
    return docs.map((d) => pick<Article>(d, ARTICLE_KEYS))
  } catch (error) {
    console.error("[content] articles read failed", error)
    return []
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("articles")
  if (!process.env.MONGODB_URI || !/^[a-z0-9-]{1,80}$/.test(slug)) return null
  const [doc] = await find(
    "articles",
    { ...livingArticles(), slug },
    { publishedAt: -1 },
    1
  )
  return doc ? pick<Article>(doc, ARTICLE_KEYS) : null
}
