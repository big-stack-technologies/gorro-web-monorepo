import { z } from "zod"

import {
  NARRATION_MAX_LENGTH,
  PROVIDER_REFERENCE_MAX_LENGTH,
  PROVIDER_REFERENCE_MIN_LENGTH,
  REASON_MAX_LENGTH,
  REASON_MIN_LENGTH,
  WALLET_CREDIT_CATEGORIES,
  WALLET_CREDIT_PROVIDERS,
} from "@/features/wallet-credits/constants"

const categorySchema = z.enum(WALLET_CREDIT_CATEGORIES)
const providerSchema = z.enum(WALLET_CREDIT_PROVIDERS)

export const creditWalletFormSchema = z
  .object({
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((value) => {
        const n = Number(value)
        return Number.isFinite(n) && n >= 0.01
      }, "Enter at least ₦0.01")
      .refine((value) => {
        const n = Number(value)
        if (!Number.isFinite(n)) return false
        return Math.round(n * 100) === n * 100
      }, "Use at most 2 decimal places"),
    category: categorySchema,
    reason: z
      .string()
      .trim()
      .min(REASON_MIN_LENGTH, `Reason must be at least ${REASON_MIN_LENGTH} characters`)
      .max(REASON_MAX_LENGTH, `Reason must be at most ${REASON_MAX_LENGTH} characters`),
    narration: z
      .string()
      .max(
        NARRATION_MAX_LENGTH,
        `Narration must be at most ${NARRATION_MAX_LENGTH} characters`
      )
      .optional(),
    provider: providerSchema.optional(),
    providerReference: z.string().optional(),
    senderName: z.string().optional(),
    senderAccountNumber: z.string().optional(),
    senderBankName: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.category !== "MISSED_DEPOSIT") return

    if (!values.provider) {
      ctx.addIssue({
        code: "custom",
        message: "Provider is required for missed deposits",
        path: ["provider"],
      })
    }

    const ref = values.providerReference?.trim() ?? ""
    if (ref.length < PROVIDER_REFERENCE_MIN_LENGTH) {
      ctx.addIssue({
        code: "custom",
        message: `Provider reference must be at least ${PROVIDER_REFERENCE_MIN_LENGTH} characters`,
        path: ["providerReference"],
      })
    } else if (ref.length > PROVIDER_REFERENCE_MAX_LENGTH) {
      ctx.addIssue({
        code: "custom",
        message: `Provider reference must be at most ${PROVIDER_REFERENCE_MAX_LENGTH} characters`,
        path: ["providerReference"],
      })
    }
  })

export type CreditWalletFormValues = z.infer<typeof creditWalletFormSchema>
