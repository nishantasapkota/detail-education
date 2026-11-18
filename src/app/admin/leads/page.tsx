import type { Metadata } from "next"
import Link from "next/link"

import { AddLeadButton } from "@/components/admin/leads/add-lead"
import { ListToolbar } from "@/components/admin/list-toolbar"
import { EmptyState, formatDate, PageHeader, Panel, StatusPill } from "@/components/admin/page-parts"
import { Pagination } from "@/components/admin/pagination"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { LEAD_STATUSES } from "@/lib/validations/lead"
import { cn } from "@/lib/utils"
import { listLeads } from "@/services/lead.service"

export const metadata: Metadata = { title: "Leads" }

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const user = await requireUserOrRedirect("leads.manage")
  const sp = await searchParams
  const query = {
    q: first(sp.q),
    status: first(sp.status),
    mine: first(sp.mine) === "1",
    page: Number(first(sp.page)) || 1,
  }
  const data = await listLeads({ ...query, userId: user.id })

  const tabHref = (status?: string) => {
    const p = new URLSearchParams()
    if (status) p.set("status", status)
    if (query.q) p.set("q", query.q)
    if (query.mine) p.set("mine", "1")
    return `/admin/leads${p.size ? `?${p}` : ""}`
  }
  const mineHref = () => {
    const p = new URLSearchParams()
    if (query.status) p.set("status", query.status)
    if (query.q) p.set("q", query.q)
    if (!query.mine) p.set("mine", "1")
    return `/admin/leads${p.size ? `?${p}` : ""}`
  }

  return (
    <>
      <PageHeader
        title="Leads"
        description="Consultation requests from the website, plus walk-ins and calls your team adds."
        actions={<AddLeadButton />}
      />

      <Panel>
        <div className="flex flex-wrap items-center gap-1 border-b px-3 pt-3">
          {[{ id: undefined, label: "All", n: data.all }, ...LEAD_STATUSES.map((s) => ({ id: s, label: s, n: data.byStatus[s] }))].map(
            (t) => {
              const active = query.status === t.id || (!query.status && !t.id)
              return (
                <Link
                  key={t.label}
                  href={tabHref(t.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "-mb-px flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-sm capitalize",
                    active ? "border-brand-gold font-medium" : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span className="rounded-full bg-muted px-1.5 text-[11px] tabular-nums">{t.n}</span>
                </Link>
              )
            }
          )}
          <Link
            href={mineHref()}
            className={cn(
              "mb-2 ml-auto rounded-full border px-3 py-1 text-xs",
              query.mine ? "border-brand-forest bg-brand-forest text-white" : "hover:bg-muted"
            )}
          >
            Assigned to me
          </Link>
        </div>
        <ListToolbar placeholder="Search name, phone or email" />

        {data.items.length === 0 ? (
          <EmptyState
            title={query.q || query.status || query.mine ? "No leads match" : "No leads yet"}
            description="New consultation requests from the website land here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Student</th>
                  <th className="px-4 py-2.5 font-medium">Interested in</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Counsellor</th>
                  <th className="px-4 py-2.5 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="font-medium hover:underline">
                        {lead.fullName}
                      </Link>
                      <span className="block text-xs text-muted-foreground">{lead.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.country}
                      <span className="block text-xs text-muted-foreground">{lead.studyLevel}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.assignedName ?? "Unassigned"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(lead.createdAt)}
                      <span className="block text-xs capitalize">{lead.source}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          basePath="/admin/leads"
          params={{ q: query.q, status: query.status, mine: query.mine ? "1" : undefined }}
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
        />
      </Panel>
    </>
  )
}
