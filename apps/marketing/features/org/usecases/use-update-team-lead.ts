"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"

import { updateTeamLeadAction } from "@/features/org/actions"
import type { TeamLeadUpdatePayload } from "@/features/org/types"
import { invalidateOrgTeamLeads } from "@/features/org/usecases/invalidate-org"

export function useUpdateTeamLead(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TeamLeadUpdatePayload) =>
      unwrapActionResult(await updateTeamLeadAction(id, payload)),
    onSuccess: () => {
      invalidateOrgTeamLeads(queryClient)
      toast.success("Team lead updated")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
      console.error("Update team lead error:", error)
    },
  })
}
