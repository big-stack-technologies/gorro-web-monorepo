import type { CreditWalletFormValues } from "@/features/wallet-credits/schema"
import type {
  CreditableWallet,
  CreditWalletPayload,
} from "@/features/wallet-credits/types"

export function creditFormToPayload(
  wallet: CreditableWallet,
  reference: string,
  values: CreditWalletFormValues
): CreditWalletPayload {
  const payload: CreditWalletPayload = {
    targetType: wallet.targetType,
    targetId: wallet.targetId,
    amount: Number(values.amount),
    category: values.category,
    reason: values.reason.trim(),
    reference,
  }

  const narration = values.narration?.trim()
  if (narration) payload.narration = narration

  if (values.category === "MISSED_DEPOSIT") {
    payload.provider = values.provider
    payload.providerReference = values.providerReference?.trim()
    const senderName = values.senderName?.trim()
    const senderAccountNumber = values.senderAccountNumber?.trim()
    const senderBankName = values.senderBankName?.trim()
    if (senderName) payload.senderName = senderName
    if (senderAccountNumber) payload.senderAccountNumber = senderAccountNumber
    if (senderBankName) payload.senderBankName = senderBankName
  }

  return payload
}
