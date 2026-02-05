/**
 * 게시글 관련 API 모듈
 *
 * - getCategories: 카테고리 목록 (NOTICE, FREE, QNA, ETC)
 * - getPostList: 게시글 목록 (page, size 파라미터)
 * - getPost: 게시글 상세 (id)
 * - createPost: 게시글 등록 (FormData: request JSON + file)
 * - updatePost: 게시글 수정 (FormData)
 * - deletePost: 게시글 삭제
 *
 * apiClient 사용 (JWT 자동 첨부, 401 시 자동 refresh)
 */
import { apiClient } from "@/lib/api/client"
import { devLog } from "@/lib/utils/logger"
import type {
  GetPostResponse,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  CategoryResponse,
} from "@/types/post"

/**
 * 카테고리 조회 API
 * @returns 카테고리 목록
 */
export const getCategories = async (): Promise<CategoryResponse> => {
  devLog.log("[API] 카테고리 조회 요청:", "/boards/categories")
  try {
    const response = await apiClient.get<CategoryResponse>("/boards/categories")
    devLog.log("[API] 카테고리 조회 성공")
    return response.data
  } catch (error) {
    devLog.error("[API] 카테고리 조회 실패:", error)
    throw error
  }
}

/**
 * 게시글 목록 조회 API (전체 데이터)
 * @param size 한번에 조회할 크기 (기본값: 1000, 전체 데이터를 가져오기 위해 큰 값 사용)
 * @returns 게시글 목록 및 페이지네이션 정보
 */
export const getPostList = async (
  size: number = 1000
): Promise<PostListResponse> => {
  devLog.log("[API] 게시글 목록 조회 요청:", { size })
  try {
    const params: { page: number; size: number } = {
      page: 0,
      size,
    }
    const response = await apiClient.get<PostListResponse>("/boards", {
      params,
    })
    devLog.log("[API] 게시글 목록 조회 성공:", { count: response.data.content.length })
    return response.data
  } catch (error) {
    devLog.error("[API] 게시글 목록 조회 실패:", error)
    throw error
  }
}

/**
 * 게시글 조회 API
 * @param id 게시글 ID
 * @returns 게시글 정보
 */
export const getPost = async (id: number): Promise<GetPostResponse> => {
  devLog.log("[API] 게시글 조회 요청:", { id })
  try {
    const response = await apiClient.get<GetPostResponse>(`/boards/${id}`)
    devLog.log("[API] 게시글 조회 성공:", { id: response.data.id })
    return response.data
  } catch (error) {
    devLog.error("[API] 게시글 조회 실패:", error)
    throw error
  }
}

/**
 * 게시글 등록 API
 * @param data 게시글 등록 데이터
 * @returns 등록된 게시글 정보
 */
export const createPost = async (
  data: CreatePostRequest
): Promise<GetPostResponse> => {
  devLog.log("[API] 게시글 등록 요청")

  try {
    const formData = new FormData()
    const requestData = {
      title: data.title,
      content: data.content,
      category: data.category,
    }
    const jsonBlob = new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    })
    formData.append("request", jsonBlob)

    if (data.file) {
      formData.append("file", data.file)
    }

    // FormData를 보낼 때는 Content-Type을 설정하지 않음
    // request interceptor에서 자동으로 처리됨
    const response = await apiClient.post<GetPostResponse>("/boards", formData)
    devLog.log("[API] 게시글 등록 성공:", { id: response.data.id })
    return response.data
  } catch (error) {
    devLog.error("[API] 게시글 등록 실패:", error)
    throw error
  }
}

/**
 * 게시글 수정 API
 * @param id 게시글 ID
 * @param data 게시글 수정 데이터
 * @returns 수정된 게시글 정보
 */
export const updatePost = async (
  id: number,
  data: UpdatePostRequest
): Promise<GetPostResponse> => {
  devLog.log("[API] 게시글 수정 요청:", { id })

  try {
    const formData = new FormData()
    const requestData = {
      title: data.title,
      content: data.content,
      category: data.category,
    }
    const jsonBlob = new Blob([JSON.stringify(requestData)], {
      type: "application/json",
    })
    formData.append("request", jsonBlob)

    if (data.file) {
      formData.append("file", data.file)
    }

    const response = await apiClient.patch<GetPostResponse>(`/boards/${id}`, formData)
    devLog.log("[API] 게시글 수정 성공:", { id: response.data.id })
    return response.data
  } catch (error) {
    devLog.error("[API] 게시글 수정 실패:", error)
    throw error
  }
}

/**
 * 게시글 삭제 API
 * @param id 게시글 ID
 */
export const deletePost = async (id: number): Promise<void> => {
  devLog.log("[API] 게시글 삭제 요청:", { id })
  try {
    await apiClient.delete(`/boards/${id}`)
    devLog.log("[API] 게시글 삭제 성공")
  } catch (error) {
    devLog.error("[API] 게시글 삭제 실패:", error)
    throw error
  }
}
