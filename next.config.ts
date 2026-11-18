import type { NextConfig } from "next"

/**
 * Baseline security headers for every route. A strict Content-Security-Policy
 * is intentionally not set here: it needs per-request nonces to work with
 * Next's inline scripts. See node_modules/next/dist/docs/01-app/02-guides/
 * content-security-policy.md when you are ready to add one.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
]

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Enables forbidden() / unauthorized() for staff permission checks.
  experimental: { authInterrupts: true },
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // Keep heavy server-only packages out of the bundler; Node resolves them at runtime.
  serverExternalPackages: ["mongoose", "cloudinary"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
