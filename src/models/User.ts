import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

import { ROLES } from "@/lib/auth/roles"

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Excluded by default so it can never leak through a careless query.
    passwordHash: { type: String, select: false },
    image: { type: String },
    provider: { type: String, enum: ["credentials", "google"], default: "credentials" },
    // Only staff have accounts; there is no public sign-up.
    role: { type: String, enum: ROLES, default: "counsellor" },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export type UserDoc = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<UserDoc>

// Reuse the compiled model across hot reloads / warm serverless invocations.
export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", userSchema)
