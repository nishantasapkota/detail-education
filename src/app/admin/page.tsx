import { ArrowUpRight, Inbox, Newspaper, UserRoundCheck, UsersRound } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { EmptyState, formatDate, PageHeader, Panel, PanelHeader, StatusPill } from "@/components/admin/page-parts"
import { can } from "@/lib/auth/roles"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { RESOURCES } from "@/lib/cms/registry"
import { listActivity } from "@/services/activity.service"
import { countItems } from "@/services/cms.service"
import { leadStats } from "@/services/lead.service"

export const metadata: Metadata = { title: "Dashboard" }

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kathmandu" }).format(new Date())
  )
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
}

export default async function DashboardPage() {
  const user = await requireUserOrRedirect("dashboard.view")
  const seesLeads = can(user.role, "leads.manage")

  const [leads, published, drafts, activity] = await Promise.all([
    seesLeads ? leadStats() : null,
    countItems(RESOURCES.articles, { status: "published" }),
    countItems(RESOURCES.articles, { status: "draft" }),
    can(user.role, "activity.view") ? listActivity(8) : null,
  ])
  const maxStatus = Math.max(1, ...(leads?.byStatus.map((s) => s.count) ?? [1]))

  const stats = [
    ...(leads
      ? [
          { label: "New leads this week", value: leads.newThisWeek, icon: Inbox, href: "/admin/leads?status=new" },
          { label: "Open leads", value: leads.open, icon: UsersRound, href: "/admin/leads" },
          { label: "New & unassigned", value: leads.unassignedNew, icon: UserRoundCheck, href: "/admin/leads?status=new" },
        ]
      : []),
    { label: "Published articles", value: published, icon: Newspaper, href: "/admin/articles?filter=published", note: `${drafts} draft${drafts === 1 ? "" : "s"}` },
  ]

  return (
    <>
      <PageHeader title={`${greeting()}, ${user.name.split(" ")[0]}`} description="Here is what is happening at Detail." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Panel className="flex h-full items-start justify-between p-5 transition-colors group-hover:border-brand-gold/60">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-serif text-3xl tabular-nums">{s.value}</p>
                {"note" in s && <p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p>}
              </div>
              <s.icon className="size-5 text-brand-gold" />
            </Panel>
          </Link>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        {leads && (
          <Panel>
            <PanelHeader
              title="Latest leads"
              actions={
                <Link href="/admin/leads" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  All leads <ArrowUpRight className="size-3.5" />
                </Link>
              }
            />
            {leads.recent.length === 0 ? (
              <EmptyState title="No leads yet" description="Consultation requests from the website appear here." />
            ) : (
              <ul className="divide-y">
                {leads.recent.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{l.fullName}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {l.country} · {l.studyLevel}
                        </span>
                      </span>
                      <StatusPill status={l.status} />
                      <span className="hidden w-24 text-right text-xs text-muted-foreground sm:block">{formatDate(l.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}

        <div className="space-y-6">
          {leads && (
            <Panel>
              <PanelHeader title="Pipeline" description="Leads by stage" />
              <ul className="space-y-3 p-5">
                {leads.byStatus.map((s) => (
                  <li key={s.status}>
                    <Link href={`/admin/leads?status=${s.status}`} className="group block">
                      <span className="mb-1 flex justify-between text-sm capitalize">
                        <span className="group-hover:underline">{s.status}</span>
                        <span className="tabular-nums text-muted-foreground">{s.count}</span>
                      </span>
                      <span className="block h-2 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-brand-forest-mid dark:bg-brand-gold"
                          style={{ width: `${(s.count / maxStatus) * 100}%` }}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {activity && (
            <Panel>
              <PanelHeader
                title="Recent activity"
                actions={
                  <Link href="/admin/activity" className="text-sm text-muted-foreground hover:text-foreground">
                    View all
                  </Link>
                }
              />
              {activity.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nothing yet.</p>
              ) : (
                <ul className="divide-y text-sm">
                  {activity.map((a) => (
                    <li key={a.id} className="px-5 py-3">
                      <span className="font-medium">{a.actorName}</span> {a.action} {a.resource.toLowerCase()}{" "}
                      {a.href ? (
                        <Link href={a.href} className="underline-offset-4 hover:underline">
                          {a.title}
                        </Link>
                      ) : (
                        a.title
                      )}
                      <span className="block text-xs text-muted-foreground">{formatDate(a.at, true)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      </div>
    </>
  )
}
