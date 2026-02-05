"use client"

/**
 * 게시글 카테고리 필터 사이드바
 *
 * - 모바일/태블릿(lg 미만): 수평 스크롤 nav
 * - 데스크톱(lg 이상): 세로 사이드바 카드(sticky top-6)
 * - "모두" + categories 객체 기반 버튼. selectedCategory와 일치 시 primary 스타일
 */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BoardCategory, CategoryResponse } from "@/types/post"

interface PostCategorySidebarProps {
  categories?: CategoryResponse
  selectedCategory?: BoardCategory
  onCategoryChange: (category: BoardCategory | undefined) => void
}

export function PostCategorySidebar({
  categories,
  selectedCategory,
  onCategoryChange,
}: PostCategorySidebarProps) {
  /** 모바일·데스크톱에서 동일 버튼 재사용. 모바일: 수평 스크롤, 데스크톱: 세로 목록 */
  const categoryButtons = (
    <>
      <button
        onClick={() => onCategoryChange(undefined)}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0",
          selectedCategory === undefined
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        모두
      </button>
      {categories &&
        Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key as BoardCategory)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0",
              selectedCategory === key
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
    </>
  )

  return (
    <>
      {/* 모바일/태블릿: 수평 스크롤 */}
      <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6">
        <nav className="flex gap-2 overflow-x-auto pb-2 -mb-2 overscroll-x-contain">
          {categoryButtons}
        </nav>
      </div>

      {/* 데스크톱: 세로 사이드바 */}
      <aside className="hidden lg:block w-64 shrink-0">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5 dark:bg-card dark:shadow-lg dark:shadow-black/10 sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-1">
              <button
                onClick={() => onCategoryChange(undefined)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === undefined
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                모두
              </button>
              {categories &&
                Object.entries(categories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => onCategoryChange(key as BoardCategory)}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedCategory === key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ))}
            </nav>
          </CardContent>
        </Card>
      </aside>
    </>
  )
}
