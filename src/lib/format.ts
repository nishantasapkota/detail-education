/** "March 2025" style dates for public pages, in Kathmandu time. */
export const formatArticleDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Kathmandu" }).format(new Date(iso))

export const formatLongDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kathmandu" }).format(
    new Date(iso)
  )
