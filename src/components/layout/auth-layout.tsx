import { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/20">
      <header className="flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary">
          BIGS
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
