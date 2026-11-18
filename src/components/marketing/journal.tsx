import Image from "next/image"
import Link from "next/link"

import { Reveal } from "@/components/motion/reveal"
import { formatArticleDate } from "@/lib/format"
import type { Article, HomeContent } from "@/services/content.service"

/** Home section: up to three published articles. Hidden when there are none. */
export function Journal({ content: c, articles }: { content: HomeContent; articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section id="journal" className="scroll-mt-20 border-t border-white/10 bg-brand-forest py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 block text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{c.journalKicker}</span>
            <h2 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl lg:text-[44px]">{c.journalTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-100/80 sm:text-base">{c.journalIntro}</p>
          </div>
          <Link
            href="/journal"
            className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-gold transition-colors hover:text-white"
          >
            All articles <span className="text-sm transition-transform duration-200 group-hover:translate-x-1.5">→</span>
          </Link>
        </Reveal>

        <Reveal stagger={0.1} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export function ArticleCard({ article: a, tone = "dark" }: { article: Article; tone?: "dark" | "light" }) {
  const dark = tone === "dark"
  return (
    <article
      className={
        dark
          ? "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-2xl"
          : "group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-xl"
      }
    >
      <div className="relative h-48 w-full overflow-hidden bg-brand-forest-dark">
        {a.coverImage && (
          <Image
            src={a.coverImage}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className={`mb-3 flex items-center justify-between gap-2 text-[11px] ${dark ? "text-emerald-200/80" : "text-gray-500"}`}>
            <span
              className={`rounded px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${dark ? "bg-white/10 text-brand-gold" : "bg-amber-50 text-amber-800"}`}
            >
              {a.category}
            </span>
            <span>
              {a.readMinutes} min read • {formatArticleDate(a.publishedAt)}
            </span>
          </div>
          <h3
            className={`mb-3 font-serif text-xl leading-snug font-semibold transition-colors ${dark ? "group-hover:text-brand-gold" : "text-brand-forest group-hover:text-amber-700"}`}
          >
            {/* The whole card is clickable via this stretched link. */}
            <Link href={`/journal/${a.slug}`} className="after:absolute after:inset-0">
              {a.title}
            </Link>
          </h3>
          <p className={`mb-6 text-xs leading-relaxed ${dark ? "text-emerald-100/75" : "text-gray-600"}`}>{a.excerpt}</p>
        </div>
        <div className={`flex items-center justify-between border-t pt-4 text-xs ${dark ? "border-white/10" : "border-gray-100"}`}>
          <span className={`font-medium ${dark ? "text-emerald-200/60" : "text-gray-500"}`}>By {a.author}</span>
          <span
            className={`inline-flex items-center gap-1 font-semibold transition-all duration-200 group-hover:translate-x-1 ${dark ? "text-brand-gold group-hover:text-white" : "text-brand-forest"}`}
          >
            Read guide →
          </span>
        </div>
      </div>
    </article>
  )
}
