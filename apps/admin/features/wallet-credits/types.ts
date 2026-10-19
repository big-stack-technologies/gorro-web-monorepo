export type WalletCreditTargetType =
  | "USER_WALLET"
  | "AJO_WALLET"
  | "CLUSTER"
  | "SAVINGS_PLAN"

export type WalletCreditCategory =
  | "MISSED_DEPOSIT"
  | "REFUND_COMPENSATION"
  | "PROMO_BONUS"

export type WalletCreditProvider = "FINCRA" | "FLUTTERWAVE"

export type WalletAccountStatus = "ACTIVE" | "FROZEN" | "ARCHIVED"

export type WalletCreditStatus = "POSTED" | "REVERSED"

export type WalletCreditOwner = {
  id: string
  name: string
  phoneNumber?: string
}

export type CreditableWallet = {
  targetType: WalletCreditTargetType
  targetId: string
  accountNumber: string
  label: string
  balance: number
  status: WalletAccountStatus
  owner: WalletCreditOwner
}

export type CreditWalletPayload = {
  targetType: WalletCreditTargetType
  targetId: string
  amount: number
  category: WalletCreditCategory
  reason: string
  narration?: string
  provider?: WalletCreditProvider
  providerReference?: string
  senderName?: string
  senderAccountNumber?: string
  senderBankName?: string
  reference: string
}

export type CreditWalletResult = {
  transactionId: string
  status: WalletCreditStatus
  reference: string
  amount: number
  category: WalletCreditCategory
  targetType: WalletCreditTargetType
  targetId: string
  accountNumber: string
  label: string
  owner: Pick<WalletCreditOwner, "id" | "name">
  newBalance: number
}

export type WalletCreditListItem = {
  transactionId: string
  status: WalletCreditStatus
  reference: string
  amount: number
  category: WalletCreditCategory
  targetType: WalletCreditTargetType
  targetId: string
  accountNumber: string
  owner: Pick<WalletCreditOwner, "id" | "name">
  admin: { id: string; name: string }
  reason: string
  narration: string | null
  provider: WalletCreditProvider | null
  providerReference: string | null
  reversedBy: string | null
  createdAt: string
}
