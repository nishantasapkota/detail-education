import { openMongoImage } from "@/services/upload.service"

/**
 * GET /api/images/:id — serves an image stored in MongoDB. Public like a
 * Cloudinary URL (ids are unguessable), and immutable, so browsers and the
 * CDN cache it for good.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/images/[id]">) {
  const { id } = await params
  const image = await openMongoImage(id)
  if (!image) return new Response("Not found", { status: 404 })

  return new Response(image.body, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": String(image.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      // Belt and braces: never let a stored file run as a page.
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  })
}
