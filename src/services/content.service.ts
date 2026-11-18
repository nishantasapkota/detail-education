import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import {
  BUSINESS_DEFAULTS,
  HOME_DEFAULTS,
  SEED_COURSES,
  SEED_SERVICES,
  SEED_TEAM,
  SEED_TESTIMONIALS,
} from "@/data/site-content"
import { serializeDoc, type CmsDoc } from "@/lib/cms/serialize"
import { business, home, privacy, terms } from "@/lib/cms/singletons"
import { connectDB } from "@/lib/db/mongoose"
import { readSingletonValues } from "@/services/singleton.service"

/**
 * Everything the public site reads, cached and tagged. Admin saves call
 * updateTag(<tag>), so edits show up immediately while pages stay static.
 * Each getter falls back to bundled starter content if the database is empty
 * or unreachable, so the site never renders blank.
 */

export type HomeContent = typeof HOME_DEFAULTS
export type BusinessContent = typeof BUSINESS_DEFAULTS & { whatsappUrl: string }

export type Service = { slug: string; title: string; stage: string; summary: string; linkLabel: string }
export type Course = { slug: string; name: string; tag: string; summary: string; points: string[]; duration: string; fee: string | null }
export type Testimonial = { id: string; name: string; role: string; quote: string; photo: string | null; verified: boolean }
export type TeamMember = { name: string; title: string; bio: string; quote: string | null; yearsExperience: number; photo: string | null; featured: boolean }
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

async function find(collection: string, filter: Record<string, unknown>, sort: Record<string, 1 | -1>, limit = 0) {
  const conn = await connectDB()
  const cursor = conn.connection.collection(collection).find(filter).sort(sort)
  if (limit) cursor.limit(limit)
  return (await cursor.toArray()).map(serializeDoc)
}

/** Runs a query; on an empty result or error, returns the fallback instead. */
async function withFallback<T>(label: string, query: () => Promise<T[]>, fallback: () => T[]): Promise<T[]> {
  if (!process.env.MONGODB_URI) return fallback()
  try {
    const rows = await query()
    return rows.length ? rows : fallback()
  } catch (error) {
    console.error(`[content] ${label} read failed; using defaults`, error)
    return fallback()
  }
}

const pick = <T,>(doc: CmsDoc, keys: (keyof T)[]) => Object.fromEntries(keys.map((k) => [k, doc[k as string] ?? null])) as T

export async function getHomeContent(): Promise<HomeContent> {
  "use cache"
  cacheLife("days")
  cacheTag("page-home")
  return readSingletonValues<HomeContent>(home)
}

export async function getBusiness(): Promise<BusinessContent> {
  "use cache"
  cacheLife("days")
  cacheTag("business")
  const values = await readSingletonValues<typeof BUSINESS_DEFAULTS>(business)
  return { ...values, whatsappUrl: `https://wa.me/${values.whatsappNumber}` }
}

export async function getLegalPage(key: "privacy" | "terms"): Promise<{ title: string; body: string }> {
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
    async () => (await find("services", { published: true }, { order: 1 })).map((d) => pick<Service>(d, keys)),
    () => SEED_SERVICES
  )
}

export async function getCourses(): Promise<Course[]> {
  "use cache"
  cacheLife("days")
  cacheTag("courses")
  const keys: (keyof Course)[] = ["slug", "name", "tag", "summary", "points", "duration", "fee"]
  return withFallback(
    "courses",
    async () => (await find("courses", { published: true }, { order: 1 })).map((d) => pick<Course>(d, keys)),
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
      (await find("testimonials", { published: true }, { order: 1, createdAt: -1 })).map((d) => ({
        id: d.id,
        name: String(d.name),
        role: String(d.role ?? ""),
        quote: String(d.quote),
        photo: (d.photo as string | null) ?? null,
        verified: !!d.verified,
      })),
    () => SEED_TESTIMONIALS.map((t, i) => ({ ...t, id: String(i) }))
  )
}

/** The member shown in the "personal attention" card: featured first, else the first. */
export async function getFeaturedTeamMember(): Promise<TeamMember | null> {
  "use cache"
  cacheLife("days")
  cacheTag("team")
  const keys: (keyof TeamMember)[] = ["name", "title", "bio", "quote", "yearsExperience", "photo", "featured"]
  const rows = await withFallback(
    "team",
    async () => (await find("team", { published: true }, { featured: -1, order: 1 }, 1)).map((d) => pick<TeamMember>(d, keys)),
    () => SEED_TEAM
  )
  return rows[0] ?? null
}

const ARTICLE_KEYS: (keyof Article)[] = [
  "slug", "title", "category", "excerpt", "body", "coverImage", "author", "readMinutes", "publishedAt", "featured", "seoTitle", "seoDescription",
]

const livingArticles = () => ({ status: "published", publishedAt: { $lte: new Date() } })

/**
 * Published articles, newest first. No fallback: seed articles are drafts,
 * so an empty journal simply hides its home section.
 */
export async function getArticles(options: { limit?: number; featuredFirst?: boolean } = {}): Promise<Article[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("articles")
  if (!process.env.MONGODB_URI) return []
  try {
    const sort: Record<string, 1 | -1> = options.featuredFirst ? { featured: -1, publishedAt: -1 } : { publishedAt: -1 }
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
  const [doc] = await find("articles", { ...livingArticles(), slug }, { publishedAt: -1 }, 1)
  return doc ? pick<Article>(doc, ARTICLE_KEYS) : null
}
