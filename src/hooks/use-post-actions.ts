import { getPost } from "@/api/post"
import type { Post, PostListItem } from "@/types/post"
import { devLog } from "@/lib/utils/logger"

/**
 * 게시글 액션 핸들러 훅
 *
 * 목록(PostListItem)을 클릭했을 때 상세/수정/삭제 다이얼로그에 전달할 Post 객체를 생성합니다.
 * - handleViewPost: 변환만 수행. 실제 상세 fetch는 usePostDetail에서 수행.
 * - handleEditPost: 수정 폼에 content, imageUrl 등이 필요하므로 getPost API 호출. 실패 시 목록 데이터로 대체.
 * - handleDeletePost: 삭제 확인 다이얼로그는 제목만 필요하므로 변환만 수행.
 */
export function usePostActions() {
  /** PostListItem을 Post 형태로 변환 (content, imageUrl은 빈 값. 상세 API에서 채움) */
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

  /** ISO 날짜 문자열을 한국어 형식(예: 2024년 1월 15일 오후 3:30)으로 포맷 */
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
