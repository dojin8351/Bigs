"use client"

/**
 * 홈 페이지 (/)
 * 서비스 소개 인트로 + 로그인/회원가입 진입. hasHydrated && isAuthenticated 시 /posts로 리다이렉트.
 * hydration 전에는 PageSkeleton 표시 (깜빡임 방지).
 */
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageSkeleton } from "@/components/layout/page-skeleton"
import {
  FileText,
  Search,
  Share2,
  FolderOpen,
  LogIn,
  UserPlus,
} from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"

const features = [
  {
    icon: FileText,
    title: "게시글 작성",
    description: "카테고리별로 게시글을 작성하고 이미지를 첨부할 수 있어요.",
  },
  {
    icon: Search,
    title: "제목 검색",
    description: "검색창에서 제목으로 원하는 게시글을 빠르게 찾아보세요.",
  },
  {
    icon: FolderOpen,
    title: "카테고리 필터",
    description: "공지, 자유, QnA, 기타 등 카테고리별로 구분해서 볼 수 있어요.",
  },
  {
    icon: Share2,
    title: "링크 공유",
    description: "게시글 링크를 복사해 북마크나 공유가 가능해요.",
  },
]

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/posts")
    }
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated) {
    return <PageSkeleton />
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-6 py-4">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-primary transition-all hover:opacity-80">
          DOHYEON
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="space-y-12 sm:space-y-16 animate-fade-in">
          {/* Hero */}
          <section className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              DOHYEON 게시판
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              간단하고 직관적인 게시판 서비스예요.
              <br className="hidden sm:block" />
              로그인하면 바로 글을 작성하고 관리할 수 있어요.
            </p>
          </section>

          {/* 이 서비스는 어떻게 사용해요? */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              이 서비스는 어떻게 사용해요?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5 shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA: 로그인 / 회원가입 */}
          <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-linear-to-br from-card via-card to-primary/5 dark:to-primary/10 backdrop-blur-xl p-8 sm:p-10 shadow-xl shadow-primary/5 dark:shadow-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--primary)_0%,transparent_50%)] opacity-[0.03] dark:opacity-[0.06] pointer-events-none" />
            <div className="relative space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  지금 바로 시작하세요
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  계정에 로그인하거나 새 계정을 만들어 글을 작성해보세요
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <Link
                  href="/login"
                  className="group flex flex-col items-center rounded-xl border-2 border-border/60 bg-background/50 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/10 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <LogIn className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">로그인</h3>
                  <p className="text-sm text-muted-foreground text-center mb-5">
                    계정이 있으시다면
                  </p>
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    로그인 하러 가기 →
                  </span>
                </Link>
                <Link
                  href="/signup"
                  className="group flex flex-col items-center rounded-xl border-2 border-primary/30 bg-primary/5 dark:bg-primary/10 hover:border-primary/50 hover:bg-primary/10 dark:hover:bg-primary/15 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/15"
                >
                  <div className="rounded-full bg-primary/20 p-4 mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">회원가입</h3>
                  <p className="text-sm text-muted-foreground text-center mb-5">
                    처음이시라면
                  </p>
                  <span className="text-sm font-medium text-primary group-hover:underline">
                    무료로 가입하기 →
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
