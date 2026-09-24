"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

import { createQueryClient, type QueryClientOptions } from "./query-client"

type QueryProviderProps = QueryClientOptions & {
  children: React.ReactNode
}

export function QueryProvider({
  children,
  sessionClearPath,
  protectedPathPrefix,
}: QueryProviderProps) {
  const [queryClient] = useState(() =>
    createQueryClient({ sessionClearPath, protectedPathPrefix })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
