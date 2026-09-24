"use client"

import { useMemo, useState } from "react"
import {
  EyeIcon,
  KeyRoundIcon,
  LandmarkIcon,
  PencilIcon,
  ShieldCheckIcon,
  SnowflakeIcon,
  UserCogIcon,
  BanIcon,
  CircleCheckIcon,
} from "lucide-react"

import {
  DataTableRowActions,
  type DataTableRowActionGroup,
} from "@gorro/ui/components/data-table"
import { useGetProfile } from "@gorro/auth/use-get-profile"
import { canCreateVirtualAccount, canVerifyBvn } from "@/features/auth/access"
import { USER_ROLE } from "@/features/users/constants"
import type { User } from "@/features/users/types"

import { UserBvnVerificationDialog } from "./user-bvn-verification-dialog"
import { UserChangeRoleDialog } from "./user-change-role-dialog"
import { UserCreateVirtualAccountDialog } from "./user-create-virtual-account-dialog"
import { UserDetailsDialog } from "./user-details-dialog"
import { UserDisableWithdrawalsDialog } from "./user-disable-withdrawals-dialog"
import { UserEnableWithdrawalsDialog } from "./user-enable-withdrawals-dialog"
import { UserFreezeDialog } from "./user-freeze-dialog"
import { UserResetPinAlertDialog } from "./user-reset-pin-alert-dialog"
import { UserUpdateDialog } from "./user-update-dialog"

type UserRowActionGroupsParams = {
  isSuperAdmin: boolean
  canVerify: boolean
  canCreateVirtualAccount: boolean
  withdrawalsDisabled: boolean
  onViewUser: () => void
  onUpdateUser: () => void
  onChangeRole: () => void
  onCreateVirtualAccount: () => void
  onFreeze: () => void
  onResetPin: () => void
  onDisableWithdrawals: () => void
  onEnableWithdrawals: () => void
  onVerifyBvn: () => void
}

function useUserRowActionGroups(
  params: UserRowActionGroupsParams
): DataTableRowActionGroup[] {
  const {
    isSuperAdmin,
    canVerify,
    canCreateVirtualAccount: canCreate,
    withdrawalsDisabled,
    onViewUser,
    onUpdateUser,
    onChangeRole,
    onCreateVirtualAccount,
    onFreeze,
    onResetPin,
    onDisableWithdrawals,
    onEnableWithdrawals,
    onVerifyBvn,
  } = params

  return useMemo(
    () => [
      {
        id: "account",
        items: [
          {
            id: "view",
            label: "View user",
            icon: EyeIcon,
            onSelect: onViewUser,
          },
          {
            id: "update",
            label: "Update user",
            icon: PencilIcon,
            onSelect: onUpdateUser,
          },
          ...(canCreate
            ? [
                {
                  id: "create-virtual-account",
                  label: "Create virtual account",
                  icon: LandmarkIcon,
                  onSelect: onCreateVirtualAccount,
                },
              ]
            : []),
          ...(isSuperAdmin
            ? [
                {
                  id: "role",
                  label: "Change user role",
                  icon: UserCogIcon,
                  onSelect: onChangeRole,
                },
              ]
            : []),
        ],
      },
      {
        id: "risk",
        items: [
          ...(isSuperAdmin
            ? [
                {
                  id: "freeze",
                  label: "Freeze",
                  icon: SnowflakeIcon,
                  onSelect: onFreeze,
                },
                {
                  id: "reset-pin",
                  label: "Reset PIN",
                  icon: KeyRoundIcon,
                  onSelect: onResetPin,
                },
                ...(withdrawalsDisabled
                  ? [
                      {
                        id: "enable-withdrawals",
                        label: "Enable withdrawals",
                        icon: CircleCheckIcon,
                        onSelect: onEnableWithdrawals,
                      },
                    ]
                  : [
                      {
                        id: "disable-withdrawals",
                        label: "Disable withdrawals",
                        icon: BanIcon,
                        onSelect: onDisableWithdrawals,
                      },
                    ]),
              ]
            : []),
          ...(canVerify
            ? [
                {
                  id: "verify-bvn",
                  label: "Verify BVN",
                  icon: ShieldCheckIcon,
                  onSelect: onVerifyBvn,
                },
              ]
            : []),
        ],
      },
    ],
    [
      isSuperAdmin,
      canVerify,
      canCreate,
      withdrawalsDisabled,
      onViewUser,
      onUpdateUser,
      onChangeRole,
      onCreateVirtualAccount,
      onFreeze,
      onResetPin,
      onDisableWithdrawals,
      onEnableWithdrawals,
      onVerifyBvn,
    ]
  )
}

type UserRowActionsProps = {
  user: User
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const { data: profile } = useGetProfile()
  const isSuperAdmin =
    profile?.roles?.includes(USER_ROLE.super_admin) === true
  const canVerify = canVerifyBvn(profile?.roles)
  const canCreate = canCreateVirtualAccount(profile?.roles)

  const [viewOpen, setViewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [createVirtualAccountOpen, setCreateVirtualAccountOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [freezeOpen, setFreezeOpen] = useState(false)
  const [resetPinOpen, setResetPinOpen] = useState(false)
  const [disableWithdrawalsOpen, setDisableWithdrawalsOpen] = useState(false)
  const [enableWithdrawalsOpen, setEnableWithdrawalsOpen] = useState(false)
  const [verifyBvnOpen, setVerifyBvnOpen] = useState(false)

  const openActions = useMemo(
    () => ({
      onViewUser: () => setViewOpen(true),
      onUpdateUser: () => setUpdateOpen(true),
      onChangeRole: () => setRoleOpen(true),
      onCreateVirtualAccount: () => setCreateVirtualAccountOpen(true),
      onFreeze: () => setFreezeOpen(true),
      onResetPin: () => setResetPinOpen(true),
      onDisableWithdrawals: () => setDisableWithdrawalsOpen(true),
      onEnableWithdrawals: () => setEnableWithdrawalsOpen(true),
      onVerifyBvn: () => setVerifyBvnOpen(true),
    }),
    []
  )

  const groups = useUserRowActionGroups({
    isSuperAdmin,
    canVerify,
    canCreateVirtualAccount: canCreate,
    withdrawalsDisabled: user.withdrawalsDisabled,
    ...openActions,
  })

  return (
    <>
      <DataTableRowActions
        subjectLabel={user.email}
        menuTitle={user.email}
        groups={groups}
      />
      <UserDetailsDialog user={user} open={viewOpen} onOpenChange={setViewOpen} />
      <UserUpdateDialog user={user} open={updateOpen} onOpenChange={setUpdateOpen} />
      {canCreate ? (
        <UserCreateVirtualAccountDialog
          user={user}
          open={createVirtualAccountOpen}
          onOpenChange={setCreateVirtualAccountOpen}
        />
      ) : null}
      {isSuperAdmin ? (
        <>
          <UserChangeRoleDialog
            user={user}
            open={roleOpen}
            onOpenChange={setRoleOpen}
          />
          <UserFreezeDialog
            user={user}
            open={freezeOpen}
            onOpenChange={setFreezeOpen}
          />
          <UserResetPinAlertDialog
            user={user}
            open={resetPinOpen}
            onOpenChange={setResetPinOpen}
          />
          {!user.withdrawalsDisabled ? (
            <UserDisableWithdrawalsDialog
              user={user}
              open={disableWithdrawalsOpen}
              onOpenChange={setDisableWithdrawalsOpen}
            />
          ) : null}
          {user.withdrawalsDisabled ? (
            <UserEnableWithdrawalsDialog
              user={user}
              open={enableWithdrawalsOpen}
              onOpenChange={setEnableWithdrawalsOpen}
            />
          ) : null}
        </>
      ) : null}
      {canVerify ? (
        <UserBvnVerificationDialog
          user={user}
          open={verifyBvnOpen}
          onOpenChange={setVerifyBvnOpen}
          canVerify={canVerify}
        />
      ) : null}
    </>
  )
}
