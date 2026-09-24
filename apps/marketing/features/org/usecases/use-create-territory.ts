"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { createTerritoryAction } from "@/features/org/actions"
import type { TerritoryPayload } from "@/features/org/types"
import { invalidateOrgTerritories } from "@/features/org/usecases/invalidate-org"

export function useCreateTerritory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TerritoryPayload) =>
      unwrapActionResult(await createTerritoryAction(payload)),
    onSuccess: () => {
      invalidateOrgTerritories(queryClient)
      toast.success("Territory created")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Create territory error:", error)
    },
  })
}
