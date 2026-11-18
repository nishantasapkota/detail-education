"use client"

import { Check, Search, Upload } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { listMediaAction } from "@/app/admin/media/actions"
import { useMediaUpload } from "@/components/admin/media/use-media-upload"
import { Button } from "@/components/ui/button"
import { MediaImage } from "@/components/ui/media-image"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UPLOAD } from "@/config/site"
import { cn } from "@/lib/utils"
import type { MediaItem } from "@/services/media.service"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: MediaItem) => void
}

/** Choose an image from the library, or upload a new one and pick it. */
export function MediaPicker({ open, onOpenChange, onSelect }: Props) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async (query: string) => {
    setLoading(true)
    const res = await listMediaAction({ q: query })
    setLoading(false)
    if (res.success) setItems(res.data.items)
    else toast.error(res.error.message)
  }, [])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => void load(q), q ? 250 : 0)
    return () => clearTimeout(t)
  }, [open, q, load])

  const { upload, progress, uploading } = useMediaUpload((item) => {
    setItems((prev) => [item, ...prev])
    setSelected(item)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>Pick an image or upload a new one.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-48 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or alt text" className="pl-8" />
          </div>
          <Button type="button" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
            <Upload /> {uploading ? `Uploading ${progress}%` : "Upload"}
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

        <div className="-mx-1 min-h-48 flex-1 overflow-y-auto px-1">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {loading ? "Loading…" : q ? "No images match." : "No images yet. Upload one to start."}
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {items.map((item) => {
                const on = selected?.id === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      onDoubleClick={() => {
                        onSelect(item)
                        onOpenChange(false)
                      }}
                      aria-pressed={on}
                      title={item.name}
                      className={cn(
                        "relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-muted",
                        on ? "border-brand-gold" : "border-transparent hover:border-border"
                      )}
                    >
                      <MediaImage src={item.url} alt={item.alt} fill sizes="160px" className="object-cover" />
                      {on && (
                        <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-brand-gold text-brand-forest">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selected}
            onClick={() => {
              if (!selected) return
              onSelect(selected)
              onOpenChange(false)
            }}
          >
            Use image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
