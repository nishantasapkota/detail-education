import { z } from "zod"

export const LEAD_COUNTRIES = [
  "Not sure yet",
  "USA",
  "United Kingdom",
  "Australia",
  "Canada",
  "Germany",
  "Japan",
] as const

export const LEAD_STUDY_LEVELS = [
  "Undergraduate (Bachelor's)",
  "Postgraduate (Master's)",
  "PhD / Doctoral",
  "Diploma / Pathway",
] as const

/** Consultation request from the marketing page. Phone is a Nepali number without +977. */
export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^\d{7,10}$/, "Enter a valid mobile number")),
  country: z.enum(LEAD_COUNTRIES, { message: "Pick a country" }),
  studyLevel: z.enum(LEAD_STUDY_LEVELS, { message: "Pick a study level" }),
})
export type LeadInput = z.input<typeof leadSchema>

/** Pipeline stages a counsellor moves a lead through. */
export const LEAD_STATUSES = ["new", "contacted", "counselling", "applied", "enrolled", "lost"] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_SOURCES = ["website", "whatsapp", "walk-in", "phone", "event", "referral"] as const

export const leadNoteSchema = z.object({ body: z.string().trim().min(1, "Write something").max(2000) })

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  assignedTo: z.string().regex(/^[a-f\d]{24}$/i).nullable().optional(),
})

/** Lead added by staff (walk-in, phone call...). Email optional. */
export const staffLeadSchema = leadSchema.extend({
  email: z.union([z.literal(""), z.email()]).transform((v) => v || null).nullable().default(null),
  source: z.enum(LEAD_SOURCES).default("walk-in"),
})
