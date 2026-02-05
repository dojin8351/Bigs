import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getPostList } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import type { BoardCategory, PostListItem } from "@/types/post"

export type SortColumn = "title" | "date"
export type SortDirection = "asc" | "desc"

interface UsePostListOptions {
  pageSize?: number
}

/**
 * 게시글 목록 조회 및 클라이언트 사이드 필터링 훅
 *
 * 데이터 흐름: API 전체 조회 → 카테고리 필터 → 정렬 → 페이지 분할
 * - getPostList(1000): 서버 페이지네이션 미지원 가정, 전체 데이터를 한 번에 가져와 캐싱
 * - postListData: API 응답 형식을 유지하면서 content만 현재 페이지 분으로 치환 (PostPagination last 판단용)
 */
export function usePostList(options: UsePostListOptions = {}) {
  const { pageSize = 10 } = options
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<BoardCategory | undefined>(undefined)
  const [sortColumn, setSortColumn] = useState<SortColumn>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  /** 전체 게시글 목록 조회 (초기 로드 시 한 번만, 5분간 캐시) */
  const {
    data: allPostsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: postKeys.list(),
    queryFn: () => getPostList(1000), // 큰 size로 전체 데이터 가져오기
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  })

  /** selectedCategory가 undefined면 "모두" = 전체 표시 */
  const content = allPostsData?.content
  const filteredPosts = useMemo(() => {
    if (!content) return []
    
    if (selectedCategory === undefined) {
      return content
    }
    
    return content.filter(
      (post) => post.category === selectedCategory
    )
  }, [content, selectedCategory])

  /** mult: asc=1(앞이 작으면 음수), desc=-1(앞이 크면 음수)로 정렬 방향 제어 */
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts]
    const mult = sortDirection === "asc" ? 1 : -1

    sorted.sort((a: PostListItem, b: PostListItem) => {
      switch (sortColumn) {
        case "date":
          return mult * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        case "title":
          return mult * a.title.localeCompare(b.title, "ko")
        default:
          return 0
      }
    })
    return sorted
  }, [filteredPosts, sortColumn, sortDirection])

  // 페이지네이션: 필터링+정렬된 게시글을 페이지별로 분할
  const paginatedPosts = useMemo(() => {
    const startIndex = currentPage * pageSize
    const endIndex = startIndex + pageSize
    return sortedPosts.slice(startIndex, endIndex)
  }, [sortedPosts, currentPage, pageSize])

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(sortedPosts.length / pageSize)

  // 카테고리 변경 시 첫 페이지로 이동
  const handleCategoryChange = (category: BoardCategory | undefined) => {
    setSelectedCategory(category)
    setCurrentPage(0)
  }

  /** 같은 컬럼 클릭: asc↔desc 토글. 다른 컬럼: 제목=asc, 날짜=desc 기본값. 정렬 변경 시 1페이지로 */
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(column)
      setSortDirection(column === "title" ? "asc" : "desc")
    }
    setCurrentPage(0)
  }

  return {
    // 데이터
    postListData: allPostsData
      ? {
          ...allPostsData,
          content: paginatedPosts,
          totalElements: sortedPosts.length,
          totalPages,
          number: currentPage,
          size: pageSize,
          numberOfElements: paginatedPosts.length,
          first: currentPage === 0,
          last: currentPage >= totalPages - 1,
        }
      : undefined,
    currentPosts: paginatedPosts,
    allPosts: sortedPosts, // 필터링+정렬된 전체 게시글 (페이지네이션 전)
    totalPages,
    currentPage,
    selectedCategory,
    pageSize,
    // 상태
    isLoading,
    isError,
    error,
    // 액션
    setCurrentPage,
    handleCategoryChange,
    handleSort,
    sortColumn,
    sortDirection,
    refetch,
  }
}
