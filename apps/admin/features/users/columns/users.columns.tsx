import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@gorro/ui/components/ui/badge"
import { type User, UserRowActions } from "@/features/users"
import { emptyAsNa, formatDateTime, joinPartsOrEmDash } from "@gorro/ui/utils"

function formatUserDisplayName(user: User) {
  const name = joinPartsOrEmDash([user.firstName, user.middleName, user.lastName])
  return name === "—" ? "N/A" : name
}

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="font-medium">{emptyAsNa(row.original.email)}</span>
    ),
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => formatUserDisplayName(row),
    cell: ({ row }) => formatUserDisplayName(row.original),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => emptyAsNa(row.original.phoneNumber),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="secondary">{emptyAsNa(row.original.role)}</Badge>
    ),
  },
  {
    id: "withdrawals",
    header: "Withdrawals",
    accessorFn: (row) =>
      row.withdrawalsDisabled ? "disabled" : "enabled",
    cell: ({ row }) =>
      row.original.withdrawalsDisabled ? (
        <Badge variant="destructive">Disabled</Badge>
      ) : (
        <Badge variant="outline">Enabled</Badge>
      ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => emptyAsNa(row.original.gender),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const v = row.original.createdAt
      return emptyAsNa(v) === "N/A" ? "N/A" : formatDateTime(v)
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
]
