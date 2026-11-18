import type { ErrorCode, FieldErrors } from "@/lib/api/errors"

/** Every route handler and server action returns this shape. */
export type ApiSuccess<T> = { success: true; data: T }

export type ApiFailure = {
  success: false
  error: { code: ErrorCode; message: string; fieldErrors?: FieldErrors }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

/** Server actions use the same shape so forms can handle both identically. */
export type ActionResult<T = void> = ApiResponse<T>
