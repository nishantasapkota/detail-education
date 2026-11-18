import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState, formatDate, PageHeader, Panel } from "@/components/admin/page-parts"
import { buttonVariants } from "@/components/ui/button"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { listActivity } from "@/services/activity.service"

export const metadata: Metadata = { title: "Activity log" }

const PER_PAGE = 50

export default async function ActivityPage({ searchParams }: PageProps<"/admin/activity">) {
  await requireUserOrRedirect("activity.view")
  const page = Math.max(Number((await searchParams).page) || 1, 1)
  const items = await listActivity(PER_PAGE + 1, page)
  const hasMore = items.length > PER_PAGE

  return (
    <>
      <PageHeader title="Activity log" description="Who changed what, newest first." />
      <Panel>
        {items.length === 0 ? (
          <EmptyState title="No activity yet" />
        ) : (
          <ul className="divide-y text-sm">
            {items.slice(0, PER_PAGE).map((a) => (
              <li key={a.id} className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex-1">
                  <span className="font-medium">{a.actorName}</span> {a.action} {a.resource.toLowerCase()}{" "}
                  {a.href ? (
                    <Link href={a.href} className="hover:underline">
                      {a.title}
                    </Link>
                  ) : (
                    a.title
                  )}
                </span>
                <span className="text-xs whitespace-nowrap text-muted-foreground">{formatDate(a.at, true)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          {page > 1 && (
            <Link href={`/admin/activity?page=${page - 1}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Newer
            </Link>
          )}
          {hasMore && (
            <Link href={`/admin/activity?page=${page + 1}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Older
            </Link>
          )}
        </div>
      </Panel>
    </>
  )
}
