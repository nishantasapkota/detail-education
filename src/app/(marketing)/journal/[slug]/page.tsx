import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { RichContent } from "@/components/journal/rich-content"
import { MediaImage } from "@/components/ui/media-image"
import { ArticleCard } from "@/components/marketing/journal"
import { GoldButton } from "@/components/marketing/gold-button"
import { formatLongDate } from "@/lib/format"
import { getArticle, getArticles } from "@/services/content.service"

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const article = await getArticle((await params).slug)
  if (!article) return { title: "Not found" }
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    openGraph: { type: "article", publishedTime: article.publishedAt, images: article.coverImage ? [article.coverImage] : undefined },
  }
}

export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-brand-cream/60" />}>
      <ArticleView params={params} />
    </Suspense>
  )
}

async function ArticleView({ params }: Pick<PageProps<"/journal/[slug]">, "params">) {
  const { slug } = await params
  const [article, all] = await Promise.all([getArticle(slug), getArticles({ limit: 4 })])
  if (!article) notFound()
  const more = all.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <article className="bg-white">
      <header className="bg-brand-forest pt-16 pb-12 text-white">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/journal" className="text-sm text-emerald-100/70 hover:text-white">
            ← Journal
          </Link>
          <p className="mt-6 text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{article.category}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-sm text-emerald-100/75">
            By {article.author} · {formatLongDate(article.publishedAt)} · {article.readMinutes} min read
          </p>
        </div>
      </header>

      {article.coverImage && (
        <div className="mx-auto -mb-4 max-w-4xl px-6 pt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
            <MediaImage src={article.coverImage} alt="" fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-14">
        <p className="mb-8 font-serif text-xl leading-relaxed text-gray-700">{article.excerpt}</p>
        {article.body ? <RichContent className="text-[17px] text-gray-800">{article.body}</RichContent> : null}

        <aside className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand-cream p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-xl text-brand-forest">Want advice for your situation?</p>
            <p className="mt-1 text-sm text-gray-600">The first session is free, for students and parents.</p>
          </div>
          <GoldButton href="/#consultation" size="sm">
            Book free counselling
          </GoldButton>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="border-t border-gray-100 bg-brand-cream/60 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <h2 className="mb-8 font-serif text-2xl text-brand-forest">More from the journal</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <ArticleCard key={a.slug} article={a} tone="light" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
