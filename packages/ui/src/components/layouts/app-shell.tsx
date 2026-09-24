import type { ReactNode } from "react"

import { SidebarInset, SidebarProvider } from "../ui/sidebar"

type AppShellProps = {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

export function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <SidebarProvider
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {sidebar}
      <SidebarInset>
        {header}
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
