"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { updateFeatureFlagAction } from "@/features/feature-flags/actions"
import type {
  FeatureFlag,
  UpdateFeatureFlagPayload,
} from "@/features/feature-flags/types"
import { unwrapActionResult } from "@gorro/api/action-result"
import { getApiErrorMessage } from "@gorro/api/api-error"
import { QUERY_KEYS } from "@/lib/query-keys"

export function useUpdateFeatureFlag(key: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateFeatureFlagPayload) =>
      unwrapActionResult(await updateFeatureFlagAction(key, payload)),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.featureFlags.list })

      const previous = queryClient.getQueryData<FeatureFlag[]>(
        QUERY_KEYS.featureFlags.list
      )

      queryClient.setQueryData<FeatureFlag[]>(
        QUERY_KEYS.featureFlags.list,
        (old) =>
          old?.map((flag) =>
            flag.key === key
              ? {
                  ...flag,
                  androidEnabled:
                    payload.androidEnabled ?? flag.androidEnabled,
                  iosEnabled: payload.iosEnabled ?? flag.iosEnabled,
                }
              : flag
          ) ?? []
      )

      return { previous }
    },
    onSuccess: () => {
      toast.success("Feature flag updated")
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.featureFlags.list,
          context.previous
        )
      }
      toast.error(getApiErrorMessage(error))
      console.error("Update feature flag error:", error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featureFlags.all })
    },
  })
}
