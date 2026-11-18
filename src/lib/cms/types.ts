import type { z } from "zod"

import type { Permission } from "@/lib/auth/roles"

/**
 * CMS resource definitions. One definition drives the admin list, the form,
 * validation (client and server) and storage. Files that define resources must
 * stay importable from client components: no server-only imports.
 */

type Base = {
  name: string
  label: string
  help?: string
  required?: boolean
  /** Spans both columns in the form grid. */
  wide?: boolean
}

export type Option = { value: string; label: string }

export type Field =
  | (Base & { type: "text" | "email" | "url" | "tel"; placeholder?: string })
  | (Base & { type: "textarea"; rows?: number; placeholder?: string })
  /** Markdown body with a live preview. */
  | (Base & { type: "richtext"; rows?: number })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "date" | "datetime" })
  /** URL-safe id, auto-filled from another field while creating. */
  | (Base & { type: "slug"; from: string })
  | (Base & { type: "select"; options: readonly Option[] })
  | (Base & { type: "checkboxes"; options: readonly Option[] })
  | (Base & { type: "boolean" })
  /** Picks or uploads an image from the media library; stores its URL. */
  | (Base & { type: "image" })
  /** A list of short strings (chips, bullet points). */
  | (Base & { type: "list"; placeholder?: string; max?: number })
  /** A list of small items, each with its own text fields (stats, points…). */
  | (Base & { type: "repeater"; itemLabel: string; max?: number; fields: RepeaterSubField[] })

export type RepeaterSubField = { name: string; label: string; type: "text" | "textarea"; wide?: boolean }

export type FieldSection = { title: string; description?: string; fields: Field[] }

export type ColumnKind = "text" | "title" | "badge" | "image" | "date" | "boolean" | "list" | "number"
export type Column = { name: string; label: string; kind?: ColumnKind; className?: string }

export type ResourceDef<S extends z.ZodObject = z.ZodObject> = {
  /** URL segment under /admin and registry key. */
  key: string
  /** MongoDB collection name. */
  collection: string
  singular: string
  plural: string
  description: string
  permission: Permission
  schema: S
  sections: FieldSection[]
  columns: Column[]
  /** Field shown as the row title and in activity logs. */
  titleField: string
  searchFields: string[]
  /** One select filter shown above the list. */
  filter?: { name: string; label: string; options: readonly Option[] }
  defaultSort: Record<string, 1 | -1>
  /** Unique field, checked on save (e.g. slug). */
  uniqueField?: string
  /** Where the item appears on the public site, for the "View" link. */
  publicPath?: (doc: Record<string, unknown>) => string | null
  /** Cache tags to refresh after any change, so the public site updates. */
  cacheTags: string[]
  /** Values for a new, empty form. */
  defaults: Record<string, unknown>
}

export const defineResource = <S extends z.ZodObject>(def: ResourceDef<S>) => def

/**
 * A single editable document (a page's copy, business details). Same field
 * system as resources, but no list: there is exactly one of each.
 */
export type SingletonDef<S extends z.ZodObject = z.ZodObject> = {
  key: string
  title: string
  description: string
  permission: Permission
  schema: S
  sections: FieldSection[]
  /** Public URL to preview, if any. */
  publicPath?: string
  cacheTags: string[]
}

export const defineSingleton = <S extends z.ZodObject>(def: SingletonDef<S>) => def
