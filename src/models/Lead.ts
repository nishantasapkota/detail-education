import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose"

import { LEAD_COUNTRIES, LEAD_SOURCES, LEAD_STATUSES, LEAD_STUDY_LEVELS } from "@/lib/validations/lead"

export { LEAD_STATUSES }

const noteSchema = new Schema(
  {
    body: { type: String, required: true, maxlength: 2000 },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    // "note" = written by staff; "event" = automatic (status change, assignment).
    kind: { type: String, enum: ["note", "event"], default: "note" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const leadSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, maxlength: 16 },
    email: { type: String, default: null },
    country: { type: String, enum: LEAD_COUNTRIES, required: true },
    studyLevel: { type: String, enum: LEAD_STUDY_LEVELS, required: true },
    source: { type: String, enum: LEAD_SOURCES, default: "website" },
    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },
    assignedTo: { type: String, default: null, index: true },
    assignedName: { type: String, default: null },
    notes: { type: [noteSchema], default: [] },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

leadSchema.index({ createdAt: -1 })

export type LeadDoc = InferSchemaType<typeof leadSchema>

export const Lead: Model<LeadDoc> =
  (mongoose.models.Lead as Model<LeadDoc>) || mongoose.model<LeadDoc>("Lead", leadSchema)
