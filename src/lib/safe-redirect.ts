import { ROUTES } from "@/config/site"

/** Only allow same-site relative paths, so `?callbackUrl=` can't redirect off-site. */
export function safeRedirect(value: unknown, fallback: string = ROUTES.dashboard): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }
  try {
    const url = new URL(value, "http://local")
    return url.host === "local" ? `${url.pathname}${url.search}${url.hash}` : fallback
  } catch {
    return fallback
  }
}
