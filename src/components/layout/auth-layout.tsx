/**
 * 인증 페이지 레이아웃 (로그인·회원가입)
 * 헤더(로고, 테마 토글)와 중앙 정렬된 메인 영역 제공
 */
import { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const ariaLabel = [title, description].filter(Boolean).join(" - ") || undefined
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5" aria-label={ariaLabel}>
      <header className="flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-6 py-4">
        <Link 
          href="/" 
          className="text-2xl font-bold text-primary transition-all hover:opacity-80"
        >
          DOHYEON
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </main>
    </div>
  )
}
