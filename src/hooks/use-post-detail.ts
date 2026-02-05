import { useQuery } from "@tanstack/react-query"
import { getPost } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import type { Post } from "@/types/post"

interface UsePostDetailOptions {
  /** 목록에서 선택한 게시글 (다이얼로그에 전달된 Post) */
  post: Post | null
  /** 쿼리 실행 여부. 다이얼로그가 열려 있을 때만 true로 설정하여 불필요한 요청 방지 */
  enabled?: boolean
}

/**
 * 게시글 상세 조회 훅
 *
 * - post가 있고 enabled가 true일 때만 getPost API 호출
 * - post가 null일 때 enabled: false로 불필요한 API 호출 방지
 * - 상세 다이얼로그가 닫혀 있으면 enabled=false로 API 호출 생략
 */
export function usePostDetail(options: UsePostDetailOptions) {
  const { post, enabled = true } = options

  return useQuery({
    queryKey: post ? postKeys.detail(post.id) : ["posts", "detail"],
    queryFn: () => getPost(post!.id),
    enabled: !!post && enabled,
  })
}
