import { Geist_Mono, Outfit } from "next/font/google"

import { Toaster } from "@gorro/ui/components/ui/sonner"
import { TooltipProvider } from "@gorro/ui/components/ui/tooltip"
import { ThemeProvider } from "@gorro/ui/components/theme-provider"
import { cn } from "@gorro/ui/utils"

import { QueryProvider } from "@/lib/query/providers"

import "./globals.css"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Gorro Marketing",
  description: "Gorro marketing dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
