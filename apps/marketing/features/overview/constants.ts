import {
  ArrowLeftRightIcon,
  BadgeCheckIcon,
  BanknoteIcon,
  BoxesIcon,
  CalendarDaysIcon,
  CalendarRangeIcon,
  CirclePlusIcon,
  PieChartIcon,
  UserPlusIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"

/** Rates the summary endpoint documents as whole percentages. */
export const RATE_METRIC_KEYS = new Set([
  "kyc_completion_rate",
  "first_deposit_rate",
  "ajo_fill_rate",
])

export const CURRENCY_METRIC_KEYS = new Set(["gtv"])

export const METRIC_LABELS: Record<string, string> = {
  registered_users: "Registered users",
  new_users_today: "New users today",
  new_users_week: "New users this week",
  new_users_month: "New users this month",
  kyc_completion_rate: "KYC completion",
  first_deposit_rate: "First deposit rate",
  active_users: "Active users",
  dormant_users: "Dormant users",
  total_transactions: "Transactions",
  gtv: "GTV",
  active_ajo_groups: "Active ajo groups",
  ajo_fill_rate: "Ajo fill rate",
  active_clusters: "Active clusters",
  cluster_creation_rate: "Clusters created",
}

export const METRIC_ICONS: Record<string, LucideIcon> = {
  registered_users: UsersIcon,
  new_users_today: UserPlusIcon,
  new_users_week: CalendarDaysIcon,
  new_users_month: CalendarRangeIcon,
  kyc_completion_rate: BadgeCheckIcon,
  first_deposit_rate: WalletIcon,
  active_users: UsersIcon,
  dormant_users: UsersIcon,
  total_transactions: ArrowLeftRightIcon,
  gtv: BanknoteIcon,
  active_ajo_groups: BoxesIcon,
  ajo_fill_rate: PieChartIcon,
  active_clusters: BoxesIcon,
  cluster_creation_rate: CirclePlusIcon,
}

export const FUNNEL_STAGE_LABELS: Record<string, string> = {
  prospects: "Prospects",
  signups: "Sign-ups",
  kyc_completed: "KYC completed",
  first_deposit: "First deposit",
  product_adoption: "Product adoption",
  active: "Active",
  retained: "Retained",
}
