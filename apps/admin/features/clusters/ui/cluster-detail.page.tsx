"use client"

import {
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  CheckCheckIcon,
  HandCoinsIcon,
  PencilIcon,
  RefreshCwIcon,
  UsersRoundIcon,
} from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { DataTable } from "@gorro/ui/components/data-table"
import { Avatar, AvatarFallback, AvatarImage } from "@gorro/ui/components/ui/avatar"
import { Badge } from "@gorro/ui/components/ui/badge"
import { Button } from "@gorro/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { Skeleton } from "@gorro/ui/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gorro/ui/components/ui/tabs"
import { listClusterWithdrawalsAction } from "@/features/clusters/actions"
import { clusterDetailWithdrawalsColumns } from "@/features/clusters/columns"
import { CLUSTER_CURRENCY } from "@/features/clusters/constants"
import { clusterWithdrawalsTableFilters } from "@/features/clusters/table-filters"
import { ClusterMembersTable } from "@/features/clusters/ui/cluster-members-table"
import { ClusterStatusBadge } from "@/features/clusters/ui/cluster-status-badge"
import { EditClusterDialog } from "@/features/clusters/ui/edit-cluster-dialog"
import { useCluster } from "@/features/clusters/usecases"
import { QUERY_KEYS } from "@/lib/query-keys"
import { routes } from "@/lib/routes"
import type { PaginatedListQueryParams } from "@gorro/api/types/paginated-list"
import { emptyAsNa, formatCurrencyAmount, formatDateTime } from "@gorro/ui/utils"

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardDescription>{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  )
}

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,10rem)_1fr] gap-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium wrap-break-word">{value}</dd>
    </div>
  )
}

export function ClusterDetailPage({ clusterId }: { clusterId: string }) {
  const clusterQuery = useCluster(clusterId)
  const [editOpen, setEditOpen] = useState(false)
  const fetchWithdrawals = useCallback(
    (params: PaginatedListQueryParams) =>
      listClusterWithdrawalsAction(clusterId, params),
    [clusterId]
  )

  if (clusterQuery.isLoading && !clusterQuery.data) {
    return (
      <div className="flex flex-col gap-6 px-4 lg:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  if (clusterQuery.isError || !clusterQuery.data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-destructive">
          {clusterQuery.error instanceof Error
            ? clusterQuery.error.message
            : "Could not load cluster details."}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => clusterQuery.refetch()}
        >
          <RefreshCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </div>
    )
  }

  const cluster = clusterQuery.data
  const initials = cluster.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
        <Link href={routes.protected.clusters.base}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to clusters
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="size-11">
            {cluster.imageUrl ? (
              <AvatarImage src={cluster.imageUrl} alt="" />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <AdminPageHeader title={cluster.name} description={cluster.code} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ClusterStatusBadge status={cluster.status} />
              <Badge variant="outline">
                Interest {cluster.isInterestEnabled ? "enabled" : "disabled"}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon data-icon="inline-start" />
          Edit cluster
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Balance"
          value={formatCurrencyAmount(cluster.balanceNaira, CLUSTER_CURRENCY)}
          icon={BanknoteIcon}
        />
        <MetricCard
          label="Accrued interest"
          value={formatCurrencyAmount(
            cluster.accruedInterestNaira,
            CLUSTER_CURRENCY
          )}
          icon={HandCoinsIcon}
        />
        <MetricCard
          label="Members"
          value={cluster.memberCount.toLocaleString()}
          icon={UsersRoundIcon}
        />
        <MetricCard
          label="Withdrawal approvals"
          value={cluster.requiredApprovals.toLocaleString()}
          icon={CheckCheckIcon}
        />
      </div>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Cluster information</CardTitle>
              <CardDescription>
                Ownership, governance settings, and closure state.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
              <dl className="flex flex-col gap-4">
                <DetailField label="Owner" value={cluster.ownerName} />
                <DetailField label="Owner email" value={cluster.ownerEmail} />
                <DetailField
                  label="Description"
                  value={emptyAsNa(cluster.description)}
                />
                <DetailField
                  label="Created"
                  value={formatDateTime(cluster.createdAt)}
                />
              </dl>
              <dl className="flex flex-col gap-4">
                <DetailField
                  label="Withdrawals"
                  value={cluster.withdrawalCount.toLocaleString()}
                />
                <DetailField
                  label="Interest forfeited"
                  value={cluster.interestForfeited ? "Yes" : "No"}
                />
                <DetailField
                  label="Closure requested"
                  value={
                    cluster.closureRequestedAt
                      ? formatDateTime(cluster.closureRequestedAt)
                      : "N/A"
                  }
                />
                <DetailField
                  label="Closure finalized"
                  value={
                    cluster.closureFinalAt
                      ? formatDateTime(cluster.closureFinalAt)
                      : "N/A"
                  }
                />
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <ClusterMembersTable clusterId={clusterId} />
        </TabsContent>

        <TabsContent value="withdrawals">
          <DataTable
            columns={clusterDetailWithdrawalsColumns}
            fetchData={fetchWithdrawals}
            queryKey={QUERY_KEYS.clusters.withdrawals.byCluster(clusterId)}
            filters={clusterWithdrawalsTableFilters}
            emptyMessage="No withdrawals found for this cluster."
          />
        </TabsContent>
      </Tabs>

      <EditClusterDialog
        cluster={cluster}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}
