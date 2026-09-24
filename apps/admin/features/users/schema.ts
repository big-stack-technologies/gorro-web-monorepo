import { z } from "zod"

import { USER_ROLES } from "@/features/users/constants"

export const USER_GENDERS = ["male", "female", "unknown"] as const

export const updateUserFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string(),
  gender: z.enum(USER_GENDERS),
  nin: z.string(),
  bvn: z.string(),
})

export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>

export type UpdateUserPayload = UpdateUserFormValues

export const changeUserRoleFormSchema = z.object({
  role: z.enum(USER_ROLES),
  reason: z.string().min(1, "Reason is required"),
})

export type ChangeUserRoleFormValues = z.infer<typeof changeUserRoleFormSchema>

export type ChangeUserRolePayload = ChangeUserRoleFormValues

export const freezeUserFormSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
})

export type FreezeUserFormValues = z.infer<typeof freezeUserFormSchema>

export type FreezeUserPayload = FreezeUserFormValues

export const withdrawalsReasonFormSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
})

export type WithdrawalsReasonFormValues = z.infer<
  typeof withdrawalsReasonFormSchema
>

export type WithdrawalsReasonPayload = WithdrawalsReasonFormValues

export const verifyUserBvnFormSchema = z.object({
  bvn: z.string().regex(/^\d{11}$/, "BVN must be exactly 11 digits"),
})

export type VerifyUserBvnFormValues = z.infer<typeof verifyUserBvnFormSchema>

export const createVirtualAccountFormSchema = z.object({
  provider: z.enum(["flutterwave", "paystack", "monnify", "fincra"]),
})

export type CreateVirtualAccountFormValues = z.infer<
  typeof createVirtualAccountFormSchema
>
