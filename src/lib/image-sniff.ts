/**
 * Detects the real image type from the file's first bytes. The browser's
 * `file.type` is only a claim; trusting it would let someone store HTML or
 * script and have us serve it back.
 */
export function sniffImageType(bytes: Uint8Array): string | null {
  const at = (i: number, ...sig: number[]) => sig.every((b, j) => bytes[i + j] === b)
  const ascii = (i: number, text: string) => at(i, ...Array.from(text, (c) => c.charCodeAt(0)))

  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg"
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png"
  if (ascii(0, "GIF87a") || ascii(0, "GIF89a")) return "image/gif"
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp"
  if (ascii(4, "ftypavif") || ascii(4, "ftypavis")) return "image/avif"
  return null
}
