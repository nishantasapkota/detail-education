import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/** Shared building blocks for admin pages. */

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string
  description?: string
  back?: { href: string; label: string }
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← {back.label}
          </Link>
        )}
        <h1 className="font-serif text-3xl font-medium tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("rounded-xl border bg-card text-card-foreground shadow-xs", className)} {...props} />
}

export function PanelHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
      <div>
        <h2 className="font-medium">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

const TONES: Record<string, string> = {
  green: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  amber: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  blue: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
  violet: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
  red: "bg-red-500/12 text-red-700 dark:text-red-300",
  gray: "bg-muted text-muted-foreground",
}

/** Status words map to a tone; unknown words are gray. */
const STATUS_TONE: Record<string, keyof typeof TONES> = {
  published: "green",
  active: "green",
  enrolled: "green",
  approved: "green",
  confirmed: "green",
  attended: "green",
  new: "blue",
  submitted: "blue",
  pending: "amber",
  contacted: "amber",
  counselling: "violet",
  "in review": "violet",
  applied: "violet",
  draft: "gray",
  closed: "gray",
  lost: "red",
  rejected: "red",
  cancelled: "red",
  "no show": "red",
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const tone = TONES[STATUS_TONE[status.toLowerCase()] ?? "gray"]
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", tone, className)}>
      {status}
    </span>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export const formatDate = (iso: string | Date | null | undefined, withTime = false) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime && { hour: "numeric", minute: "2-digit" }),
        timeZone: "Asia/Kathmandu",
      }).format(new Date(iso))
    : "—"
