/**
 * 게시글 관련 React Query 쿼리 키 관리
 */

export const postKeys = {
  // 게시글 목록 조회 (전체 데이터 캐싱용)
  lists: () => ["posts", "list"] as const,
  list: () => ["posts", "list", "all"] as const,

  // 게시글 상세 조회
  details: () => ["posts", "detail"] as const,
  detail: (id: number) => ["posts", "detail", id] as const,

  // 카테고리 조회
  categories: () => ["posts", "categories"] as const,
} as const
