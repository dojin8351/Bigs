import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"

/**
 * 게시글 카테고리 조회 훅
 * React Query로 카테고리 API 캐싱
 */
export function usePostCategories() {
  return useQuery({
    queryKey: postKeys.categories(),
    queryFn: getCategories,
  })
}
