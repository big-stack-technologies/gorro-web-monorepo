"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { verifyUserBvnAction } from "@/features/users/actions"
import { getFriendlyBvnErrorMessage } from "@/features/users/bvn-error-message"
import type { VerifyUserBvnPayload } from "@/features/users/types"
import { unwrapActionResult } from "@gorro/api/action-result"

export function useVerifyUserBvn(userId: string) {
  return useMutation({
    mutationFn: async (payload: VerifyUserBvnPayload) =>
      unwrapActionResult(await verifyUserBvnAction(userId, payload)),
    onSuccess: (data) => {
      const verified = data.verificationStatus.toLowerCase() === "verified"
      toast.success(
        verified ? "BVN verified successfully" : "BVN verification completed"
      )
    },
    onError: (error) => {
      toast.error(getFriendlyBvnErrorMessage(error))
      console.error("Verify BVN error:", error)
    },
  })
}
