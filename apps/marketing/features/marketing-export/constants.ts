export const MARKETING_EXPORT_REPORTS = [
  { value: "cgas", label: "CGAs" },
  { value: "team-leads", label: "Team leads" },
  { value: "territories", label: "Territories" },
  { value: "communities", label: "Communities" },
  { value: "field-reports", label: "Field reports" },
  { value: "campaigns", label: "Campaigns" },
] as const

export type MarketingExportReport =
  (typeof MARKETING_EXPORT_REPORTS)[number]["value"]
