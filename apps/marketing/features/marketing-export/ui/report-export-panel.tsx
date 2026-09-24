"use client"

import { useState } from "react"
import { DownloadIcon, Loader2Icon } from "lucide-react"

import { DatePicker } from "@gorro/ui/components/date-picker"
import { Button } from "@gorro/ui/components/ui/button"
import { Label } from "@gorro/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"

import { exportMarketingReportAction } from "@/features/marketing-export/actions/export-marketing-report"
import {
  MARKETING_EXPORT_REPORTS,
  type MarketingExportReport,
} from "@/features/marketing-export/constants"
import { useCsvDownload } from "@/features/marketing-export/usecases/use-csv-download"
import { SectionHeading } from "@/features/overview/ui/section"

type ReportExportPanelProps = {
  defaultReport?: MarketingExportReport
  compact?: boolean
}

const PRODUCT_OPTIONS = [
  { value: "", label: "All products" },
  { value: "ajo", label: "Ajo" },
  { value: "cluster", label: "Cluster" },
  { value: "circle", label: "Circle" },
  { value: "savings", label: "Savings" },
] as const

export function ReportExportPanel({
  defaultReport = "campaigns",
  compact = false,
}: ReportExportPanelProps) {
  const { download, isPending } = useCsvDownload()
  const [report, setReport] = useState<MarketingExportReport>(defaultReport)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [product, setProduct] = useState("")

  return (
    <section className="flex flex-col gap-4">
      {!compact ? (
        <SectionHeading
          title="Report exports"
          description="Download CSV snapshots for CGAs, territories, field reports, campaigns, and more. Date range uses YYYY-MM-DD, matching funnel and trends filters."
        />
      ) : null}
      <div className="grid gap-4 rounded-xl border border-border p-4 ring-1 ring-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="export-report">Report</Label>
          <Select
            value={report}
            onValueChange={(value) => setReport(value as MarketingExportReport)}
          >
            <SelectTrigger id="export-report" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARKETING_EXPORT_REPORTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="export-from">From</Label>
          <DatePicker id="export-from" value={from} onChange={setFrom} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="export-to">To</Label>
          <DatePicker id="export-to" value={to} onChange={setTo} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="export-product">Product</Label>
          <Select value={product || "__all__"} onValueChange={(v) => setProduct(v === "__all__" ? "" : v)}>
            <SelectTrigger id="export-product" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value || "__all__"}
                  value={option.value || "__all__"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-4">
          <Button
            type="button"
            disabled={isPending}
            onClick={() =>
              void download(() =>
                exportMarketingReportAction(report, {
                  from: from || undefined,
                  to: to || undefined,
                  product: product || undefined,
                })
              )
            }
          >
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <DownloadIcon />
            )}
            Download CSV
          </Button>
        </div>
      </div>
    </section>
  )
}
