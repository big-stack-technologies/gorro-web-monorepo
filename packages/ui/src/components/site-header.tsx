"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"

export type BreadcrumbSegment = {
  label: string
  /** Omit for the current page segment. */
  href?: string
}

export function SiteHeader({
  getBreadcrumbSegments,
}: {
  getBreadcrumbSegments: (pathname: string) => BreadcrumbSegment[]
}) {
  const pathname = usePathname()
  const segments = getBreadcrumbSegments(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex min-w-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-2 shrink-0 data-[orientation=vertical]:h-6"
        />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            {segments.map((segment, i) => {
              const isLast = i === segments.length - 1
              return (
                <React.Fragment key={`${segment.label}-${i}`}>
                  {i > 0 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  <BreadcrumbItem
                    className={!isLast ? "hidden max-w-48 truncate md:block" : "min-w-0 max-w-[min(100%,20rem)] truncate"}
                  >
                    {isLast ? (
                      <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                    ) : segment.href != null ? (
                      <BreadcrumbLink asChild>
                        <Link href={segment.href}>{segment.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-muted-foreground">{segment.label}</span>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
