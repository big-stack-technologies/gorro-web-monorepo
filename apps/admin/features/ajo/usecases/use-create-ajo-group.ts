"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { createAjoGroupAction } from "@/features/ajo/actions"
import type { CreateAjoGroupPayload } from "@/features/ajo/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useCreateAjoGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateAjoGroupPayload) =>
      unwrapActionResult(await createAjoGroupAction(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ajo.groups.list })
      toast.success("Ajo group created")
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e))
      console.error("Create Ajo group error:", e)
    },
  })
}
