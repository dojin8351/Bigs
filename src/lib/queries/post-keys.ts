/**
 * 게시글 관련 React Query 쿼리 키 팩토리
 *
 * 캐시 무효화 및 쿼리 구분을 위한 키를 일관되게 관리합니다.
 * - lists/list: 목록 캐시 (invalidateQueries 등에서 사용)
 * - details/detail(id): 상세 캐시
 * - categories: 카테고리 목록 캐시
 */
export const postKeys = {
  /** 목록 계열 쿼리 공통 prefix (invalidate용) */
  lists: () => ["posts", "list"] as const,
  /** 게시글 목록 전체 조회 쿼리 키 */
  list: () => ["posts", "list", "all"] as const,

  /** 상세 계열 쿼리 공통 prefix (invalidate용) */
  details: () => ["posts", "detail"] as const,
  /** 게시글 상세 조회 쿼리 키 (id 기준) */
  detail: (id: number) => ["posts", "detail", id] as const,

  /** 카테고리 목록 조회 쿼리 키 */
  categories: () => ["posts", "categories"] as const,
} as const
