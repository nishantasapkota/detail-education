"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register once, on the client only. Import gsap from here, not from "gsap".
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

export { gsap, ScrollTrigger, useGSAP }
