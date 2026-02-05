import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPost, updatePost, deletePost } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import { SUCCESS_MESSAGES } from "@/lib/constants/messages"
import type { CreatePostRequest, UpdatePostRequest, Post } from "@/types/post"

interface UsePostMutationsOptions {
  selectedPost?: Post | null
  onSuccess?: {
    onCreate?: () => void
    onUpdate?: () => void
    onDelete?: () => void
  }
}

/**
 * 게시글 등록/수정/삭제 mutation 훅
 *
 * - selectedPost: 수정/삭제 시 상세 캐시(postKeys.detail) 무효화에 사용. 목록 캐시는 항상 무효화.
 * - onSuccess 콜백: 부모에서 다이얼로그 닫기(closeCreateDialog 등)를 넣어 성공 시 자동 닫힘
 */
export function usePostMutations(options: UsePostMutationsOptions = {}) {
  const { selectedPost, onSuccess } = options
  const queryClient = useQueryClient()

  /** 등록 성공 시 목록 캐시만 무효화 (상세 캐시 없음) */
  const createMutation = useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() })
      toast.success(SUCCESS_MESSAGES.POST_CREATE)
      onSuccess?.onCreate?.()
    },
  })

  /** 수정 성공 시 목록 + 선택된 게시글 상세 캐시 무효화 */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() })
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(selectedPost.id) })
      }
      toast.success(SUCCESS_MESSAGES.POST_UPDATE)
      onSuccess?.onUpdate?.()
    },
  })

  /** 삭제 성공 시 목록 + 선택된 게시글 상세 캐시 무효화 */
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() })
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(selectedPost.id) })
      }
      toast.success(SUCCESS_MESSAGES.POST_DELETE)
      onSuccess?.onDelete?.()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
