import "server-only"

import mongoose from "mongoose"

import { connectDB } from "@/lib/db/mongoose"

/** GridFS bucket for uploaded images (collections `images.files` / `images.chunks`). */
export async function getImageBucket() {
  const conn = await connectDB()
  const db = conn.connection.db
  if (!db) throw new Error("MongoDB connection has no database handle")
  return new mongoose.mongo.GridFSBucket(db, { bucketName: "images" })
}
