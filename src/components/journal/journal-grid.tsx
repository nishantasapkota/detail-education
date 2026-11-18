"use client"

import { useState } from "react"

import { ArticleCard } from "@/components/marketing/journal"
import { cn } from "@/lib/utils"
import type { Article } from "@/services/content.service"

/** All articles with category chips that filter in place. */
export function JournalGrid({ articles }: { articles: Article[] }) {
  const categories = [...new Set(articles.map((a) => a.category))]
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? articles.filter((a) => a.category === active) : articles

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={active === c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                active === c ? "border-brand-forest bg-brand-forest text-white" : "border-gray-200 bg-white hover:border-brand-forest"
              )}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((a) => (
          <ArticleCard key={a.slug} article={a} tone="light" />
        ))}
      </div>
    </>
  )
}
