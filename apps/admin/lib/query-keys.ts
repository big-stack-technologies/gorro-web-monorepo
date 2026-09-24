import { SESSION_QUERY_KEY } from "@gorro/auth/query-keys"

/** Client-safe TanStack Query keys (no server-only imports). Single source of truth. */

export const QUERY_KEYS = {
  // Authentication
  session: SESSION_QUERY_KEY,

  // Users
  users: {
    all: ["users"],
    list: ["users", "list"] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    analyticsSummary: ["users", "analytics", "summary"] as const,
    byTier: ["users", "analytics", "by-tier"] as const,
  },

  transactions: {
    all: ["transactions"],
    list: ["transactions", "list"] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
    analyticsSummary: ["transactions", "analytics", "summary"] as const,
    amlFlags: ["transactions", "analytics", "aml-flags"] as const,
  },

  withdrawalRequests: {
    all: ["withdrawal-requests"],
    list: ["withdrawal-requests", "list"] as const,
    detail: (id: string) => ["withdrawal-requests", "detail", id] as const,
  },

  wallet: {
    main: (userId: string) => ["wallet", "main", userId] as const,
  },

  referrals: {
    all: ["referrals"],
    list: ["referrals", "list"] as const,
    stats: ["referrals", "stats"] as const,
    detail: (userId: string) => ["referrals", "detail", userId] as const,
  },

  savings: {
    all: ["savings"],
    rates: ["savings", "rates"] as const,
    fixedBands: ["savings", "fixed-bands"] as const,
    wht: ["savings", "wht"] as const,
    metricsSummary: (filters: Record<string, string>) =>
      ["savings", "metrics", "summary", filters] as const,
    accounts: {
      list: ["savings", "accounts", "list"] as const,
    },
  },

  dashboard: {
    all: ["dashboard"] as const,
    summary: (period: string) => ["dashboard", "summary", period] as const,
    usersGrowth: ["dashboard", "users-growth"] as const,
    transactionsVolume: ["dashboard", "transactions-volume"] as const,
  },

  featureFlags: {
    all: ["feature-flags"],
    list: ["feature-flags", "list"] as const,
  },

  ajo: {
    all: ["ajo"],
    config: ["ajo", "config"] as const,
    groups: {
      list: ["ajo", "groups", "list"] as const,
      detail: (id: string) => ["ajo", "groups", "detail", id] as const,
    },
  },

  clusters: {
    all: ["clusters"] as const,
    list: ["clusters", "list"] as const,
    detail: (id: string) => ["clusters", "detail", id] as const,
    members: (id: string) => ["clusters", "members", id] as const,
    withdrawals: {
      all: ["clusters", "withdrawals"] as const,
      global: ["clusters", "withdrawals", "global"] as const,
      byCluster: (id: string) =>
        ["clusters", "withdrawals", "cluster", id] as const,
    },
    analytics: {
      all: ["clusters", "analytics"] as const,
      overview: ["clusters", "analytics", "overview"] as const,
      topByBalance: (limit: number) =>
        ["clusters", "analytics", "top-by-balance", limit] as const,
      topByActivity: (filters: Record<string, string | number>) =>
        ["clusters", "analytics", "top-by-activity", filters] as const,
      withdrawalVolume: (filters: Record<string, string>) =>
        ["clusters", "analytics", "withdrawal-volume", filters] as const,
    },
  },

  uploads: {
    all: ["uploads"],
    presign: (fileUrl: string) => ["uploads", "presign", fileUrl] as const,
  },

  reengagement: {
    all: ["reengagement"] as const,
    config: ["reengagement", "config"] as const,
    segments: ["reengagement", "segments"] as const,
    audiences: (params?: { balanceBelow?: number }) =>
      ["reengagement", "audiences", params?.balanceBelow ?? null] as const,
    nudges: {
      list: ["reengagement", "nudges", "list"] as const,
    },
    segmentUsers: (campaign: string) =>
      ["reengagement", "segment-users", campaign, "list"] as const,
  },

  kycReviews: {
    all: ["kyc-reviews"] as const,
    ninList: ["kyc-reviews", "nin", "list"] as const,
    ninDetail: (id: string) => ["kyc-reviews", "nin", "detail", id] as const,
    addressList: ["kyc-reviews", "address", "list"] as const,
    addressDetail: (id: string) =>
      ["kyc-reviews", "address", "detail", id] as const,
  },
} as const
