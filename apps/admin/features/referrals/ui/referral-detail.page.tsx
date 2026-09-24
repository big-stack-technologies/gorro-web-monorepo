"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { AdminPageHeader } from "@gorro/ui/components/admin-page-header"
import { Button } from "@gorro/ui/components/ui/button"
import { ReferralDetailsView } from "@/features/referrals/ui/referral-details-view"
import { routes } from "@/lib/routes"

type ReferralDetailPageProps = {
  userId: string
}

export function ReferralDetailPage({ userId }: ReferralDetailPageProps) {
  return (
    <div className="flex flex-col gap-6 px-4 pb-8 lg:px-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5 px-0" asChild>
          <Link href={routes.protected.referrals.base}>
            <ArrowLeftIcon />
            Back to referrals
          </Link>
        </Button>
        <AdminPageHeader
          title="Referral details"
          description="User referral profile, who referred them, and their referrals."
        />
        <p className="font-mono text-xs text-muted-foreground break-all">
          {userId}
        </p>
      </div>
      <ReferralDetailsView userId={userId} />
    </div>
  )
}
