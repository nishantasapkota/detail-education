"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

import { selectClass } from "@/components/admin/cms/field-input"
import { Input } from "@/components/ui/input"
import type { Option } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

/** Search box + optional filter that live in the URL (?q=&filter=), so lists are linkable. */
export function ListToolbar({
  placeholder = "Search",
  filter,
  filterParam = "filter",
}: {
  placeholder?: string
  filter?: { label: string; options: readonly Option[] }
  filterParam?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get("q") ?? "")
  const [pending, start] = useTransition()

  const push = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    next.delete("page")
    start(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`))
  }

  useEffect(() => {
    if (q === (params.get("q") ?? "")) return
    const t = setTimeout(() => push({ q }), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  return (
    <div className={cn("flex flex-wrap items-center gap-2 border-b p-3", pending && "opacity-70")}>
      <div className="relative min-w-52 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="pl-8" aria-label="Search" />
      </div>
      {filter && (
        <select
          aria-label={filter.label}
          className={cn(selectClass, "w-auto min-w-40")}
          value={params.get(filterParam) ?? ""}
          onChange={(e) => push({ [filterParam]: e.target.value })}
        >
          <option value="">Any {filter.label.toLowerCase()}</option>
          {filter.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
