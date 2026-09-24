"use client"

import * as React from "react"
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

import { CgaSortableTable } from "@/features/cgas/ui/cga-sortable-table"
import { useMarketingCgas, useTerritories } from "@/features/cgas/usecases"
import { createCommunityListColumns } from "@/features/communities/columns/community-list.columns"
import { COMMUNITY_TYPES } from "@/features/communities/constants"
import type { CommunityListFilters } from "@/features/communities/types"
import { CommunityFormDialog } from "@/features/communities/ui/community-form-dialog"
import { useCommunitiesList } from "@/features/communities/usecases"
import { SectionError, SectionHeading } from "@/features/overview/ui/section"

const ALL_TYPES = "__all_types__"
const ALL_TERRITORIES = "__all_territories__"
const ALL_CGAS = "__all_cgas__"

export function CommunitiesPage() {
  const [typeFilter, setTypeFilter] = React.useState(ALL_TYPES)
  const [territoryFilter, setTerritoryFilter] = React.useState(ALL_TERRITORIES)
  const [cgaFilter, setCgaFilter] = React.useState(ALL_CGAS)
  const [createOpen, setCreateOpen] = React.useState(false)

  const territories = useTerritories()
  const cgas = useMarketingCgas()

  const filters = React.useMemo((): CommunityListFilters => {
    const result: CommunityListFilters = {}
    if (typeFilter !== ALL_TYPES) result.type = typeFilter
    if (territoryFilter !== ALL_TERRITORIES) {
      result.territoryId = territoryFilter
    }
    if (cgaFilter !== ALL_CGAS) result.cgaUserId = cgaFilter
    return result
  }, [typeFilter, territoryFilter, cgaFilter])

  const communities = useCommunitiesList(filters)

  const listColumns = React.useMemo(() => createCommunityListColumns(), [])

  return (
    <div className="flex flex-col gap-8 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Communities"
          description="Markets, churches, and other groups owned by CGAs. Link customers for penetration and activity tracking."
        />
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New community
        </Button>
      </div>

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="All communities"
          description="Filter by type, territory, or CGA. Penetration shows — when estimated size is unknown."
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TYPES}>All types</SelectItem>
              {COMMUNITY_TYPES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={territoryFilter} onValueChange={setTerritoryFilter}>
            <SelectTrigger className="w-52">
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

          <Select value={cgaFilter} onValueChange={setCgaFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="CGA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CGAS}>All CGAs</SelectItem>
              {(cgas.data ?? []).map((cga) => (
                <SelectItem key={cga.userId} value={cga.userId}>
                  {cga.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {communities.isError ? (
          <SectionError
            error={communities.error}
            onRetry={() => void communities.refetch()}
          />
        ) : (
          <CgaSortableTable
            data={communities.data ?? []}
            columns={listColumns}
            isLoading={
              communities.isLoading ||
              territories.isLoading ||
              cgas.isLoading
            }
            emptyMessage="No communities yet. Create one to start linking members."
            defaultSorting={[{ id: "name", desc: false }]}
          />
        )}
      </section>

      <CommunityFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
