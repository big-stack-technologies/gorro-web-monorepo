import type { DataTableFilterField } from "@gorro/ui/components/data-table"
import { USER_ROLE_FILTER_OPTIONS } from "@/features/users/constants"

/** Users list: filter config for the shared DataTable filter bar. */
export const usersTableFilters: DataTableFilterField[] = [
  {
    type: "text",
    param: "email",
    label: "Email",
    placeholder: "Email",
  },
  {
    type: "text",
    param: "phoneNumber",
    label: "Phone",
    placeholder: "Phone",
  },
  {
    type: "select",
    param: "role",
    label: "Role",
    placeholder: "Role",
    options: USER_ROLE_FILTER_OPTIONS.map((o) => ({ ...o })),
    emptyLabel: "All roles",
  },
  {
    type: "text",
    param: "firstName",
    label: "First name",
    placeholder: "First name",
  },
  {
    type: "text",
    param: "lastName",
    label: "Last name",
    placeholder: "Last name",
  },
]
