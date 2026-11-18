import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SingletonForm } from "@/components/admin/cms/singleton-form"
import { formatDate, PageHeader } from "@/components/admin/page-parts"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { PAGES } from "@/lib/cms/singletons"
import type { SingletonDef } from "@/lib/cms/types"
import { readSingleton } from "@/services/singleton.service"

const pageDef = (key: string): SingletonDef | null => (PAGES as Record<string, SingletonDef>)[key] ?? null

export async function generateMetadata({ params }: PageProps<"/admin/pages/[key]">): Promise<Metadata> {
  return { title: pageDef((await params).key)?.title ?? "Not found" }
}

export default async function EditPage({ params }: PageProps<"/admin/pages/[key]">) {
  const def = pageDef((await params).key)
  if (!def) notFound()
  await requireUserOrRedirect(def.permission)
  const { values, updatedAt, updatedByName } = await readSingleton(def)

  return (
    <>
      <PageHeader
        title={def.title}
        description={updatedAt ? `Last edited ${formatDate(updatedAt, true)}${updatedByName ? ` by ${updatedByName}` : ""}` : def.description}
        back={{ href: "/admin/pages", label: "Pages" }}
      />
      <SingletonForm singletonKey={def.key} values={values} />
    </>
  )
}
