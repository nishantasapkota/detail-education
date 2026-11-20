/**
 * Fills an empty database with the site's starter content. Safe to re-run:
 * it only inserts what is missing and never overwrites edits made in the admin.
 *
 *   pnpm db:seed               add anything missing
 *   pnpm db:seed --articles    also reset the sample journal articles to their seed text
 */
import mongoose from "mongoose"

import { DEFAULT_DESTINATIONS } from "../src/data/destinations.ts"
import {
  ABOUT_DEFAULTS,
  BUSINESS_DEFAULTS,
  HOME_DEFAULTS,
  PRIVACY_DEFAULTS,
  SEED_ARTICLES,
  SEED_COURSES,
  SEED_SERVICES,
  SEED_PARTNERS,
  SEED_TEAM,
  SEED_TESTIMONIALS,
  SEED_VISA_SUCCESSES,
  TERMS_DEFAULTS,
} from "../src/data/site-content.ts"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME
if (!uri || !dbName) {
  console.error("Set MONGODB_URI and MONGODB_DB_NAME (see .env.example).")
  process.exit(1)
}

await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 })
const db = mongoose.connection
const now = new Date()

const overwriteArticles = process.argv.includes("--articles")

async function seed(
  collection: string,
  key: string,
  rows: Record<string, unknown>[],
  extra: Record<string, unknown> = {},
  overwrite = false
) {
  const col = db.collection(collection)
  await col.createIndex({ [key]: 1 }, { unique: true })
  let added = 0
  let updated = 0
  for (const row of rows) {
    const doc = { ...extra, ...row }
    const res = await col.updateOne(
      { [key]: row[key] },
      overwrite
        ? { $set: { ...doc, updatedAt: now, updatedBy: "seed" }, $setOnInsert: { createdAt: now, createdBy: "seed" } }
        : { $setOnInsert: { ...doc, createdAt: now, updatedAt: now, createdBy: "seed", updatedBy: "seed" } },
      { upsert: true }
    )
    added += res.upsertedCount
    updated += overwrite ? res.modifiedCount : 0
  }
  console.log(`${collection.padEnd(14)} ${added} added, ${updated} reset, ${rows.length - added - updated} untouched`)
}

await seed("destinations", "slug", DEFAULT_DESTINATIONS.map((d) => ({ featured: false, meta: null, image: null, imageAlt: "", order: 0, published: true, ...d })))
await seed("services", "slug", SEED_SERVICES)
await seed("courses", "slug", SEED_COURSES)
await seed("testimonials", "name", SEED_TESTIMONIALS)
await seed("team", "name", SEED_TEAM)
await seed("partners", "name", SEED_PARTNERS)
await seed("visa_successes", "name", SEED_VISA_SUCCESSES)
await seed("articles", "slug", SEED_ARTICLES, { status: "published", seoTitle: null, seoDescription: null }, overwriteArticles)

const singletons = { home: HOME_DEFAULTS, about: ABOUT_DEFAULTS, business: BUSINESS_DEFAULTS, privacy: PRIVACY_DEFAULTS, terms: TERMS_DEFAULTS }
let pages = 0
for (const [key, values] of Object.entries(singletons)) {
  const res = await db
    .collection<{ _id: string }>("site_content")
    .updateOne({ _id: key }, { $setOnInsert: { values, updatedAt: now, updatedByName: null } }, { upsert: true })
  pages += res.upsertedCount
}
console.log(`site_content   ${pages} added, ${Object.keys(singletons).length - pages} already there`)

await db.collection("media").createIndex({ createdAt: -1 })
await db.collection("activity").createIndex({ at: -1 })
await mongoose.disconnect()
console.log(`Done: "${dbName}" is ready.`)
