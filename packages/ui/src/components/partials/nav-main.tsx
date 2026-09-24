"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

export type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

export type NavSection = {
  title?: string
  items: NavItem[]
}

function normalizePathname(pathname: string) {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname
}

/** Exact match for the app home item; prefix match for every other section root. */
function isNavItemActive(pathname: string, itemUrl: string, homeUrl: string) {
  if (itemUrl === "#") return false

  const path = normalizePathname(pathname)

  if (itemUrl === homeUrl) {
    return path === homeUrl
  }

  return path === itemUrl || path.startsWith(`${itemUrl}/`)
}

export function NavMain({
  sections,
  homeUrl,
}: {
  sections: NavSection[]
  homeUrl: string
}) {
  const pathname = usePathname()

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={section.title ?? `nav-${index}`}>
          {section.title ? (
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          ) : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isNavItemActive(pathname, item.url, homeUrl)}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
