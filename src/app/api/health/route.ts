import { connection } from "next/server"

import { pingDB } from "@/lib/db/mongoose"

/**
 * GET /api/health — liveness + DB connectivity check for uptime monitors and
 * post-deploy verification. Returns 503 when the database is unreachable.
 */
export async function GET() {
  // Opt out of prerendering: this must run on every request.
  await connection()

  try {
    const latencyMs = await pingDB()
    return Response.json(
      { success: true, data: { status: "ok", db: "connected", latencyMs } },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (error) {
    console.error("[health] database ping failed", error)
    return Response.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Database unreachable" },
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}
