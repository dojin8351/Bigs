"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserInfo } from "@/components/user/user-info"

interface MainHeaderProps {
  isAuthenticated: boolean
  username?: string
  name?: string
  onLogout?: () => void
}

export function MainHeader({
  isAuthenticated,
  username,
  name,
  onLogout,
}: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">BIGS</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {username && name && (
                <UserInfo
                  username={username}
                  name={name}
                  onLogout={onLogout}
                />
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
