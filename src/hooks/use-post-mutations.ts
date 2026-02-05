import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createPost, updatePost, deletePost } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants/messages"
import type { CreatePostRequest, UpdatePostRequest, Post, PostListResponse } from "@/types/post"

interface UsePostMutationsOptions {
  /** 수정/삭제 대상 게시글. 상세 캐시(postKeys.detail) 무효화 시 사용 */
  selectedPost?: Post | null
  /** mutation 성공 시 실행할 콜백. 다이얼로그 닫기(closeCreateDialog 등)를 전달 */
  onSuccess?: {
    onCreate?: () => void
    onUpdate?: () => void
    onDelete?: () => void
  }
}

/**
 * 게시글 등록/수정/삭제 mutation 훅
 *
 * - createMutation: 등록 성공 시 목록 캐시 무효화, toast, onSuccess 호출
 * - updateMutation / deleteMutation: 낙관적 업데이트(onMutate) 적용, 실패 시 롤백(onError)
 * - selectedPost: 수정/삭제 시 해당 상세 캐시 무효화. 목록 캐시는 onSettled에서 항상 무효화
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
    onError: () => {
      toast.error(ERROR_MESSAGES.POST_CREATE_FAILED)
    },
  })

  /** 수정: 낙관적 업데이트. 실패 시 롤백 */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      updatePost(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.list() })
      const prev = queryClient.getQueryData<PostListResponse>(postKeys.list())
      if (prev?.content) {
        queryClient.setQueryData<PostListResponse>(postKeys.list(), {
          ...prev,
          content: prev.content.map((p) =>
            p.id === id
              ? { ...p, title: data.title, category: data.category }
              : p
          ),
        })
      }
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(postKeys.list(), context.prev)
      }
      toast.error(ERROR_MESSAGES.POST_UPDATE_FAILED)
    },
    onSuccess: () => {
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(selectedPost.id) })
      }
      toast.success(SUCCESS_MESSAGES.POST_UPDATE)
      onSuccess?.onUpdate?.()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() })
    },
  })

  /** 삭제: 낙관적 업데이트. 실패 시 롤백 */
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postKeys.list() })
      const prev = queryClient.getQueryData<PostListResponse>(postKeys.list())
      if (prev?.content) {
        queryClient.setQueryData<PostListResponse>(postKeys.list(), {
          ...prev,
          content: prev.content.filter((p) => p.id !== id),
          totalElements: prev.totalElements - 1,
        })
      }
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(postKeys.list(), context.prev)
      }
      toast.error(ERROR_MESSAGES.POST_DELETE_FAILED)
    },
    onSuccess: () => {
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(selectedPost.id) })
      }
      toast.success(SUCCESS_MESSAGES.POST_DELETE)
      onSuccess?.onDelete?.()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.list() })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
