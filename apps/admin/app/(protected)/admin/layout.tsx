import AdminShellLayout from "@/components/layouts/AdminShell.layout"

/** Session + API use cookies; do not statically prerender admin routes. */
export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShellLayout>{children}</AdminShellLayout>
}
