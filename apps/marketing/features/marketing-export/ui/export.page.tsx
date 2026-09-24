"use client"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"

import { ReportExportPanel } from "@/features/marketing-export/ui/report-export-panel"

export function MarketingExportPage() {
  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <AdminPageHeader
        title="Data exports"
        description="Download marketing CSV reports for ops and leadership reviews."
      />
      <ReportExportPanel />
    </div>
  )
}
