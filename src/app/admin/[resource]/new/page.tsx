import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ResourceForm } from "@/components/admin/cms/resource-form"
import { PageHeader } from "@/components/admin/page-parts"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { getResource } from "@/lib/cms/registry"

export async function generateMetadata({ params }: PageProps<"/admin/[resource]/new">): Promise<Metadata> {
  const def = getResource((await params).resource)
  return { title: def ? `New ${def.singular.toLowerCase()}` : "Not found" }
}

export default async function NewResourcePage({ params }: PageProps<"/admin/[resource]/new">) {
  const def = getResource((await params).resource)
  if (!def) notFound()
  await requireUserOrRedirect(def.permission)

  return (
    <>
      <PageHeader title={`New ${def.singular.toLowerCase()}`} back={{ href: `/admin/${def.key}`, label: def.plural }} />
      <ResourceForm resourceKey={def.key} item={null} />
    </>
  )
}
