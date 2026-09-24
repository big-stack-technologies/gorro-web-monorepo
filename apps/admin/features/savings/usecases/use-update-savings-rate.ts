"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateSavingsRateAction } from "@/features/savings/actions"
import type {
  SavingsProductType,
  UpdateSavingsRatePayload,
} from "@/features/savings/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateSavingsRate(productType: SavingsProductType) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateSavingsRatePayload) =>
      unwrapActionResult(
        await updateSavingsRateAction(productType, payload)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savings.rates })
      toast.success("Rate updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update savings rate error:", error)
    },
  })
}
