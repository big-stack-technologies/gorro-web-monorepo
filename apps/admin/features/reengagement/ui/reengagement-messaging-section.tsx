"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorro/ui/components/ui/card"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { BroadcastReengagementForm } from "@/features/reengagement/ui/broadcast-reengagement-form"
import { SendReengagementEmailForm } from "@/features/reengagement/ui/send-reengagement-email-form"
import { USER_ROLE } from "@/features/users/constants"

export function ReengagementMessagingSection() {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true

  if (!isSuperAdmin) {
    return (
      <Card className="border-border/80 shadow-sm ring-1 ring-border/40">
        <CardHeader>
          <CardTitle className="font-heading text-base">Messaging</CardTitle>
          <CardDescription>
            Only super admins can send push broadcasts or compose re-engagement
            emails.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <BroadcastReengagementForm />
      <SendReengagementEmailForm />
    </div>
  )
}
