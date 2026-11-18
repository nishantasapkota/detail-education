"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"

import { toggleItemAction } from "@/app/admin/cms-actions"
import { formatDate, StatusPill } from "@/components/admin/page-parts"
import { MediaImage } from "@/components/ui/media-image"
import { Switch } from "@/components/ui/switch"
import { getResource } from "@/lib/cms/registry"
import type { CmsDoc } from "@/lib/cms/serialize"
import type { Column } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

/** List view for any CMS resource. Boolean columns toggle in place. */
export function ResourceTable({ resourceKey, items }: { resourceKey: string; items: CmsDoc[] }) {
  const def = getResource(resourceKey)!
  const router = useRouter()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-xs text-muted-foreground">
            {def.columns.map((c) => (
              <th key={c.name} className={cn("px-4 py-2.5 font-medium", c.kind === "image" && "w-16")}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a,button,[role=switch]")) return
                router.push(`/admin/${def.key}/${item.id}`)
              }}
              className="cursor-pointer border-b last:border-0 hover:bg-muted/50"
            >
              {def.columns.map((c) => (
                <td key={c.name} className={cn("px-4 py-3 align-middle", c.className)}>
                  <Cell column={c} item={item} resourceKey={def.key} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Cell({ column, item, resourceKey }: { column: Column; item: CmsDoc; resourceKey: string }) {
  const value = item[column.name]
  switch (column.kind) {
    case "title":
      return (
        <Link href={`/admin/${resourceKey}/${item.id}`} className="font-medium hover:underline">
          {String(value ?? "Untitled")}
        </Link>
      )
    case "image":
      return (
        <span className="relative block size-10 overflow-hidden rounded-md bg-muted">
          {typeof value === "string" && value && <MediaImage src={value} alt="" fill sizes="40px" className="object-cover" />}
        </span>
      )
    case "badge":
      return value ? <StatusPill status={String(value)} /> : null
    case "date":
      return <span className="whitespace-nowrap text-muted-foreground">{formatDate(value as string)}</span>
    case "boolean":
      return <ToggleCell resourceKey={resourceKey} id={item.id} field={column.name} value={!!value} />
    case "list":
      return <span className="text-muted-foreground">{Array.isArray(value) ? value.join(", ") : ""}</span>
    case "number":
      return <span className="tabular-nums">{String(value ?? "")}</span>
    default:
      return <span className="text-muted-foreground">{String(value ?? "")}</span>
  }
}

function ToggleCell({ resourceKey, id, field, value }: { resourceKey: string; id: string; field: string; value: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(value)
  const [, start] = useTransition()
  return (
    <Switch
      checked={optimistic}
      aria-label={`Toggle ${field}`}
      onCheckedChange={() =>
        start(async () => {
          setOptimistic(!optimistic)
          const res = await toggleItemAction(resourceKey, id, field)
          if (!res.success) toast.error(res.error.message)
        })
      }
    />
  )
}
