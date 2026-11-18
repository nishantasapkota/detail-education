import type { Metadata } from "next"

import { MediaLibrary } from "@/components/admin/media/media-library"
import { PageHeader } from "@/components/admin/page-parts"
import { requireUserOrRedirect } from "@/lib/auth/session"
import { isCloudinaryEnabled } from "@/lib/env"
import { listMedia } from "@/services/media.service"

export const metadata: Metadata = { title: "Media library" }

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  await requireUserOrRedirect("media.manage")
  const sp = await searchParams
  const q = typeof sp.q === "string" ? sp.q : undefined
  const page = Math.max(Number(sp.page) || 1, 1)
  const data = await listMedia({ q, page, limit: 30 })

  return (
    <>
      <PageHeader
        title="Media library"
        description={`Images used across the site. Stored in ${isCloudinaryEnabled() ? "Cloudinary" : "MongoDB"}.`}
      />
      <MediaLibrary initial={data} query={q ?? ""} />
    </>
  )
}
