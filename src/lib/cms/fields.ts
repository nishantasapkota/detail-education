import { z } from "zod"

/** Reusable zod pieces for resource schemas (client-safe). */

export const slug = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
    .max(80)

/** An image URL from our own media: /images/*, /api/images/<id> or Cloudinary. */
export const imageUrl = () =>
  z
    .string()
    .trim()
    .max(1024)
    .refine(
      (v) =>
        v === "" ||
        /^\/images\/[\w./-]+$/.test(v) ||
        /^\/api\/images\/[a-f\d]{24}$/i.test(v) ||
        /^https:\/\/res\.cloudinary\.com\//.test(v),
      "Pick an image from the media library"
    )
    .transform((v) => v || null)
    .nullable()

export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null)
    .nullable()

export const stringList = (maxItems: number, maxLen = 60) =>
  z.array(z.string().trim().min(1).max(maxLen)).max(maxItems)

export const order = () => z.coerce.number().int().min(0).max(9999)

/** Date/datetime inputs send strings; store real Dates. */
export const dateField = () =>
  z.union([z.date(), z.string().min(1)]).transform((v) => new Date(v)).pipe(z.date())

export const toOptions = <T extends string>(values: readonly T[], labels?: Record<T, string>) =>
  values.map((v) => ({ value: v, label: labels?.[v] ?? v.charAt(0).toUpperCase() + v.slice(1) }))
