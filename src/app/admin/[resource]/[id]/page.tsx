import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ResourceForm } from "@/components/admin/cms/resource-form"
import { formatDate, PageHeader } from "@/components/admin/page-parts"
import { AppError } from "@/lib/api/errors"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { getResource } from "@/lib/cms/registry"
import { getItem } from "@/services/cms.service"

export async function generateMetadata({ params }: PageProps<"/admin/[resource]/[id]">): Promise<Metadata> {
  const def = getResource((await params).resource)
  return { title: def ? `Edit ${def.singular.toLowerCase()}` : "Not found" }
}

export default async function EditResourcePage({ params }: PageProps<"/admin/[resource]/[id]">) {
  const { resource, id } = await params
  const def = getResource(resource)
  if (!def) notFound()
  await requireUserOrRedirect(def.permission)

  const item = await getItem(def, id).catch((error: unknown) => {
    if (error instanceof AppError && error.code === "NOT_FOUND") notFound()
    throw error
  })

  return (
    <>
      <PageHeader
        title={String(item[def.titleField] ?? def.singular)}
        description={`Last updated ${formatDate(item.updatedAt, true)}`}
        back={{ href: `/admin/${def.key}`, label: def.plural }}
      />
      <ResourceForm resourceKey={def.key} item={item} />
    </>
  )
}
