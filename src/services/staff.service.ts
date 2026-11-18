import "server-only"

import { randomBytes } from "node:crypto"

import bcrypt from "bcryptjs"
import { Types } from "mongoose"
import { z } from "zod"

import { AppError } from "@/lib/api/errors"
import { ROLES, type Role } from "@/lib/auth/roles"
import { connectDB } from "@/lib/db/mongoose"
import { emailSchema, passwordSchema } from "@/lib/validations/auth"
import { User } from "@/models/User"
import { toPublicUser, type PublicUser } from "@/services/user.service"

export type StaffRow = PublicUser & { lastLoginAt: string | null; createdAt: string }

export const createStaffSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(60),
  email: emailSchema,
  role: z.enum(ROLES),
})

export const updateStaffSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  role: z.enum(ROLES).optional(),
  active: z.boolean().optional(),
})

/** Readable one-time password, e.g. "kite-4821-river". Shown once to the admin. */
function tempPassword() {
  const words = ["amber", "cedar", "delta", "ember", "fjord", "harbor", "kite", "lotus", "maple", "river", "summit", "tundra"]
  const pick = () => words[randomBytes(1)[0] % words.length]
  const digits = (randomBytes(2).readUInt16BE() % 9000) + 1000
  return `${pick()}-${digits}-${pick()}`
}

function parseId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw AppError.notFound("Staff member")
  return new Types.ObjectId(id)
}

export async function listStaff(): Promise<StaffRow[]> {
  await connectDB()
  const users = await User.find({}).sort({ active: -1, name: 1 })
  return users.map((u) => ({
    ...toPublicUser(u),
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: (u.get("createdAt") as Date).toISOString(),
  }))
}

/** Active staff for "assign to" pickers. */
export async function listAssignableStaff() {
  await connectDB()
  const users = await User.find({ active: { $ne: false }, role: { $in: ["admin", "counsellor"] } })
    .select("name role")
    .sort({ name: 1 })
  return users.map((u) => ({ id: u._id.toString(), name: u.name }))
}

/** Creates a staff account with a temporary password the admin passes on. */
export async function createStaff(input: unknown) {
  const data = createStaffSchema.parse(input)
  await connectDB()
  if (await User.exists({ email: data.email })) {
    throw new AppError("CONFLICT", "A staff member with this email already exists", { email: ["Already in use"] })
  }
  const password = tempPassword()
  const user = await User.create({ ...data, provider: "credentials", passwordHash: await bcrypt.hash(password, 12) })
  return { user: toPublicUser(user), tempPassword: password }
}

/** Guards: you can't lock yourself out, and there is always one active admin. */
async function assertKeepsAnAdmin(targetId: string, next: { role?: Role; active?: boolean }) {
  const target = await User.findById(targetId).select("role active")
  if (!target) throw AppError.notFound("Staff member")
  const losesAdmin = target.role === "admin" && target.active !== false && (next.role !== undefined && next.role !== "admin" || next.active === false)
  if (!losesAdmin) return
  const otherAdmins = await User.countDocuments({ _id: { $ne: target._id }, role: "admin", active: { $ne: false } })
  if (otherAdmins === 0) throw AppError.badRequest("Keep at least one active admin")
}

export async function updateStaff(id: string, input: unknown, actorId: string) {
  const data = updateStaffSchema.parse(input)
  const _id = parseId(id)
  await connectDB()
  if (id === actorId && (data.role !== undefined || data.active === false)) {
    throw AppError.badRequest("You can't change your own role or deactivate yourself")
  }
  await assertKeepsAnAdmin(id, data)
  const user = await User.findByIdAndUpdate(_id, { $set: data }, { new: true })
  if (!user) throw AppError.notFound("Staff member")
  return toPublicUser(user)
}

export async function resetStaffPassword(id: string) {
  await connectDB()
  const password = tempPassword()
  const user = await User.findByIdAndUpdate(parseId(id), { $set: { passwordHash: await bcrypt.hash(password, 12) } })
  if (!user) throw AppError.notFound("Staff member")
  return { name: user.name, tempPassword: password }
}

export async function deleteStaff(id: string, actorId: string) {
  if (id === actorId) throw AppError.badRequest("You can't delete your own account")
  await connectDB()
  await assertKeepsAnAdmin(id, { active: false })
  const user = await User.findByIdAndDelete(parseId(id))
  if (!user) throw AppError.notFound("Staff member")
  return { name: user.name }
}

/** Self-service: update own name and/or password (current password required). */
export const accountSchema = z
  .object({
    name: z.string().trim().min(2).max(60),
    currentPassword: z.string().max(72).default(""),
    newPassword: z.union([z.literal(""), passwordSchema]).default(""),
  })
  .refine((d) => !d.newPassword || d.currentPassword, {
    path: ["currentPassword"],
    message: "Enter your current password to set a new one",
  })

export async function updateOwnAccount(userId: string, input: unknown) {
  const data = accountSchema.parse(input)
  await connectDB()
  const user = await User.findById(userId).select("+passwordHash")
  if (!user) throw AppError.notFound("Account")
  user.name = data.name
  if (data.newPassword) {
    const ok = user.passwordHash && (await bcrypt.compare(data.currentPassword, user.passwordHash))
    if (!ok) throw new AppError("VALIDATION_ERROR", "Current password is wrong", { currentPassword: ["Wrong password"] })
    user.passwordHash = await bcrypt.hash(data.newPassword, 12)
  }
  await user.save()
  return { passwordChanged: !!data.newPassword }
}
