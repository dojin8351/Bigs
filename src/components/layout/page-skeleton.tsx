"use client"

/**
 * 초기 로딩용 페이지 스켈레톤
 * hasHydrated 전 화면 깜빡임 방지 및 체감 로딩 개선
 */
import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-6 py-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </header>
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <div className="space-y-12">
          <section className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </section>
          <section className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </section>
          <section className="h-48 rounded-2xl">
            <Skeleton className="h-full w-full rounded-2xl" />
          </section>
        </div>
      </main>
    </div>
  )
}
