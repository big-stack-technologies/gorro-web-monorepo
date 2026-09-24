export const endpoints = {
  cga: {
    metricsSummary: "/admin/cga/metrics/summary",
    metricsTrends: "/admin/cga/metrics/trends",
  },
  marketing: {
    summary: "/admin/marketing/summary",
    managementSummary: "/admin/marketing/summary/management",
    alerts: "/admin/marketing/alerts",
    cgas: "/admin/marketing/cgas",
    cgasPerformance: "/admin/marketing/cgas/performance",
    cgaCustomers: (userId: string) =>
      `/admin/marketing/cgas/${encodeURIComponent(userId)}/customers`,
    cgaTargets: (userId: string) =>
      `/admin/marketing/cgas/${encodeURIComponent(userId)}/targets`,
    cgaAssignment: (userId: string) =>
      `/admin/marketing/cgas/${encodeURIComponent(userId)}/assignment`,
    territories: "/admin/marketing/territories",
    territory: (id: string) =>
      `/admin/marketing/territories/${encodeURIComponent(id)}`,
    territoriesPerformance: "/admin/marketing/territories/performance",
    teamLeads: "/admin/marketing/team-leads",
    teamLead: (id: string) =>
      `/admin/marketing/team-leads/${encodeURIComponent(id)}`,
    teamLeadsPerformance: "/admin/marketing/team-leads/performance",
    funnel: "/admin/marketing/funnel",
    dormancy: "/admin/marketing/dormancy",
    trends: "/admin/marketing/trends",
    targets: "/admin/marketing/targets",
    alertRules: "/admin/marketing/alert-rules",
    alertRule: (code: string) =>
      `/admin/marketing/alert-rules/${encodeURIComponent(code)}`,
    communities: "/admin/marketing/communities",
    community: (id: string) =>
      `/admin/marketing/communities/${encodeURIComponent(id)}`,
    communityMembers: (id: string) =>
      `/admin/marketing/communities/${encodeURIComponent(id)}/members`,
    communityMember: (id: string, userId: string) =>
      `/admin/marketing/communities/${encodeURIComponent(id)}/members/${encodeURIComponent(userId)}`,
    campaigns: "/admin/marketing/campaigns",
    campaign: (id: string) =>
      `/admin/marketing/campaigns/${encodeURIComponent(id)}`,
    campaignPerformance: (id: string) =>
      `/admin/marketing/campaigns/${encodeURIComponent(id)}/performance`,
    segments: "/admin/marketing/segments",
    segment: (key: string) =>
      `/admin/marketing/segments/${encodeURIComponent(key)}`,
    segmentExport: (key: string) =>
      `/admin/marketing/segments/${encodeURIComponent(key)}/export`,
    exportReport: (report: string) =>
      `/admin/marketing/export/${encodeURIComponent(report)}`,
  },
} as const
