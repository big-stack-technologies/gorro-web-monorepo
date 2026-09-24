"use client"

import { useEffect, useState } from "react"
import { FileWarningIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@gorro/ui/components/ui/button"

type AddressReviewDocumentProps = {
  url: string | null
  onReload: () => void
  isReloading?: boolean
}

function isPdfDocumentUrl(url: string) {
  try {
    const pathname = new URL(url).pathname
    return pathname.toLowerCase().endsWith(".pdf")
  } catch (error) {
    console.error("Could not parse address document URL:", error)
    return false
  }
}

export function AddressReviewDocument({
  url,
  onReload,
  isReloading = false,
}: AddressReviewDocumentProps) {
  const [useFrame, setUseFrame] = useState(() =>
    url ? isPdfDocumentUrl(url) : false
  )
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFailed(false)
    setUseFrame(url ? isPdfDocumentUrl(url) : false)
  }, [url])

  if (!url) {
    return (
      <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed bg-muted/40 p-6 text-sm text-muted-foreground">
        No document was uploaded.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Proof of address. Links expire after 12 hours.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReload}
          disabled={isReloading}
        >
          <RefreshCwIcon data-icon="inline-start" />
          Reload document
        </Button>
      </div>

      {failed ? (
        <div className="flex min-h-80 flex-col items-start justify-center gap-3 rounded-xl border border-dashed bg-muted/40 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileWarningIcon className="size-4" />
            This document link could not be opened. Reload the review to fetch
            a fresh link.
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={onReload} disabled={isReloading}>
              <RefreshCwIcon data-icon="inline-start" />
              Reload review
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setFailed(false)
                setUseFrame(true)
              }}
            >
              Open in viewer
            </Button>
          </div>
        </div>
      ) : useFrame ? (
        <iframe
          title="Proof of address"
          src={url}
          className="min-h-[70vh] w-full rounded-xl border bg-background"
          onError={() => setFailed(true)}
        />
      ) : (
        // Presigned S3 URL — render directly. Do not proxy or cache it.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Proof of address"
          className="max-h-[70vh] w-full rounded-xl border bg-muted/20 object-contain"
          onError={() => setFailed(true)}
        />
      )}

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Open document in a new tab
      </a>
    </div>
  )
}
