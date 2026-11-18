"use client"

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react"
import { useState } from "react"
import { Controller, type Control, type FieldValues, type UseFormRegister } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ImageField } from "@/components/admin/media/image-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { Field, RepeaterSubField } from "@/lib/cms/types"
import { cn } from "@/lib/utils"

export const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30"

type Props = {
  field: Field
  control: Control<FieldValues>
  register: UseFormRegister<FieldValues>
  error?: string
}

/** Renders one CMS field: label, the right input, help text and error. */
export function FieldInput({ field, control, register, error }: Props) {
  const id = `f-${field.name}`
  const describedBy = error ? `${id}-error` : field.help ? `${id}-help` : undefined
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy }

  return (
    <div className={cn("grid content-start gap-1.5", field.wide && "sm:col-span-2")}>
      {field.type !== "boolean" && (
        <label htmlFor={id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {renderInput()}
      {field.help && !error && (
        <p id={`${id}-help`} className="text-xs text-muted-foreground">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )

  function renderInput() {
    switch (field.type) {
      case "text":
      case "email":
      case "url":
      case "tel":
        return <Input type={field.type} placeholder={field.placeholder} {...common} {...register(field.name)} />
      case "slug":
        return <Input className="font-mono text-xs" {...common} {...register(field.name)} />
      case "number":
        return <Input type="number" min={field.min} max={field.max} {...common} {...register(field.name)} />
      case "date":
        return <Input type="date" {...common} {...register(field.name)} />
      case "datetime":
        return <Input type="datetime-local" {...common} {...register(field.name)} />
      case "textarea":
        return <Textarea rows={field.rows ?? 3} placeholder={field.placeholder} {...common} {...register(field.name)} />
      case "markdown":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => (
              <MarkdownInput id={id} rows={field.rows} value={f.value ?? ""} onChange={f.onChange} invalid={!!error} />
            )}
          />
        )
      case "select":
        return (
          <select className={selectClass} {...common} {...register(field.name)}>
            {!field.required && <option value="">—</option>}
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      case "checkboxes":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => {
              const value: string[] = f.value ?? []
              return (
                <div id={id} className="flex flex-wrap gap-2" role="group" aria-describedby={describedBy}>
                  {field.options.map((o) => {
                    const on = value.includes(o.value)
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => f.onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
                        className={cn(
                          "rounded-full border px-3 py-1 text-sm transition-colors",
                          on ? "border-brand-forest bg-brand-forest text-white" : "hover:bg-muted"
                        )}
                      >
                        {o.label}
                      </button>
                    )
                  })}
                </div>
              )
            }}
          />
        )
      case "boolean":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => (
              <label htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5">
                <Switch id={id} checked={!!f.value} onCheckedChange={f.onChange} aria-describedby={describedBy} />
                <span className="text-sm font-medium">{field.label}</span>
              </label>
            )}
          />
        )
      case "image":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => <ImageField id={id} value={f.value ?? null} onChange={f.onChange} />}
          />
        )
      case "repeater":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => (
              <RepeaterInput
                id={id}
                value={f.value ?? []}
                onChange={f.onChange}
                fields={field.fields}
                itemLabel={field.itemLabel}
                max={field.max}
              />
            )}
          />
        )
      case "list":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => (
              <ListInput id={id} value={f.value ?? []} onChange={f.onChange} max={field.max} placeholder={field.placeholder} />
            )}
          />
        )
    }
  }
}

function ListInput({
  id,
  value,
  onChange,
  max,
  placeholder,
}: {
  id: string
  value: string[]
  onChange: (v: string[]) => void
  max?: number
  placeholder?: string
}) {
  const [draft, setDraft] = useState("")
  const full = max !== undefined && value.length >= max

  const add = () => {
    const v = draft.trim()
    if (!v || full || value.includes(v)) return
    onChange([...value, v])
    setDraft("")
  }

  return (
    <div className="grid gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((item, i) => (
            <li key={item} className="flex items-center gap-1 rounded-md bg-muted py-1 pr-1 pl-2.5 text-sm">
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Input
        id={id}
        value={draft}
        disabled={full}
        placeholder={full ? `Maximum ${max} items` : (placeholder ?? "Type and press Enter")}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            add()
          }
        }}
        onBlur={add}
      />
    </div>
  )
}

function MarkdownInput({
  id,
  value,
  onChange,
  rows = 12,
  invalid,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  rows?: number
  invalid: boolean
}) {
  const [preview, setPreview] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-1 border-b bg-muted/50 px-2 py-1 text-xs">
        {(["Write", "Preview"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPreview(tab === "Preview")}
            className={cn(
              "rounded px-2 py-1",
              preview === (tab === "Preview") ? "bg-background font-medium shadow-xs" : "text-muted-foreground"
            )}
          >
            {tab}
          </button>
        ))}
        <span className="ml-auto text-muted-foreground">Markdown: **bold**, ## Heading, - list, [link](url)</span>
      </div>
      {preview ? (
        <div className="prose-detail max-h-[32rem] min-h-40 overflow-y-auto px-4 py-3 text-sm">
          {value ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-muted-foreground">Nothing yet.</p>}
        </div>
      ) : (
        <Textarea
          id={id}
          rows={rows}
          value={value}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-none border-0 font-mono text-[13px] focus-visible:ring-0"
        />
      )}
    </div>
  )
}

type Row = Record<string, string>

function RepeaterInput({
  id,
  value,
  onChange,
  fields,
  itemLabel,
  max,
}: {
  id: string
  value: Row[]
  onChange: (v: Row[]) => void
  fields: RepeaterSubField[]
  itemLabel: string
  max?: number
}) {
  const set = (i: number, name: string, v: string) => onChange(value.map((row, j) => (j === i ? { ...row, [name]: v } : row)))
  const move = (i: number, d: -1 | 1) => {
    const next = [...value]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const blank = Object.fromEntries(fields.map((f) => [f.name, ""]))

  return (
    <div id={id} className="grid gap-3">
      {value.map((row, i) => (
        <fieldset key={i} className="rounded-lg border p-3">
          <legend className="flex w-full items-center gap-1 px-1 text-xs text-muted-foreground">
            <span className="mr-auto">
              {itemLabel} {i + 1}
            </span>
          </legend>
          <div className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              {fields.map((sf) => (
                <div key={sf.name} className={cn("grid gap-1", (sf.wide || sf.type === "textarea") && "sm:col-span-2")}>
                  <label htmlFor={`${id}-${i}-${sf.name}`} className="text-xs font-medium">
                    {sf.label}
                  </label>
                  {sf.type === "textarea" ? (
                    <Textarea
                      id={`${id}-${i}-${sf.name}`}
                      rows={2}
                      value={row[sf.name] ?? ""}
                      onChange={(e) => set(i, sf.name, e.target.value)}
                    />
                  ) : (
                    <Input id={`${id}-${i}-${sf.name}`} value={row[sf.name] ?? ""} onChange={(e) => set(i, sf.name, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1 pt-5">
              <Button type="button" variant="ghost" size="icon-xs" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Move down"
                disabled={i === value.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${itemLabel.toLowerCase()} ${i + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
              >
                <X />
              </Button>
            </div>
          </div>
        </fieldset>
      ))}
      {(max === undefined || value.length < max) && (
        <Button type="button" variant="outline" size="sm" className="justify-self-start" onClick={() => onChange([...value, blank])}>
          <Plus /> Add {itemLabel.toLowerCase()}
        </Button>
      )}
    </div>
  )
}
