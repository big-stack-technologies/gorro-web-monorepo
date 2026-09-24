"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import type { ActionResult } from "@gorro/api/action-result"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import type { MarketingCsvFile } from "@/lib/fetch-marketing-csv"
import { triggerCsvDownload } from "@/lib/trigger-csv-download"

export function useCsvDownload() {
  const [isPending, setIsPending] = useState(false)

  const download = useCallback(
    async (fetchFile: () => Promise<ActionResult<MarketingCsvFile>>) => {
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
