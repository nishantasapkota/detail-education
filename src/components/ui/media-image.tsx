import Image from "next/image"
import type { ImageProps } from "next/image"
import CldImage from "next-cloudinary"

/** Uses Cloudinary transformations for Cloudinary URLs and Next Image for other sources. */
export function MediaImage(props: Omit<ImageProps, "quality" | "src"> & { src: string }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const isCloudinaryUrl = props.src.startsWith("https://res.cloudinary.com/")

  if (!isCloudinaryUrl || !cloudName) return <Image {...props} />

  return <CldImage {...props} config={{ cloud: { cloudName } }} />
}
