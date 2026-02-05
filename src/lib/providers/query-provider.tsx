"use client"

/**
 * React Query Provider 컴포넌트
 *
 * 앱 루트에서 QueryClient를 제공합니다.
 * - staleTime: 1분 (동일 데이터 재요청 억제)
 * - refetchOnWindowFocus: false (창 포커스 시 자동 재요청 비활성화)
 * - mutations retry: 1회
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
