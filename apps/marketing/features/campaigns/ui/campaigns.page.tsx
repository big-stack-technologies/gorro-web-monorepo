"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorro/ui/components/ui/select"

import { useTerritories } from "@/features/cgas/usecases"
import { campaignColumns } from "@/features/campaigns/columns/campaign.columns"
import { CampaignFormDialog } from "@/features/campaigns/ui/campaign-form-dialog"
import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { useCampaigns } from "@/features/campaigns/usecases"
import { ReportExportPanel } from "@/features/marketing-export/ui/report-export-panel"
import {
  SectionError,
  SectionHeading,
} from "@/features/overview/ui/section"
import { routes } from "@/lib/routes"

const ALL_TERRITORIES = "__all__"

export function CampaignsPage() {
  const router = useRouter()
  const [territoryFilter, setTerritoryFilter] = React.useState(ALL_TERRITORIES)
  const [createOpen, setCreateOpen] = React.useState(false)

  const territories = useTerritories()
  const filters =
    territoryFilter === ALL_TERRITORIES
      ? {}
      : { territoryId: territoryFilter }
  const campaigns = useCampaigns(filters)

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Campaigns"
          description="Create and track marketing campaigns. Open a row for window-based performance and overlap notes."
        />
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New campaign
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="All campaigns"
          description="Newest first. Filter by territory to match field scope."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={territoryFilter} onValueChange={setTerritoryFilter}>
            <SelectTrigger className="w-55">
              <SelectValue placeholder="Territory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TERRITORIES}>All territories</SelectItem>
              {(territories.data ?? []).map((territory) => (
                <SelectItem key={territory.id} value={territory.id}>
                  {territory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {campaigns.isError ? (
          <SectionError
            error={campaigns.error}
            onRetry={() => void campaigns.refetch()}
          />
        ) : (
          <CgaSortableTable
            data={campaigns.data ?? []}
            columns={campaignColumns}
            isLoading={campaigns.isLoading || territories.isLoading}
            emptyMessage="No campaigns yet. Create one to start tracking performance."
            defaultSorting={[{ id: "period", desc: true }]}
            onRowClick={(row) =>
              router.push(routes.campaigns.detail(row.id))
            }
          />
        )}
      </section>

      <ReportExportPanel defaultReport="campaigns" compact />

      <CampaignFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
