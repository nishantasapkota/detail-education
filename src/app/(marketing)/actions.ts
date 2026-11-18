"use server"

import { z } from "zod"

import { runAction } from "@/lib/api/action"
import type { FieldErrors } from "@/lib/api/errors"
import { assertRateLimit } from "@/lib/api/rate-limit"
import { leadSchema } from "@/lib/validations/lead"
import { createLead } from "@/services/lead.service"

export type ConsultationState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: FieldErrors; values: Record<string, string> }

const str = (fd: FormData, key: string) => {
  const v = fd.get(key)
  return typeof v === "string" ? v : ""
}

export async function submitConsultation(
  _prev: ConsultationState,
  formData: FormData
): Promise<ConsultationState> {
  // Honeypot: real people never fill this hidden field.
  if (str(formData, "company")) return { status: "success", message: "Thank you!" }

  const raw = {
    fullName: str(formData, "fullName"),
    phone: str(formData, "phone"),
    country: str(formData, "country"),
    studyLevel: str(formData, "studyLevel"),
  }

  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as FieldErrors,
      values: raw,
    }
  }

  await assertRateLimit(`lead:${parsed.data.phone}`)
  const result = await runAction(() => createLead(parsed.data))
  if (!result.success) {
    return { status: "error", message: result.error.message, values: raw }
  }

  return {
    status: "success",
    message: `Thank you, ${parsed.data.fullName.split(" ")[0]}. A counsellor will reach you on WhatsApp within one working day.`,
  }
}
