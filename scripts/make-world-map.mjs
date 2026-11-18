/**
 * Regenerates the line-art world map behind the hero routes and prints each
 * city's position on it. Run once if you change cities: node scripts/make-world-map.mjs
 */
import fs from "node:fs"
import { createRequire } from "node:module"
import { runInNewContext } from "node:vm"

import dottedMapPackage from "dotted-map"

const DottedMap = dottedMapPackage.default

const CITIES = {
  kathmandu: { lat: 27.7172, lng: 85.324 },
  usa: { lat: 40.7128, lng: -74.006 },
  uk: { lat: 51.5074, lng: -0.1278 },
  germany: { lat: 52.52, lng: 13.405 },
  japan: { lat: 35.6762, lng: 139.6503 },
  canada: { lat: 49.2827, lng: -123.1207 },
  australia: { lat: -33.8688, lng: 151.2093 },
}

const WIDTH = 135
const HEIGHT = 64
const MIN_LNG = -179
const MAX_LNG = 179
const MIN_LAT = -56
const MAX_LAT = 71
const RAD = Math.PI / 180

/**
 * dotted-map includes the Natural Earth country shapes used to make its map.
 * Read that embedded data so this SVG stays aligned with the map's city pins.
 */
function readWorldFeatures() {
  const require = createRequire(import.meta.url)
  const source = fs.readFileSync(require.resolve("dotted-map"), "utf8")
  const marker = "JSON.parse('"
  const markerIndex = source.indexOf(marker)
  if (markerIndex < 0) throw new Error("Could not find world map data in dotted-map")

  const quoteStart = markerIndex + marker.length - 1
  let quoteEnd = quoteStart + 1
  while (quoteEnd < source.length) {
    if (source[quoteEnd] === "\\") quoteEnd += 2
    else if (source[quoteEnd] === "'") break
    else quoteEnd += 1
  }
  if (quoteEnd >= source.length) throw new Error("Could not read world map data from dotted-map")

  const json = runInNewContext(source.slice(quoteStart, quoteEnd + 1))
  return JSON.parse(json).features
}

function mercatorY(latitude) {
  const clamped = Math.max(-85.0511, Math.min(85.0511, latitude)) * RAD
  return Math.log(Math.tan(Math.PI / 4 + clamped / 2))
}

const MAP_TOP = mercatorY(MAX_LAT)
const MAP_BOTTOM = mercatorY(MIN_LAT)

function project([lng, lat]) {
  return {
    x: ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * WIDTH,
    y: ((MAP_TOP - mercatorY(lat)) / (MAP_TOP - MAP_BOTTOM)) * HEIGHT,
  }
}

function segmentDistanceSquared(point, start, end) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  if (dx === 0 && dy === 0) return (point.x - start.x) ** 2 + (point.y - start.y) ** 2
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)))
  const x = start.x + t * dx
  const y = start.y + t * dy
  return (point.x - x) ** 2 + (point.y - y) ** 2
}

/** Simplifies detail too fine to see at this small map size. */
function simplify(points, tolerance = 0.09) {
  if (points.length < 3) return points
  const keep = new Set([0, points.length - 1])
  const stack = [[0, points.length - 1]]
  const toleranceSquared = tolerance * tolerance

  while (stack.length) {
    const [startIndex, endIndex] = stack.pop()
    let farthestIndex = -1
    let farthestDistance = toleranceSquared
    for (let i = startIndex + 1; i < endIndex; i += 1) {
      const distance = segmentDistanceSquared(points[i], points[startIndex], points[endIndex])
      if (distance > farthestDistance) {
        farthestDistance = distance
        farthestIndex = i
      }
    }
    if (farthestIndex !== -1) {
      keep.add(farthestIndex)
      stack.push([startIndex, farthestIndex], [farthestIndex, endIndex])
    }
  }

  return [...keep].sort((a, b) => a - b).map((index) => points[index])
}

function ringsFor(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat()
  return []
}

const worldFeatures = readWorldFeatures()
const paths = []
for (const feature of worldFeatures) {
  for (const ring of ringsFor(feature.geometry)) {
    const points = simplify(ring.map(project))
    if (points.length < 3) continue
    const [first, ...rest] = points
    const number = (value) => Number(value.toFixed(2))
    paths.push(`M${number(first.x)} ${number(first.y)}${rest.map((p) => `L${number(p.x)} ${number(p.y)}`).join("")}Z`)
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}"><path d="${paths.join("")}" fill="none" stroke="#E9F4EF" stroke-opacity=".42" stroke-width=".13" stroke-linecap="round" stroke-linejoin="round"/></svg>`
fs.mkdirSync("public/images", { recursive: true })
fs.writeFileSync("public/images/world-lines.svg", svg)

const map = new DottedMap({ height: HEIGHT, grid: "diagonal" })
console.log("viewBox", `0 0 ${WIDTH} ${HEIGHT}`, "countries", worldFeatures.length, "bytes", svg.length)
for (const [id, city] of Object.entries(CITIES)) {
  const point = map.getPin(city)
  console.log(id, point.x.toFixed(2), point.y.toFixed(2))
}
