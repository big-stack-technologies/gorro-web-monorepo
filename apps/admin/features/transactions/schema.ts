import { z } from "zod"

export const transactionReasonFormSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
})

export type TransactionReasonFormValues = z.infer<
  typeof transactionReasonFormSchema
>

export type TransactionReasonPayload = TransactionReasonFormValues
