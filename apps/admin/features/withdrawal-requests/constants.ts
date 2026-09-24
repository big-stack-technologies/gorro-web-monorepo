export const WITHDRAWAL_REQUEST_STATUSES = [
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "FAILED",
  "PROCESSING",
  "COMPLETED",
] as const

export const WITHDRAWAL_REQUEST_PROVIDERS = ["FINCRA"] as const

const WITHDRAWAL_REQUEST_STATUS_LABELS: Record<
  (typeof WITHDRAWAL_REQUEST_STATUSES)[number],
  string
> = {
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  FAILED: "Failed",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
}

const WITHDRAWAL_REQUEST_PROVIDER_LABELS: Record<
  (typeof WITHDRAWAL_REQUEST_PROVIDERS)[number],
  string
> = {
  FINCRA: "Fincra",
}

export const WITHDRAWAL_REQUEST_STATUS_FILTER_OPTIONS =
  WITHDRAWAL_REQUEST_STATUSES.map((value) => ({
    value,
    label: WITHDRAWAL_REQUEST_STATUS_LABELS[value],
  }))

export const WITHDRAWAL_REQUEST_PROVIDER_FILTER_OPTIONS =
  WITHDRAWAL_REQUEST_PROVIDERS.map((value) => ({
    value,
    label: WITHDRAWAL_REQUEST_PROVIDER_LABELS[value],
  }))

export const WITHDRAWAL_REQUEST_PENDING_STATUS = "PENDING_APPROVAL" as const

export const WITHDRAWAL_REQUEST_CURRENCY = "NGN" as const
