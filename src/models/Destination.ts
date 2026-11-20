import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose"

import { DESTINATION_CATEGORY_IDS } from "@/lib/validations/destination"

const destinationSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    categories: { type: [String], enum: DESTINATION_CATEGORY_IDS, required: true },
    featured: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    coords: { type: String, default: "" },
    kicker: { type: String, default: "" },
    meta: { type: String, default: null },
    body: { type: String, default: "" },
    chips: { type: [String], default: [] },
    intakes: { type: [String], default: [] },
    cta: { type: String, default: "Explore Programs" },
    image: { type: String, default: null },
    imageAlt: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Supports the main query: published destinations in a category, in display order.
destinationSchema.index({ published: 1, categories: 1, order: 1 })

export type DestinationDoc = InferSchemaType<typeof destinationSchema>

export const Destination: Model<DestinationDoc> =
  (mongoose.models.Destination as Model<DestinationDoc>) ||
  mongoose.model<DestinationDoc>("Destination", destinationSchema)
