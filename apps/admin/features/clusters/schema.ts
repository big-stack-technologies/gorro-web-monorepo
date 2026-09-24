import { z } from "zod"

export const updateClusterSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim(),
  requiredApprovals: z
    .number()
    .int("Approvals must be a whole number")
    .min(1, "At least one approval is required")
    .max(10, "No more than 10 approvals are allowed"),
})

export type UpdateClusterFormValues = z.infer<typeof updateClusterSchema>

export type UpdateClusterPayload = {
  name?: string
  description?: string
  requiredApprovals?: number
}

export const rejectClusterWithdrawalSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
})

export type RejectClusterWithdrawalPayload = z.infer<
  typeof rejectClusterWithdrawalSchema
>
