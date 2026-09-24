"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { updateTerritoryAction } from "@/features/org/actions"
import type { TerritoryUpdatePayload } from "@/features/org/types"
import { invalidateOrgTerritories } from "@/features/org/usecases/invalidate-org"

export function useUpdateTerritory(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TerritoryUpdatePayload) =>
      unwrapActionResult(await updateTerritoryAction(id, payload)),
    onSuccess: () => {
      invalidateOrgTerritories(queryClient)
      toast.success("Territory updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update territory error:", error)
    },
  })
}
