"use client"

/**
 * 게시판 페이지 (/posts)
 * 인증 필요. hasHydrated && (!isAuthenticated || !accessToken) 시 /login 리다이렉트.
 * hydration/인증 확인 중 스켈레톤. 로그아웃 시 React Query 캐시 초기화.
 */
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/lib/stores/auth-store"
import { PostList } from "@/components/posts/post-list"
import { Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserInfo } from "@/components/user/user-info"

export default function PostsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  useEffect(() => {
    // hydration이 완료된 후에만 인증 상태 확인
    if (!hasHydrated) {
      return
    }

    // 인증 상태 확인
    if (!isAuthenticated || !accessToken) {
      router.replace("/login")
    }
  }, [hasHydrated, isAuthenticated, accessToken, router])

  const handleLogout = () => {
    useAuthStore.getState().clearTokens()
    queryClient.clear()
    router.replace("/")
  }

  // hydration이 완료되지 않았거나 인증 확인 중이거나 인증되지 않은 경우 로딩 표시
  if (!hasHydrated || !isAuthenticated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="h-8 w-8 animate-spin text-primary"
            style={{
              animation: "spin 1s linear infinite",
            }}
          />
          <p className="text-sm text-muted-foreground">
            {!hasHydrated ? "로딩 중..." : "인증 확인 중..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
        <Link
          href="/posts"
          className="text-xl sm:text-2xl font-bold text-primary transition-all hover:opacity-80"
        >
          BIGS
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <UserInfo
              username={user.username}
              name={user.name}
              onLogout={handleLogout}
            />
          )}
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-6xl w-full">
        <PostList />
      </main>
    </div>
  )
}
