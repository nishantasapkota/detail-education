"use client"

import { Copy, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteMediaAction, updateMediaAltAction } from "@/app/admin/media/actions"
import { useMediaUpload } from "@/components/admin/media/use-media-upload"
import { ListToolbar } from "@/components/admin/list-toolbar"
import { EmptyState, formatDate, Panel } from "@/components/admin/page-parts"
import { Button, buttonVariants } from "@/components/ui/button"
import { MediaImage } from "@/components/ui/media-image"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { UPLOAD } from "@/config/site"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/services/media.service"

type Data = { items: MediaItem[]; page: number; totalPages: number; total: number }

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`)

export function MediaLibrary({ initial, query }: { initial: Data; query: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [active, setActive] = useState<MediaItem | null>(null)
  const { upload, progress, uploading } = useMediaUpload(() => router.refresh())

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) void upload(e.dataTransfer.files)
  }

  return (
    <Panel
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(dragging && "ring-2 ring-brand-gold")}
    >
      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <p className="mr-auto text-sm text-muted-foreground">
          {initial.total} image{initial.total === 1 ? "" : "s"} · drop files here or
        </p>
        <Button disabled={uploading} onClick={() => fileRef.current?.click()}>
          <Upload /> {uploading ? `Uploading ${progress}%` : "Upload images"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept={UPLOAD.acceptedTypes.join(",")}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void upload(e.target.files)
            e.target.value = ""
          }}
        />
      </div>
      <ListToolbar placeholder="Search by file name or alt text" />

      {initial.items.length === 0 ? (
        <EmptyState
          title={query ? "No images match" : "No images yet"}
          description={query ? undefined : "Upload photos for destinations, articles, team and testimonials."}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {initial.items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-square overflow-hidden rounded-lg bg-muted">
                  <MediaImage src={item.url} alt={item.alt} fill sizes="200px" className="object-cover transition-transform group-hover:scale-105" />
                </span>
                <span className="mt-1.5 block truncate text-xs">{item.name}</span>
                <span className="block text-[11px] text-muted-foreground">
                  {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                  {kb(item.size)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {initial.totalPages > 1 && (
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          {initial.page > 1 && (
            <Link href={`/admin/media?page=${initial.page - 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Previous
            </Link>
          )}
          {initial.page < initial.totalPages && (
            <Link href={`/admin/media?page=${initial.page + 1}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              Next
            </Link>
          )}
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {active && <MediaDetails key={active.id} item={active} onDone={() => setActive(null)} />}
        </SheetContent>
      </Sheet>
    </Panel>
  )
}

function MediaDetails({ item, onDone }: { item: MediaItem; onDone: () => void }) {
  const router = useRouter()
  const [alt, setAlt] = useState(item.alt)
  const [pending, start] = useTransition()

  return (
    <>
      <SheetHeader>
        <SheetTitle className="truncate pr-8">{item.name}</SheetTitle>
        <SheetDescription>
          Uploaded {formatDate(item.createdAt)}
          {item.uploadedByName && ` by ${item.uploadedByName}`}
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-4 px-4 pb-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <MediaImage src={item.url} alt={item.alt} fill sizes="400px" className="object-contain" />
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Size</dt>
          <dd>{kb(item.size)}</dd>
          <dt className="text-muted-foreground">Dimensions</dt>
          <dd>{item.width && item.height ? `${item.width} × ${item.height}` : "—"}</dd>
          <dt className="text-muted-foreground">Type</dt>
          <dd>{item.mimeType}</dd>
        </dl>
        <div className="grid gap-1.5">
          <label htmlFor="media-alt" className="text-sm font-medium">
            Alt text
          </label>
          <Input id="media-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for screen readers" />
          <Button
            size="sm"
            variant="outline"
            className="justify-self-start"
            disabled={pending || alt === item.alt}
            onClick={() =>
              start(async () => {
                const res = await updateMediaAltAction(item.id, alt)
                if (!res.success) return void toast.error(res.error.message)
                toast.success("Alt text saved")
                router.refresh()
              })
            }
          >
            Save alt text
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(new URL(item.url, location.origin).toString())
              toast.success("Link copied")
            }}
          >
            <Copy /> Copy link
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={pending}
            onClick={() => {
              if (!window.confirm("Delete this image? Pages that use it will show no image.")) return
              start(async () => {
                const res = await deleteMediaAction(item.id)
                if (!res.success) return void toast.error(res.error.message)
                toast.success("Image deleted")
                onDone()
                router.refresh()
              })
            }}
          >
            <Trash2 /> Delete
          </Button>
        </div>
      </div>
    </>
  )
}
