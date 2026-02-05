"use client"

/**
 * 게시글 목록 페이지네이션
 * 이전/다음 버튼, 페이지 번호, 말줄임 표시
 */
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { PostListResponse } from "@/types/post"

interface PostPaginationProps {
  totalPages: number
  currentPage: number
  postListData?: PostListResponse
  onPageChange: (page: number) => void
}

export function PostPagination({
  totalPages,
  currentPage,
  postListData,
  onPageChange,
}: PostPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  /** 7페이지 이하: 전부 표시. 8페이지 이상: 첫·끝 + 현재 주변 ±1 + 말줄임. currentPage는 0-based */
  type PageItem =
    | { type: "page"; value: number }
    | { type: "ellipsis"; id: string }
  const pageItems: PageItem[] = []

  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) {
      pageItems.push({ type: "page", value: i })
    }
  } else {
    pageItems.push({ type: "page", value: 0 })
    const leftEllipsis = currentPage > 2
    const rightEllipsis = currentPage < totalPages - 3
    if (leftEllipsis) pageItems.push({ type: "ellipsis", id: "left" })
    const start = Math.max(1, currentPage - 1)      // 0, totalPages-1 제외한 범위
    const end = Math.min(totalPages - 2, currentPage + 1)
    for (let i = start; i <= end; i++) {
      pageItems.push({ type: "page", value: i })
    }
    if (rightEllipsis) pageItems.push({ type: "ellipsis", id: "right" })
    pageItems.push({ type: "page", value: totalPages - 1 })
  }

  return (
    <div className="mt-4 sm:mt-6 overflow-x-auto">
      <Pagination>
        <PaginationContent className="flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 0) onPageChange(currentPage - 1)
              }}
              className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {pageItems.map((item) =>
            item.type === "page" ? (
              <PaginationItem key={`page-${item.value}`}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(item.value)
                  }}
                  isActive={currentPage === item.value}
                  className="min-w-[40px]"
                >
                  {item.value + 1}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={`ellipsis-${item.id}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages - 1) onPageChange(currentPage + 1)
              }}
              className={
                postListData?.last ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
