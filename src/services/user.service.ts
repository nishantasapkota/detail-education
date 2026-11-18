import "server-only"

import bcrypt from "bcryptjs"

import type { Role } from "@/lib/auth/roles"
import { connectDB } from "@/lib/db/mongoose"
import type { LoginInput } from "@/lib/validations/auth"
import { User, type UserDocument } from "@/models/User"

/** The only user shape that leaves the service layer. Never includes the hash. */
export type PublicUser = {
  id: string
  name: string
  email: string
  image: string | null
  role: Role
  active: boolean
}

let dummyHash: Promise<string> | undefined
/** A real hash at the same cost, computed once per instance. */
const getDummyHash = () => (dummyHash ??= bcrypt.hash("timing-equalizer", 12))

export function toPublicUser(doc: UserDocument): PublicUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    image: doc.image ?? null,
    role: (doc.role ?? "counsellor") as Role,
    active: doc.active !== false,
  }
}

/**
 * Returns the staff member when the credentials match and the account is
 * active, otherwise null (never says which part was wrong).
 */
export async function verifyCredentials({ email, password }: LoginInput): Promise<PublicUser | null> {
  await connectDB()
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash")
  if (!user?.passwordHash) {
    // Equalize timing so response time doesn't reveal whether the email exists.
    await bcrypt.compare(password, await getDummyHash())
    return null
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid || user.active === false) return null
  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } })
  return toPublicUser(user)
}

/** Google sign-in is allowed only for existing, active staff. No accounts are created. */
export async function findActiveStaffByEmail(email: string): Promise<PublicUser | null> {
  await connectDB()
  const user = await User.findOne({ email: email.toLowerCase(), active: { $ne: false } })
  if (!user) return null
  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } })
  return toPublicUser(user)
}

/** Fresh role/active state for the signed-in user (roles can change mid-session). */
export async function getStaffById(id: string): Promise<PublicUser | null> {
  await connectDB()
  const user = await User.findById(id).catch(() => null)
  return user && user.active !== false ? toPublicUser(user) : null
}
