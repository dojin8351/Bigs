import { useQuery } from "@tanstack/react-query"
import { getPost } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import type { Post } from "@/types/post"

interface UsePostDetailOptions {
  post: Post | null
  enabled?: boolean
}

/**
 * 게시글 상세 조회 훅
 *
 * - enabled: 상세 다이얼로그가 열렸을 때만(enabled=true) API 호출. 닫혀 있으면 호출 안 함.
 * - post: 목록에서 클릭한 게시글. 상세 API는 전체 content, imageUrl 등을 반환.
 */
export function usePostDetail(options: UsePostDetailOptions) {
  const { post, enabled = true } = options

  return useQuery({
    queryKey: post ? postKeys.detail(post.id) : ["posts", "detail", null],
    queryFn: () => getPost(post!.id),
    enabled: !!post && enabled,
  })
}
