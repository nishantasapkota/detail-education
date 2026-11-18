import "server-only"

import { unstable_rethrow } from "next/navigation"

import { NextResponse } from "next/server"
import type { z } from "zod"

import { AppError, toAppError } from "@/lib/api/errors"
import type { ApiResponse } from "@/types/api"

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data }, init)
}

export function created<T>(data: T) {
  return ok(data, { status: 201 })
}

export function fail(error: unknown) {
  const appError = toAppError(error)
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.fieldErrors && { fieldErrors: appError.fieldErrors }),
      },
    },
    { status: appError.status }
  )
}

/**
 * Wraps a route handler so every thrown error becomes the standard error
 * response. Handlers just `throw AppError.notFound()` and return `ok(...)`.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (error) {
      // Let Next.js internals (prerender bail-outs, redirect, notFound) through.
      unstable_rethrow(error)
      return fail(error)
    }
  }
}

/** Parses a JSON body against a zod schema, throwing a 400/422 AppError. */
export async function parseJson<S extends z.ZodType>(
  request: Request,
  schema: S
): Promise<z.infer<S>> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    throw AppError.badRequest("Request body must be valid JSON")
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) throw AppError.fromZod(parsed.error)
  return parsed.data
}
