import { z } from "zod"

export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
}

/** Field-level messages, keyed by field path (e.g. `{ title: ["Required"] }`). */
export type FieldErrors = Record<string, string[]>

/**
 * The one error type services throw. Route handlers and server actions turn it
 * into a response; anything else is treated as an unexpected 500.
 */
export class AppError extends Error {
  readonly code: ErrorCode
  readonly status: number
  readonly fieldErrors?: FieldErrors

  constructor(code: ErrorCode, message: string, fieldErrors?: FieldErrors) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.status = STATUS_BY_CODE[code]
    this.fieldErrors = fieldErrors
  }

  static badRequest = (message = "Bad request") => new AppError("BAD_REQUEST", message)
  static unauthorized = (message = "You must be signed in") =>
    new AppError("UNAUTHORIZED", message)
  static forbidden = (message = "You do not have access to this resource") =>
    new AppError("FORBIDDEN", message)
  static notFound = (resource = "Resource") =>
    new AppError("NOT_FOUND", `${resource} not found`)
  static conflict = (message: string) => new AppError("CONFLICT", message)

  static fromZod(error: z.ZodError, message = "Validation failed") {
    return new AppError("VALIDATION_ERROR", message, z.flattenError(error).fieldErrors as FieldErrors)
  }
}

/** Normalizes any thrown value into an AppError, logging the unexpected ones. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  if (error instanceof z.ZodError) return AppError.fromZod(error)

  // Mongo duplicate key (e.g. unique email).
  if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
    return AppError.conflict("A record with these details already exists")
  }

  console.error("[unexpected error]", error)
  return new AppError("INTERNAL_ERROR", "Something went wrong")
}
