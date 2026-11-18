import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

/** Prev/next links that keep the current search params. */
export function Pagination({
  basePath,
  params,
  page,
  totalPages,
  total,
}: {
  basePath: string
  params: Record<string, string | undefined>
  page: number
  totalPages: number
  total: number
}) {
  if (totalPages <= 1) return <p className="px-4 py-3 text-xs text-muted-foreground">{total} total</p>
  const href = (p: number) => {
    const sp = new URLSearchParams(
      Object.entries({ ...params, page: p > 1 ? String(p) : undefined }).filter(
        (e): e is [string, string] => !!e[1]
      )
    )
    return `${basePath}${sp.size ? `?${sp}` : ""}`
  }
  return (
    <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="flex gap-2">
        {page > 1 && (
          <Link href={href(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Previous
          </Link>
        )}
        {page < totalPages && (
          <Link href={href(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Next
          </Link>
        )}
      </div>
    </div>
  )
}
