"use server"

import { normalizeContributorBackfill } from "@/features/clusters/actions/normalize-contributor-backfill"
import type { ContributorBackfillResult } from "@/features/clusters/types"
import type { ActionResult } from "@gorro/api/action-result"
import { actionFailure } from "@gorro/api/action-result"
import { post } from "@gorro/api/client"
import { endpoints } from "@/lib/endpoints"

export async function backfillClusterContributorsAction(
  dryRun: boolean
): Promise<ActionResult<ContributorBackfillResult>> {
  try {
    const { data } = await post<unknown>(
      endpoints.admin.clustersBackfillContributors,
      { dryRun }
    )
    return {
      success: true,
      data: normalizeContributorBackfill(data, dryRun),
    }
  } catch (error) {
    console.error("Contributor backfill action failed:", error)
    return actionFailure(error, "Could not run the contributor backfill")
  }
}
