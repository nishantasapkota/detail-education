"use client"

import { ImageIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { MediaPicker } from "@/components/admin/media/media-picker"
import { Button } from "@/components/ui/button"

/** Form control for an image: preview, choose from the library, remove. */
export function ImageField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string | null
  onChange: (url: string | null) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <button
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex aspect-[4/3] w-32 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground"
        aria-label={value ? "Change image" : "Choose image"}
      >
        {value ? (
          <Image src={value} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <ImageIcon className="size-6" />
        )}
      </button>
      <div className="flex flex-col items-start gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          {value ? "Change" : "Choose image"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
      </div>
      <MediaPicker open={open} onOpenChange={setOpen} onSelect={(item) => onChange(item.url)} />
    </div>
  )
}
