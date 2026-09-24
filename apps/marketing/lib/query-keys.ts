/** Client-safe TanStack Query keys for the marketing app. */

export const QUERY_KEYS = {
  overview: {
    all: ["marketing", "overview"] as const,
    summary: ["marketing", "overview", "summary"] as const,
    management: ["marketing", "overview", "management"] as const,
    alerts: ["marketing", "overview", "alerts"] as const,
  },
  cgas: {
    all: ["marketing", "cgas"] as const,
    metricsSummary: (filters: Record<string, string>) =>
      ["marketing", "cgas", "metrics-summary", filters] as const,
    metricsTrends: (filters: Record<string, string>) =>
      ["marketing", "cgas", "metrics-trends", filters] as const,
    list: ["marketing", "cgas", "list"] as const,
    performance: (filters: Record<string, string>) =>
      ["marketing", "cgas", "performance", filters] as const,
    territories: ["marketing", "cgas", "territories"] as const,
    teamLeads: ["marketing", "cgas", "team-leads"] as const,
    customers: (userId: string) =>
      ["marketing", "cgas", "customers", userId] as const,
    customersList: (userId: string) =>
      ["marketing", "cgas", "customers", userId, "list"] as const,
  },
  analytics: {
    all: ["marketing", "analytics"] as const,
    funnel: (filters: Record<string, string>) =>
      ["marketing", "analytics", "funnel", filters] as const,
    dormancy: (filters: Record<string, string>) =>
      ["marketing", "analytics", "dormancy", filters] as const,
    trends: (filters: Record<string, string>) =>
      ["marketing", "analytics", "trends", filters] as const,
  },
  targets: {
    all: ["marketing", "targets"] as const,
    list: (filters: Record<string, string>) =>
      ["marketing", "targets", "list", filters] as const,
    alertRules: ["marketing", "targets", "alert-rules"] as const,
  },
  communities: {
    all: ["marketing", "communities"] as const,
    list: (filters: Record<string, string>) =>
      ["marketing", "communities", "list", filters] as const,
  },
  campaigns: {
    all: ["marketing", "campaigns"] as const,
    communities: ["marketing", "campaigns", "communities"] as const,
    list: (filters: Record<string, string>) =>
      ["marketing", "campaigns", "list", filters] as const,
    performance: (id: string) =>
      ["marketing", "campaigns", "performance", id] as const,
  },
  segments: {
    all: ["marketing", "segments"] as const,
    summary: (options: Record<string, string>) =>
      ["marketing", "segments", "summary", options] as const,
    users: (key: string, options: Record<string, string>) =>
      ["marketing", "segments", "users", key, options] as const,
  },
  org: {
    all: ["marketing", "org"] as const,
    territories: (options: Record<string, string>) =>
      ["marketing", "org", "territories", options] as const,
    territoriesPerformance: (filters: Record<string, string>) =>
      ["marketing", "org", "territories", "performance", filters] as const,
    teamLeads: (options: Record<string, string>) =>
      ["marketing", "org", "team-leads", options] as const,
    teamLeadsPerformance: (filters: Record<string, string>) =>
      ["marketing", "org", "team-leads", "performance", filters] as const,
  },
} as const
