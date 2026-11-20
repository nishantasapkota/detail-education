/**
 * Copy and content for the marketing page, kept apart from the markup so
 * non-developers can edit it safely.
 */

export const NAV_LINKS = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/#process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/#testprep", label: "Test prep" },
  { href: "/journal", label: "Journal" },
  { href: "/#stories", label: "Stories" },
] as const

/**
 * Hero map, in the coordinates of public/images/world-lines.svg (viewBox 0 0 135 64).
 * Positions are real lat/lng projected by scripts/make-world-map.mjs; re-run it
 * to add a city. `label` says where the name sits relative to the dot.
 */
export const MAP_VIEWBOX = { width: 135, height: 64 } as const
export const MAP_HUB = { x: 99.5, y: 27.71, name: "Kathmandu" } as const
export const MAP_DESTINATIONS = [
  { id: "canada", name: "Canada", x: 21.5, y: 17.32, label: "above", tip: "PGWP • Top Co-op" },
  { id: "usa", name: "USA", x: 40, y: 21.65, label: "above", tip: "4,000+ Colleges • OPT" },
  { id: "uk", name: "UK", x: 67.5, y: 15.59, label: "left", tip: "Russell Group • 1-Yr MSc" },
  { id: "germany", name: "Germany", x: 72.5, y: 15.59, label: "right", tip: "Low Tuition • TU9 Tech" },
  { id: "japan", name: "Japan", x: 120.5, y: 24.25, label: "above", tip: "MEXT • STEM Innovation" },
  { id: "australia", name: "Australia", x: 124.5, y: 51.96, label: "left", tip: "Group of 8 • PSW Rights" },
] as const

/* Everything else on the home page is edited in the admin (see src/data/site-content.ts for defaults). */
