"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, RefreshCwIcon, UserIcon } from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { USER_ROLE } from "@/features/users/constants"
import type { ReferralPair } from "@/features/referrals/types"
import { RetriggerReferralBonusesDialog } from "@/features/referrals/ui/retrigger-referral-bonuses-dialog"
import { routes } from "@/lib/routes"

type ReferralRowActionsProps = {
  referral: ReferralPair
}

export function ReferralRowActions({ referral }: ReferralRowActionsProps) {
  const router = useRouter()
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  const [retriggerOpen, setRetriggerOpen] = useState(false)

  const subjectLabel = `${referral.referrerName} → ${referral.refereeName}`

  const groups = useMemo((): DataTableRowActionGroup[] => {
    const viewGroup: DataTableRowActionGroup = {
      id: "view",
      items: [
        {
          id: "view-referrer",
          label: "View referrer",
          icon: UserIcon,
          onSelect: () =>
            router.push(
              routes.protected.referrals.detail(referral.referrerId)
            ),
        },
        {
          id: "view-referee",
          label: "View referee",
          icon: EyeIcon,
          onSelect: () =>
            router.push(
              routes.protected.referrals.detail(referral.refereeId)
            ),
        },
      ],
    }

    if (!isSuperAdmin) {
      return [viewGroup]
    }

    const actionsGroup: DataTableRowActionGroup = {
      id: "actions",
      items: [
        {
          id: "retrigger",
          label: "Retrigger bonuses",
          icon: RefreshCwIcon,
          onSelect: () => setRetriggerOpen(true),
        },
      ],
    }

    return [viewGroup, actionsGroup]
  }, [isSuperAdmin, referral.refereeId, referral.referrerId, router])

  return (
    <>
      <DataTableRowActions
        subjectLabel={subjectLabel}
        menuTitle={subjectLabel}
        groups={groups}
      />
      {isSuperAdmin ? (
        <RetriggerReferralBonusesDialog
          userId={referral.referrerId}
          userName={referral.referrerName}
          open={retriggerOpen}
          onOpenChange={setRetriggerOpen}
        />
      ) : null}
    </>
  )
}
