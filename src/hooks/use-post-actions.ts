import { getPost } from "@/api/post"
import type { Post, PostListItem } from "@/types/post"
import { devLog } from "@/lib/utils/logger"

/**
 * 게시글 액션 핸들러 훅
 *
 * - handleViewPost: 목록의 PostListItem → Post 변환만. 실제 상세 fetch는 usePostDetail에서.
 * - handleEditPost: 수정 폼에 content, imageUrl 등 필요하므로 getPost API 호출. 실패 시 목록 데이터로 대체.
 * - handleDeletePost: 삭제 다이얼로그는 제목만 필요하므로 변환만.
 */
export function usePostActions() {
  /** 목록 타입(PostListItem)을 상세/다이얼로그용 Post 타입으로 변환 (content, imageUrl 없음) */
  const convertListItemToPost = (post: PostListItem): Post => {
    return {
      id: post.id,
      title: post.title,
      content: "",
      boardCategory: post.category,
      imageUrl: null,
      createdAt: post.createdAt,
    }
  }

  const handleViewPost = async (post: PostListItem): Promise<Post> => {
    return convertListItemToPost(post)
  }

  const handleEditPost = async (post: PostListItem): Promise<Post> => {
    try {
      return await getPost(post.id)
    } catch (error) {
      devLog.error("게시글 상세 조회 실패:", error)
      return convertListItemToPost(post)
    }
  }

  const handleDeletePost = (post: PostListItem): Post => {
    return convertListItemToPost(post)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return {
    handleViewPost,
    handleEditPost,
    handleDeletePost,
    formatDate,
  }
}
