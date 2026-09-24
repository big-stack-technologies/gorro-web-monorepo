import { UserIcon } from "lucide-react"

import { cn } from "@gorro/ui/utils"

type NinReviewPhotoProps = {
  src: string | null | undefined
  alt: string
  className?: string
  onError?: () => void
}

export function NinReviewPhoto({
  src,
  alt,
  className,
  onError,
}: NinReviewPhotoProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-3/4 w-full max-w-40 items-center justify-center rounded-lg border border-dashed bg-muted/40 text-muted-foreground",
          className
        )}
      >
        <UserIcon className="size-8 opacity-50" />
        <span className="sr-only">No photo available</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "aspect-3/4 w-full max-w-40 rounded-lg border object-cover",
        className
      )}
      onError={onError}
    />
  )
}

export function getRegistryPhotoSrc(photoBase64: string | null | undefined) {
  if (!photoBase64?.trim()) return null
  if (photoBase64.startsWith("data:")) return photoBase64
  return `data:image/jpeg;base64,${photoBase64}`
}
