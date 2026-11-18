import type { MetadataRoute } from "next"

import { getArticles } from "@/services/content.service"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  const articles = await getArticles()
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.8 },
    ...articles.map((a) => ({ url: `${base}/journal/${a.slug}`, lastModified: a.publishedAt, priority: 0.6 })),
    { url: `${base}/privacy`, priority: 0.2 },
    { url: `${base}/terms`, priority: 0.2 },
  ]
}
