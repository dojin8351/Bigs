"use client"

/**
 * next-themes ThemeProvider 래퍼
 * 라이트/다크/시스템 테마 지원
 */
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
