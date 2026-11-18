"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLink, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useTransition } from "react"
import { useForm, type FieldValues, type Resolver } from "react-hook-form"
import { toast } from "sonner"

import { deleteItemAction, saveItemAction } from "@/app/admin/cms-actions"
import { FieldInput } from "@/components/admin/cms/field-input"
import { Panel } from "@/components/admin/page-parts"
import { Button, buttonVariants } from "@/components/ui/button"
import { getResource } from "@/lib/cms/registry"
import type { CmsDoc } from "@/lib/cms/serialize"
import type { Field } from "@/lib/cms/types"

const pad = (n: number) => String(n).padStart(2, "0")

/** Stored values → what each <input> expects (dates as local strings, etc.). */
export function toFormValue(field: Field, value: unknown): unknown {
  if (value === undefined || value === null) {
    if (field.type === "boolean") return false
    if (field.type === "list" || field.type === "checkboxes" || field.type === "repeater") return []
    if (field.type === "image") return null
    return ""
  }
  if (field.type === "date" || field.type === "datetime") {
    const d = new Date(value as string)
    if (Number.isNaN(d.getTime())) return ""
    const day = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    return field.type === "date" ? day : `${day}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  return value
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

/** Create/edit form for any CMS resource, driven by its definition. */
export function ResourceForm({ resourceKey, item }: { resourceKey: string; item: CmsDoc | null }) {
  const def = getResource(resourceKey)!
  const router = useRouter()
  const [saving, startSave] = useTransition()
  const [deleting, startDelete] = useTransition()
  const fields = useMemo(() => def.sections.flatMap((s) => s.fields), [def])

  const defaultValues = useMemo(() => {
    const source = { ...def.defaults, ...(item ?? {}) }
    return Object.fromEntries(fields.map((f) => [f.name, toFormValue(f, source[f.name])]))
  }, [def, fields, item])

  const form = useForm<FieldValues>({
    resolver: zodResolver(def.schema) as unknown as Resolver<FieldValues>,
    defaultValues,
  })
  const { errors, isDirty } = form.formState

  // Auto-fill slugs from their source field while creating, until edited by hand.
  const slugTouched = useRef(!!item)
  const slugFields = useMemo(
    () => fields.filter((f): f is Extract<Field, { type: "slug" }> => f.type === "slug"),
    [fields]
  )
  useEffect(() => {
    if (slugFields.length === 0) return
    const sub = form.watch((values, { name }) => {
      for (const f of slugFields) {
        if (name === f.name) slugTouched.current = true
        if (name === f.from && !slugTouched.current) {
          form.setValue(f.name, slugify(String(values[f.from] ?? "")), { shouldValidate: false })
        }
      }
    })
    return () => sub.unsubscribe()
  }, [form, slugFields])

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!isDirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [isDirty])

  const onSubmit = form.handleSubmit(
    (data) =>
      startSave(async () => {
        const result = await saveItemAction(def.key, item?.id ?? null, data)
        if (!result.success) {
          for (const [name, messages] of Object.entries(result.error.fieldErrors ?? {})) {
            form.setError(name, { message: messages[0] })
          }
          toast.error(result.error.message)
          return
        }
        toast.success(item ? "Saved" : `${def.singular} created`)
        form.reset(data)
        if (!item) router.replace(`/admin/${def.key}/${result.data.id}`)
        else router.refresh()
      }),
    () => toast.error("Please fix the highlighted fields")
  )

  const remove = () => {
    if (!item || !window.confirm(`Delete this ${def.singular.toLowerCase()}? This can't be undone.`)) return
    startDelete(async () => {
      const result = await deleteItemAction(def.key, item.id)
      if (!result.success) return void toast.error(result.error.message)
      toast.success("Deleted")
      router.replace(`/admin/${def.key}`)
    })
  }

  const publicHref = item ? def.publicPath?.(item) : null

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 pb-24">
      {def.sections.map((section) => (
        <Panel key={section.title}>
          <div className="border-b px-5 py-4">
            <h2 className="font-medium">{section.title}</h2>
            {section.description && <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>}
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            {section.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                control={form.control}
                register={form.register}
                error={errors[field.name]?.message as string | undefined}
              />
            ))}
          </div>
        </Panel>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 lg:px-8">
          {item && (
            <Button type="button" variant="destructive" onClick={remove} disabled={deleting}>
              <Trash2 /> {deleting ? "Deleting…" : "Delete"}
            </Button>
          )}
          {publicHref && (
            <a href={publicHref} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost" })}>
              View on site <ExternalLink />
            </a>
          )}
          <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
            {isDirty ? "Unsaved changes" : item ? "All changes saved" : ""}
          </span>
          <Button type="button" variant="outline" onClick={() => router.push(`/admin/${def.key}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : item ? "Save changes" : `Create ${def.singular.toLowerCase()}`}
          </Button>
        </div>
      </div>
    </form>
  )
}
