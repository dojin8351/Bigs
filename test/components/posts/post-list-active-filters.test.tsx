import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { PostListActiveFilters } from "@/components/posts/post-list-active-filters"
import type { BoardCategory, CategoryResponse } from "@/types/post"

const mockCategories: CategoryResponse = {
  NOTICE: "공지",
  FREE: "자유",
  QNA: "Q&A",
  ETC: "기타",
}

describe("PostListActiveFilters", () => {
  it("필터가 없을 때 정렬 정보와 총 건수를 표시한다", () => {
    render(
      <PostListActiveFilters
        searchQuery=""
        sortColumn="date"
        sortDirection="desc"
        totalCount={42}
        onClearCategory={vi.fn()}
        onClearSearch={vi.fn()}
      />
    )

    expect(screen.getByText(/작성일 내림차순/)).toBeInTheDocument()
    expect(screen.getByText("총 42건")).toBeInTheDocument()
    expect(screen.getByText(/헤더를 클릭하면 정렬을 변경할 수 있습니다/)).toBeInTheDocument()
  })

  it("카테고리 필터가 적용되면 칩으로 표시한다", () => {
    render(
      <PostListActiveFilters
        selectedCategory={"FREE" as BoardCategory}
        searchQuery=""
        sortColumn="date"
        sortDirection="desc"
        categories={mockCategories}
        totalCount={10}
        onClearCategory={vi.fn()}
        onClearSearch={vi.fn()}
      />
    )

    expect(screen.getByText(/카테고리: 자유/)).toBeInTheDocument()
  })

  it("검색어 필터가 적용되면 칩으로 표시한다", () => {
    render(
      <PostListActiveFilters
        searchQuery="  검색어  "
        sortColumn="title"
        sortDirection="asc"
        totalCount={5}
        onClearCategory={vi.fn()}
        onClearSearch={vi.fn()}
      />
    )

    expect(screen.getByText(/"검색어"/)).toBeInTheDocument()
  })

  it("카테고리 칩 X 클릭 시 onClearCategory가 호출된다", () => {
    const onClearCategory = vi.fn()

    render(
      <PostListActiveFilters
        selectedCategory={"FREE" as BoardCategory}
        searchQuery=""
        sortColumn="date"
        sortDirection="desc"
        categories={mockCategories}
        totalCount={10}
        onClearCategory={onClearCategory}
        onClearSearch={vi.fn()}
      />
    )

    const chip = screen.getByText(/카테고리: 자유/)
    const clearButton = chip.parentElement?.querySelector('button[aria-label*="필터 제거"]')
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton!)
    expect(onClearCategory).toHaveBeenCalledTimes(1)
  })

  it("검색어 칩 X 클릭 시 onClearSearch가 호출된다", () => {
    const onClearSearch = vi.fn()

    render(
      <PostListActiveFilters
        searchQuery="검색어"
        sortColumn="title"
        sortDirection="asc"
        totalCount={5}
        onClearCategory={vi.fn()}
        onClearSearch={onClearSearch}
      />
    )

    const chip = screen.getByText(/"검색어"/)
    const clearButton = chip.parentElement?.querySelector('button[aria-label*="필터 제거"]')
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton!)
    expect(onClearSearch).toHaveBeenCalledTimes(1)
  })

  it("제목 오름차순일 때 라벨을 올바르게 표시한다", () => {
    render(
      <PostListActiveFilters
        searchQuery=""
        sortColumn="title"
        sortDirection="asc"
        totalCount={10}
        onClearCategory={vi.fn()}
        onClearSearch={vi.fn()}
      />
    )

    expect(screen.getByText(/제목 오름차순/)).toBeInTheDocument()
  })
})
