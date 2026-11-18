"use client"

import { useId, useState } from "react"

import { MAP_DESTINATIONS, MAP_HUB, MAP_VIEWBOX } from "@/config/marketing"
import { cn } from "@/lib/utils"

const GOLD = "#E39D48"

/** Cropped to the part of the world with our routes, so the map renders larger. */
const VIEW = { x: 12, y: 7, w: 122, h: 52 }

/** A gentle arc from Kathmandu to the destination, bowed upward like a flight path. */
function arc(x: number, y: number) {
  const mx = (MAP_HUB.x + x) / 2
  const my = (MAP_HUB.y + y) / 2
  const lift = Math.hypot(x - MAP_HUB.x, y - MAP_HUB.y) * 0.22
  return `M ${MAP_HUB.x} ${MAP_HUB.y} Q ${mx} ${my - lift} ${x} ${y}`
}

const LABEL = {
  above: (x: number, y: number) => ({ x, y: y - 2.6, anchor: "middle" as const }),
  below: (x: number, y: number) => ({ x, y: y + 4.6, anchor: "middle" as const }),
  left: (x: number, y: number) => ({ x: x - 2, y: y - 2.2, anchor: "end" as const }),
  right: (x: number, y: number) => ({ x: x + 2, y: y - 2.2, anchor: "start" as const }),
}

/**
 * World map with flight routes from Kathmandu. Each city sits at its real
 * position; hovering or focusing one lights its route and shows a tip.
 */
export function RouteMap() {
  const [active, setActive] = useState<string | null>(null)
  const id = useId().replace(/:/g, "")
  const glowId = `hub-glow-${id}`

  return (
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      fill="none"
      className="w-full max-w-none origin-center scale-[1.2] overflow-visible select-none min-[1440px]:scale-[1.3]"
      role="img"
      aria-label={`Routes from Kathmandu to ${MAP_DESTINATIONS.map((d) => d.name).join(", ")}`}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <image href="/images/world-lines.svg" x="0" y="0" width={MAP_VIEWBOX.width} height={MAP_VIEWBOX.height} opacity="0.9" />

      {/* Soft halo around Kathmandu */}
      <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r={16} fill={`url(#${glowId})`} />

      {MAP_DESTINATIONS.map((d) => {
        const on = active === d.id
        return (
          <path
            key={d.id}
            d={arc(d.x, d.y)}
            stroke={on ? "#FFD285" : GOLD}
            strokeWidth={on ? 0.5 : 0.28}
            opacity={on ? 1 : active ? 0.35 : 0.75}
            strokeDasharray="1.2 1.4"
            strokeLinecap="round"
            className="animate-flight-route transition-all duration-300 [animation-duration:3s] motion-reduce:animate-none"
          />
        )
      })}

      {MAP_DESTINATIONS.map((d) => {
        const on = active === d.id
        const label = LABEL[d.label](d.x, d.y)
        const tipW = d.tip.length * 1.05 + 3
        const tipBelow = !["below"].includes(d.label)
        const tipX = Math.min(Math.max(d.x - tipW / 2, VIEW.x + 0.5), VIEW.x + VIEW.w - tipW - 0.5)
        const tipY = tipBelow ? d.y + 2.4 : label.y - 8
        return (
          <g
            key={d.id}
            tabIndex={0}
            role="button"
            aria-label={`${d.name}: ${d.tip}`}
            className="cursor-pointer outline-none"
            onMouseEnter={() => setActive(d.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(d.id)}
            onBlur={() => setActive(null)}
          >
            {/* Bigger invisible hit area */}
            <circle cx={d.x} cy={d.y} r={4} fill="transparent" />
            <circle
              cx={d.x}
              cy={d.y}
              r={1.6}
              stroke={GOLD}
              strokeWidth={0.25}
              className="origin-center animate-radar [transform-box:fill-box] motion-reduce:animate-none"
            />
            <circle cx={d.x} cy={d.y} r={1.15} fill={GOLD} opacity={0.45} />
            <circle
              cx={d.x}
              cy={d.y}
              r={on ? 0.85 : 0.6}
              fill={on ? "#FEF08A" : "#FFFFFF"}
              style={on ? { filter: "drop-shadow(0 0 1.2px rgba(227,157,72,0.95))" } : undefined}
              className="transition-all duration-300"
            />
            <text
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
              fill={on ? "#FFFFFF" : "#E2E8F0"}
              fontSize={2.5}
              fontWeight={500}
              className="transition-colors"
            >
              {d.name}
            </text>
            <g className={cn("pointer-events-none transition-opacity duration-300", on ? "opacity-100" : "opacity-0")}>
              <rect x={tipX} y={tipY} width={tipW} height={4.2} rx={0.8} fill="#081D17" opacity={0.95} stroke={GOLD} strokeWidth={0.15} />
              <text x={tipX + tipW / 2} y={tipY + 2.85} textAnchor="middle" fill={GOLD} fontSize={1.9} fontWeight={600}>
                {d.tip}
              </text>
            </g>
          </g>
        )
      })}

      {/* Kathmandu hub */}
      <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r={2.4} fill={GOLD} className="origin-center animate-hub-beacon [transform-box:fill-box] motion-reduce:animate-none" />
      <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r={2.4} fill={GOLD} className="origin-center animate-hub-beacon [animation-delay:1.3s] [transform-box:fill-box] motion-reduce:animate-none" />
      <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r={2} fill={GOLD} fillOpacity={0.35} />
      <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r={1.05} fill={GOLD} />
      <circle cx={MAP_HUB.x} cy={MAP_HUB.y} r={0.4} fill="#FFFFFF" />
      <text x={MAP_HUB.x + 2.8} y={MAP_HUB.y + 1} fill="#FFFFFF" fontSize={2.9} fontWeight={700}>
        {MAP_HUB.name}
      </text>
    </svg>
  )
}
