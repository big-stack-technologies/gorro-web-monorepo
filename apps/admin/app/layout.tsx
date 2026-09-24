import { Geist_Mono, Outfit } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@gorro/ui/components/theme-provider"
import { cn } from "@gorro/ui/utils"
import { TooltipProvider } from "@gorro/ui/components/ui/tooltip"
import { QueryProvider } from "@/lib/query/providers"
import { Toaster } from "@gorro/ui/components/ui/sonner"

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", outfit.variable)}
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
