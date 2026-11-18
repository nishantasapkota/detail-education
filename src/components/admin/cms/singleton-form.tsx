"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useTransition } from "react"
import { useForm, type FieldValues, type Resolver } from "react-hook-form"
import { toast } from "sonner"

import { saveSingletonAction } from "@/app/admin/pages/actions"
import { FieldInput } from "@/components/admin/cms/field-input"
import { toFormValue } from "@/components/admin/cms/resource-form"
import { Panel } from "@/components/admin/page-parts"
import { Button, buttonVariants } from "@/components/ui/button"
import { getSingleton } from "@/lib/cms/singletons"

/** Edit form for a single document (a page's copy, business details). */
export function SingletonForm({ singletonKey, values }: { singletonKey: string; values: Record<string, unknown> }) {
  const def = getSingleton(singletonKey)!
  const router = useRouter()
  const [saving, start] = useTransition()
  const fields = useMemo(() => def.sections.flatMap((s) => s.fields), [def])
  const defaultValues = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, toFormValue(f, values[f.name])])),
    [fields, values]
  )

  const form = useForm<FieldValues>({
    resolver: zodResolver(def.schema) as unknown as Resolver<FieldValues>,
    defaultValues,
  })
  const { errors, isDirty } = form.formState

  useEffect(() => {
    if (!isDirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [isDirty])

  const onSubmit = form.handleSubmit(
    (data) =>
      start(async () => {
        const res = await saveSingletonAction(def.key, data)
        if (!res.success) {
          for (const [name, messages] of Object.entries(res.error.fieldErrors ?? {})) form.setError(name, { message: messages[0] })
          return void toast.error(res.error.message)
        }
        toast.success("Saved. The site is updated.")
        form.reset(data)
        router.refresh()
      }),
    () => toast.error("Please fix the highlighted fields")
  )

  const errorOf = (name: string) => {
    const e = errors[name]
    if (!e) return undefined
    return (e.message as string | undefined) ?? "Check the items above: each needs its fields filled in"
  }

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
              <FieldInput key={field.name} field={field} control={form.control} register={form.register} error={errorOf(field.name)} />
            ))}
          </div>
        </Panel>
      ))}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 lg:px-8">
          {def.publicPath && (
            <a href={def.publicPath} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "ghost" })}>
              View on site <ExternalLink />
            </a>
          )}
          <span className="ml-auto hidden text-xs text-muted-foreground sm:block">{isDirty ? "Unsaved changes" : "All changes saved"}</span>
          <Button type="button" variant="outline" disabled={!isDirty} onClick={() => form.reset(defaultValues)}>
            Discard
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  )
}
