"use client"

/**
 * 게시글 목록 활성 필터 표시
 *
 * 적용 중인 필터(카테고리, 검색어, 정렬)를 칩 형태로 표시.
 * X 클릭 시 해당 필터 해제. 직관적인 피드백 제공.
 */
import { ArrowDown, ArrowUp, Filter, Search, Tag, X } from "lucide-react"
import type { BoardCategory, CategoryResponse } from "@/types/post"
import type { SortColumn, SortDirection } from "@/hooks/use-post-list"
import { cn } from "@/lib/utils"

interface PostListActiveFiltersProps {
  selectedCategory?: BoardCategory
  searchQuery: string
  sortColumn: SortColumn
  sortDirection: SortDirection
  categories?: CategoryResponse | null
  totalCount: number
  onClearCategory: () => void
  onClearSearch: () => void
  onSortClick?: () => void
}

const SORT_LABELS: Record<SortColumn, string> = {
  title: "제목",
  date: "작성일",
}

export function PostListActiveFilters({
  selectedCategory,
  searchQuery,
  sortColumn,
  sortDirection,
  categories,
  totalCount,
  onClearCategory,
  onClearSearch,
}: PostListActiveFiltersProps) {
  const hasCategory = selectedCategory !== undefined
  const hasSearch = searchQuery.trim().length > 0
  const hasAnyFilter = hasCategory || hasSearch

  const categoryLabel = hasCategory && categories && selectedCategory in categories
    ? categories[selectedCategory as keyof CategoryResponse]
    : selectedCategory

  const sortLabel = sortDirection === "asc" ? "오름차순" : "내림차순"

  if (!hasAnyFilter) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ArrowDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
          <span>{SORT_LABELS[sortColumn]} {sortLabel}</span>
          <span className="text-muted-foreground/70">·</span>
          <span>총 {totalCount.toLocaleString()}건</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          헤더를 클릭하면 정렬을 변경할 수 있습니다
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-border/40 bg-muted/20">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
        {hasCategory && (
          <Chip
            icon={<Tag className="h-3.5 w-3.5" />}
            label={`카테고리: ${categoryLabel}`}
            onClear={onClearCategory}
          />
        )}
        {hasSearch && (
          <Chip
            icon={<Search className="h-3.5 w-3.5" />}
            label={`"${searchQuery.trim()}"`}
            onClear={onClearSearch}
          />
        )}
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ArrowDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
          {SORT_LABELS[sortColumn]} {sortLabel}
        </span>
        <span className="text-sm text-muted-foreground/70">·</span>
        <span className="text-sm text-muted-foreground">
          {totalCount.toLocaleString()}건
        </span>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">
        헤더를 클릭하면 정렬을 변경할 수 있습니다
      </span>
    </div>
  )
}

function Chip({
  icon,
  label,
  onClear,
}: {
  icon?: React.ReactNode
  label: string
  onClear: () => void
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        "bg-primary/10 text-primary px-3 py-1 text-sm font-medium",
        "ring-1 ring-primary/20"
      )}
    >
      {icon}
      <span className="max-w-[200px] truncate">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        aria-label={`${label} 필터 제거`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  )
}
