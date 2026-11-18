import type { Metadata } from "next"
import Link from "next/link"

import { JournalGrid } from "@/components/journal/journal-grid"
import { getArticles, getHomeContent } from "@/services/content.service"

export async function generateMetadata(): Promise<Metadata> {
  const c = await getHomeContent()
  return { title: "Journal", description: c.journalIntro }
}

export default async function JournalPage() {
  const [content, articles] = await Promise.all([getHomeContent(), getArticles()])

  return (
    <div className="bg-brand-cream/60">
      <header className="bg-brand-forest pt-20 pb-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <span className="mb-3 block text-[11px] font-semibold tracking-wider text-brand-gold uppercase">{content.journalKicker}</span>
          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{content.journalTitle}</h1>
          <p className="mt-4 max-w-2xl text-emerald-100/80">{content.journalIntro}</p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-2xl text-brand-forest">New guides are on their way.</p>
            <p className="mt-2 text-gray-600">
              Questions in the meantime?{" "}
              <Link href="/#consultation" className="text-brand-forest underline underline-offset-4">
                Talk to a counsellor
              </Link>
              .
            </p>
          </div>
        ) : (
          <JournalGrid articles={articles} />
        )}
      </div>
    </div>
  )
}
