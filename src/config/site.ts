export const siteConfig = {
  name: "Detail",
  title: "DETAIL Education Consultancy | Kathmandu, Nepal",
  description:
    "Study abroad guidance from Kathmandu: destinations, test prep, SOPs and visas, handled in detail by one dedicated counsellor.",
} as const

export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/admin",
} as const

/** Path prefixes that require a signed-in staff member (checked in src/proxy.ts). */
export const PROTECTED_PREFIXES = ["/admin"] as const

export const UPLOAD = {
  /** Cloudinary folder root; each user uploads into `${root}/${userId}`. */
  folderRoot: "detail",
  maxBytes: 5 * 1024 * 1024,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
} as const
