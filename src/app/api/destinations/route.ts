import type { NextRequest } from "next/server"

import { AppError } from "@/lib/api/errors"
import { ok, withErrorHandling } from "@/lib/api/response"
import { listDestinationsQuerySchema } from "@/lib/validations/destination"
import { listDestinations } from "@/services/destination.service"

/**
 * GET /api/destinations?category=stem|psw|budget — public list for the
 * destinations tabs. Returns `{ tabs: [{ id, label, count }], items: [...] }`.
 * Omit `category` for every destination.
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const query = listDestinationsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!query.success) throw AppError.fromZod(query.error, "Invalid query parameters")
  return ok(await listDestinations(query.data.category), {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  })
})
