import { Plus } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ResourceTable } from "@/components/admin/cms/resource-table"
import { ListToolbar } from "@/components/admin/list-toolbar"
import { EmptyState, PageHeader, Panel } from "@/components/admin/page-parts"
import { Pagination } from "@/components/admin/pagination"
import { buttonVariants } from "@/components/ui/button"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { getResource } from "@/lib/cms/registry"
import { listItems } from "@/services/cms.service"

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export async function generateMetadata({ params }: PageProps<"/admin/[resource]">): Promise<Metadata> {
  const def = getResource((await params).resource)
  return { title: def?.plural ?? "Not found" }
}

export default async function ResourceListPage({ params, searchParams }: PageProps<"/admin/[resource]">) {
  const def = getResource((await params).resource)
  if (!def) notFound()
  await requireUserOrRedirect(def.permission)

  const sp = await searchParams
  const query = { q: first(sp.q), filter: first(sp.filter), page: Number(first(sp.page)) || 1 }
  const list = await listItems(def, query)
  const isFiltered = !!(query.q || query.filter)

  return (
    <>
      <PageHeader
        title={def.plural}
        description={def.description}
        actions={
          <Link href={`/admin/${def.key}/new`} className={buttonVariants()}>
            <Plus /> New {def.singular.toLowerCase()}
          </Link>
        }
      />
      <Panel>
        <ListToolbar
          placeholder={`Search ${def.plural.toLowerCase()}`}
          filter={def.filter && { label: def.filter.label, options: def.filter.options }}
        />
        {list.items.length === 0 ? (
          <EmptyState
            title={isFiltered ? "Nothing matches" : `No ${def.plural.toLowerCase()} yet`}
            description={isFiltered ? "Try a different search or filter." : def.description}
            action={
              !isFiltered && (
                <Link href={`/admin/${def.key}/new`} className={buttonVariants({ variant: "outline" })}>
                  Create the first one
                </Link>
              )
            }
          />
        ) : (
          <ResourceTable resourceKey={def.key} items={list.items} />
        )}
        <Pagination
          basePath={`/admin/${def.key}`}
          params={{ q: query.q, filter: query.filter }}
          page={list.page}
          totalPages={list.totalPages}
          total={list.total}
        />
      </Panel>
    </>
  )
}
