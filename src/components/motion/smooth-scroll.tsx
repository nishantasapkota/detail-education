"use client"

import Lenis from "lenis"
import { useEffect } from "react"

import { gsap, REDUCED_MOTION, ScrollTrigger } from "@/components/motion/gsap"

import "lenis/dist/lenis.css"

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger and
 * Lenis share one frame loop. Skipped for users who prefer reduced motion.
 * Mounted by the marketing layout only; app screens (admin) scroll natively.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return

    // `anchors` makes in-page #links scroll through Lenis instead of fighting it.
    const lenis = new Lenis({ autoRaf: false, anchors: { offset: -80 } })
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return children
}
