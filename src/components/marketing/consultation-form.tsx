"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { submitConsultation, type ConsultationState } from "@/app/(marketing)/actions"
import { LEAD_COUNTRIES, LEAD_STUDY_LEVELS } from "@/lib/validations/lead"
import { cn } from "@/lib/utils"

const field =
  "w-full rounded-lg border border-transparent bg-white px-3.5 py-3 text-sm text-brand-charcoal shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/60 focus:outline-none aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/40"
const label = "mb-1 block text-xs font-medium text-emerald-100/90"

const initial: ConsultationState = { status: "idle" }

export function ConsultationForm() {
  const [state, action, pending] = useActionState(submitConsultation, initial)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message)
    }
  }, [state])

  const errors = state.status === "error" ? state.fieldErrors : undefined
  const values = state.status === "error" ? state.values : undefined
  const err = (name: string) => errors?.[name]?.[0]

  return (
    <form ref={formRef} action={action} className="max-w-xl space-y-4" noValidate>
      {/* Honeypot for bots; hidden from people and screen readers. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={label}>Full name</label>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Your full name"
            required
            defaultValue={values?.fullName}
            aria-invalid={!!err("fullName") || undefined}
            aria-describedby={err("fullName") ? "fullName-error" : undefined}
            className={field}
          />
          {err("fullName") && <p id="fullName-error" className="mt-1 text-xs text-red-300">{err("fullName")}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>WhatsApp number</label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-lg border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500">
              +977
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Mobile number"
              required
              defaultValue={values?.phone}
              aria-invalid={!!err("phone") || undefined}
              aria-describedby={err("phone") ? "phone-error" : undefined}
              className={cn(field, "rounded-l-none")}
            />
          </div>
          {err("phone") && <p id="phone-error" className="mt-1 text-xs text-red-300">{err("phone")}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className={label}>Preferred country</label>
          <select id="country" name="country" defaultValue={values?.country ?? LEAD_COUNTRIES[0]} className={cn(field, "cursor-pointer")}>
            {LEAD_COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="studyLevel" className={label}>Study level</label>
          <select id="studyLevel" name="studyLevel" defaultValue={values?.studyLevel ?? LEAD_STUDY_LEVELS[0]} className={cn(field, "cursor-pointer")}>
            {LEAD_STUDY_LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-sheen w-full rounded-lg bg-brand-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-brand-forest shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-hover hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
        >
          {pending ? "Sending…" : "Book my free counselling"}
        </button>
      </div>
      <p aria-live="polite" className="pt-1 text-[11px] text-emerald-200/60">
        {state.status === "success"
          ? state.message
          : "Your details stay private. No spam, just helpful, transparent guidance."}
      </p>
    </form>
  )
}
