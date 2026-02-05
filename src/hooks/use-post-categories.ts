import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"

/**
 * 게시글 카테고리 조회 훅
 *
 * React Query로 카테고리 목록을 캐싱합니다.
 * postKeys.categories()를 쿼리 키로 사용하여 캐시 무효화 시 일괄 처리 가능합니다.
 */
export function usePostCategories() {
  return useQuery({
    queryKey: postKeys.categories(),
    queryFn: getCategories,
  })
}
