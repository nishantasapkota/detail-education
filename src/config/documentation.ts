export const DOCUMENTATION_COUNTRY_ORDER = [
  "canada",
  "japan",
  "uk",
  "usa",
  "finland",
  "australia",
  "germany",
] as const

export type DocumentationCountryId = (typeof DOCUMENTATION_COUNTRY_ORDER)[number]
