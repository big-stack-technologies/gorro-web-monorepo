"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { backfillClusterContributorsAction } from "@/features/clusters/actions"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

export function useBackfillClusterContributors() {
  return useMutation({
    mutationFn: async (dryRun: boolean) =>
      unwrapActionResult(await backfillClusterContributorsAction(dryRun)),
    onSuccess: (result) => {
      toast.success(
        result.dryRun
          ? "Dry run finished. Nothing was written."
          : "Contributor backfill finished."
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Contributor backfill error:", error)
    },
  })
}
