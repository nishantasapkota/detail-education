/**
 * Creates (or promotes) an admin account. Public sign-up is off, so use this
 * once to make the first admin; add everyone else from Admin → Staff.
 *
 *   pnpm admin:create you@example.com "Your Name"
 *
 * Prompts for a password (hidden). Re-running for an existing email resets
 * its password and makes it an active admin.
 */
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import { createInterface } from "node:readline"

const [email, ...nameParts] = process.argv.slice(2)
const name = nameParts.join(" ").trim()
if (!email || !email.includes("@") || !name) {
  console.error('Usage: pnpm admin:create <email> "<full name>"')
  process.exit(1)
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    const out = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream }
    out._writeToOutput = (s) => out.output.write(s.includes(question) ? s : "*")
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write("\n")
      resolve(answer)
    })
  })
}

const password = process.env.ADMIN_PASSWORD ?? (await askHidden("Password (min 8, with a letter and a number): "))
if (password.length < 8 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
  console.error("Password must be at least 8 characters and include a letter and a number.")
  process.exit(1)
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME
if (!uri || !dbName) {
  console.error("Set MONGODB_URI and MONGODB_DB_NAME (see .env.example).")
  process.exit(1)
}

await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 })
const users = mongoose.connection.collection("users")
await users.createIndex({ email: 1 }, { unique: true })
const now = new Date()
await users.updateOne(
  { email: email.toLowerCase() },
  {
    $set: { name, role: "admin", active: true, passwordHash: await bcrypt.hash(password, 12), provider: "credentials", updatedAt: now },
    $setOnInsert: { createdAt: now, lastLoginAt: null },
  },
  { upsert: true }
)
await mongoose.disconnect()
console.log(`✓ ${email} is an admin. Sign in at /login.`)
