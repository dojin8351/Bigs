"use client"

/**
 * 게시글 테이블 컴포넌트
 *
 * - md 미만: PostMobileCard 카드 뷰 (모바일 정렬 버튼 포함)
 * - md 이상: Table + SortableHeader (제목, 작성일 정렬, aria-sort, 키보드 접근성)
 * - 로딩: Skeleton. 에러: 메시지 + 다시 시도. 빈 목록: "글 작성" 유도 UI
 */
import { ArrowDown, ArrowUp, ArrowUpDown, FileQuestion, Plus, RefreshCw, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PostTableRow } from "@/components/posts/post-table-row"
import type { PostListItem, PostListResponse, CategoryResponse } from "@/types/post"
import type { SortColumn, SortDirection } from "@/hooks/use-post-list"

interface PostTableProps {
  isLoading: boolean
  isError: boolean
  error: Error | null
  posts: PostListItem[]
  postListData?: PostListResponse
  pageSize: number
  formatDate: (dateString: string) => string
  onView: (post: PostListItem) => void
  sortColumn?: SortColumn
  sortDirection?: SortDirection
  onSort?: (column: SortColumn) => void
  onRetry?: () => void
  onOpenCreateDialog?: () => void
  categories?: CategoryResponse | null
  /** 검색/필터로 인해 결과가 없을 때 true (글 작성 유도 대신 "검색 결과가 없습니다" 표시) */
  isEmptyFromFilter?: boolean
}

/** md 미만에서 사용. 테이블 대신 카드 형태로 표시, 클릭 시 onView */
function PostMobileCard({
  post,
  postNumber,
  formatDate,
  categoryLabel,
  onView,
}: {
  post: PostListItem
  postNumber: number
  formatDate: (dateString: string) => string
  categoryLabel: string
  onView: (post: PostListItem) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onView(post)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onView(post)
      }}
      className="rounded-lg border border-border/50 bg-card p-4 active:bg-muted/30 transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-muted-foreground mr-2">#{postNumber}</span>
          <span className="text-xs text-muted-foreground/80 mr-2">[{categoryLabel}]</span>
          <h3 className="font-medium text-foreground truncate">{post.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}

/** 정렬 가능 컬럼 헤더. aria-sort, 키보드(Enter/Space) 접근성 지원 */
function SortableHeader({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
  className = "",
}: {
  label: string
  column: SortColumn
  sortColumn?: SortColumn
  sortDirection?: SortDirection
  onSort?: (column: SortColumn) => void
  className?: string
}) {
  const isActive = sortColumn === column
  const ariaSort = onSort
    ? isActive
      ? sortDirection === "asc"
        ? "ascending"
        : "descending"
      : "none"
    : undefined
  return (
    <TableHead
      role={onSort ? "columnheader" : undefined}
      aria-sort={ariaSort}
      className={`font-semibold select-none px-4 py-3 ${onSort ? "cursor-pointer hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : ""} ${isActive ? "bg-primary/10 text-primary border-b-2 border-primary" : ""} ${className}`}
      onClick={() => onSort?.(column)}
      onKeyDown={(e) => {
        if (onSort && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onSort(column)
        }
      }}
      tabIndex={onSort ? 0 : undefined}
      title={onSort ? (isActive ? `${sortDirection === "asc" ? "오름차순" : "내림차순"} (클릭 시 전환)` : "클릭하여 정렬") : undefined}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {onSort && (
          isActive ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium">
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <ArrowDown className="h-4 w-4 shrink-0" aria-hidden />
              )}
              <span className="hidden sm:inline">
                {sortDirection === "asc" ? "오름차순" : "내림차순"}
              </span>
            </span>
          ) : (
            <ArrowUpDown className="h-4 w-4 text-muted-foreground/60" aria-label="정렬 가능" />
          )
        )}
      </div>
    </TableHead>
  )
}

export function PostTable({
  isLoading,
  isError,
  error,
  posts,
  postListData,
  pageSize,
  formatDate,
  onView,
  sortColumn,
  sortDirection,
  onSort,
  onRetry,
  onOpenCreateDialog,
  categories,
  isEmptyFromFilter = false,
}: PostTableProps) {
  const getCategoryLabel = (key: string) =>
    categories && key in categories ? categories[key as keyof CategoryResponse] : key

  const sortLabels: Record<SortColumn, string> = {
    title: "제목",
    date: "작성일",
  }

  // 번호는 항상 1, 2, 3... 고정 (정렬과 무관하게 현재 화면 순서)
  const getPostNumber = (index: number) => {
    const pageNum = postListData?.number ?? 0
    const size = postListData?.size ?? 10
    return pageNum * size + index + 1
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 md:hidden">
          {Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )
    }
    if (isError) {
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive md:hidden">
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
          )}
        </div>
      )
    }
    if (posts.length === 0) {
      return (
        <div className="rounded-lg border border-border/50 p-8 text-center md:hidden">
          {isEmptyFromFilter ? (
            <>
              <Search className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4" />
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </>
          ) : (
            <>
              <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4" />
              <p className="text-muted-foreground mb-2">아직 작성된 게시글이 없습니다.</p>
              <p className="text-sm text-muted-foreground/80 mb-4">첫 번째 게시글을 작성해보세요.</p>
              {onOpenCreateDialog && (
                <Button onClick={onOpenCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  글 작성
                </Button>
              )}
            </>
          )}
        </div>
      )
    }
    return (
      <div className="space-y-3 md:hidden">
        {/* 모바일 정렬 컨트롤 */}
        {onSort && (
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">정렬:</span>
            {(["title", "date"] as const).map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => onSort(col)}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                  sortColumn === col
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {sortLabels[col]}
                {sortColumn === col && (sortDirection === "asc" ? " ↑" : " ↓")}
              </button>
            ))}
          </div>
        )}
        {posts.map((post, index) => (
            <PostMobileCard
              key={post.id}
              post={post}
              postNumber={getPostNumber(index)}
              formatDate={formatDate}
              categoryLabel={getCategoryLabel(post.category)}
              onView={onView}
            />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* 모바일: 카드 레이아웃 */}
      {renderContent()}

      {/* 데스크톱: 테이블 */}
      <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border/50 [&>th:first-child]:rounded-tl-lg [&>th:last-child]:rounded-tr-lg">
                <TableHead className="w-[80px] font-semibold px-4 py-3 text-center">번호</TableHead>
                <SortableHeader
                  label="제목"
                  column="title"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={onSort}
                />
                <TableHead className="w-[100px] font-semibold px-4 py-3 text-center">카테고리</TableHead>
                <SortableHeader
                  label="작성일"
                  column="date"
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={onSort}
                  className="w-[140px] text-center [&>div]:justify-center"
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full max-w-md" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-destructive">
                    <div className="flex flex-col items-center gap-2">
                      <span>게시글을 불러오는 중 오류가 발생했습니다.</span>
                      <span className="text-sm text-muted-foreground">
                        {error instanceof Error ? error.message : "알 수 없는 오류"}
                      </span>
                      {onRetry && (
                        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          다시 시도
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      {isEmptyFromFilter ? (
                        <>
                          <Search className="h-12 w-12 text-muted-foreground/60" />
                          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                        </>
                      ) : (
                        <>
                          <FileQuestion className="h-12 w-12 text-muted-foreground/60" />
                          <p className="text-muted-foreground">아직 작성된 게시글이 없습니다.</p>
                          <p className="text-sm text-muted-foreground/80">첫 번째 게시글을 작성해보세요.</p>
                          {onOpenCreateDialog && (
                            <Button onClick={onOpenCreateDialog} className="mt-2">
                              <Plus className="mr-2 h-4 w-4" />
                              글 작성
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post, index) => (
                    <PostTableRow
                      key={post.id}
                      post={post}
                      postNumber={getPostNumber(index)}
                      formatDate={formatDate}
                      categoryLabel={getCategoryLabel(post.category)}
                      onView={onView}
                    />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
