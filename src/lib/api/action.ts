import "server-only"

import { unstable_rethrow } from "next/navigation"

import { toAppError } from "@/lib/api/errors"
import type { ActionResult } from "@/types/api"

/**
 * Runs server-action logic and converts thrown errors into the standard
 * `{ success: false, error }` shape, so client forms never see raw exceptions.
 *
 * Note: `redirect()` and `notFound()` throw special errors that Next must
 * handle itself — call them *after* `runAction` resolves, not inside it.
 */
export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() }
  } catch (error) {
    // Let Next.js internals (redirect, notFound, dynamic bail-outs) through.
    unstable_rethrow(error)
    const appError = toAppError(error)
    return {
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.fieldErrors && { fieldErrors: appError.fieldErrors }),
      },
    }
  }
}
