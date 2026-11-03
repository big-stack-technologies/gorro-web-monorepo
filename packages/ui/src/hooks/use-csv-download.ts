"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import type { ActionResult } from "@gorro/api/action-result"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import type { CsvFile } from "@gorro/api/csv-file"

/** Trigger a browser download from a server-fetched CSV payload. */
export function triggerCsvDownload(file: CsvFile): void {
  const binary = atob(file.contentBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: file.mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = file.filename
  anchor.rel = "noopener"
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function useCsvDownload() {
  const [isPending, setIsPending] = useState(false)

  const download = useCallback(
    async (fetchFile: () => Promise<ActionResult<CsvFile>>) => {
      setIsPending(true)
      try {
        const file = unwrapActionResult(await fetchFile())
        triggerCsvDownload(file)
        toast.success("Download started")
      } catch (error) {
        toast.error(getApiErrorMessage(error))
        console.error("CSV download error:", error)
      } finally {
        setIsPending(false)
      }
    },
    []
  )

  return { download, isPending }
}
