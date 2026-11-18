import { z } from "zod"

export const emailSchema = z.email("Enter a valid email").trim().toLowerCase().max(254)

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Use at most 72 characters") // bcrypt only uses the first 72 bytes
  .regex(/[a-zA-Z]/, "Include at least one letter")
  .regex(/[0-9]/, "Include at least one number")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(72),
})
export type LoginInput = z.infer<typeof loginSchema>
