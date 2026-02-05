/**
 * 게시글 관련 타입 정의
 *
 * API 응답 구조, 폼 데이터, React Query 캐시 등에서 사용
 */

/** 게시판 카테고리 키 (API 응답의 boardCategory 필드) */
export type BoardCategory = "NOTICE" | "FREE" | "QNA" | "ETC" | string

/**
 * 카테고리 조회 API 응답
 * key: 카테고리 코드, value: 표시용 라벨
 */
export interface CategoryResponse {
  NOTICE: string
  FREE: string
  QNA: string
  ETC: string
}

/**
 * 게시글 목록의 개별 항목
 * 목록 API는 id, title, category, createdAt만 반환 (content, imageUrl 없음)
 */
export interface PostListItem {
  id: number
  title: string
  category: BoardCategory
  createdAt: string
}

/**
 * 게시글 상세 조회 응답
 * 목록 항목 + content, imageUrl, author, updatedAt
 */
export interface Post {
  id: number
  title: string
  content: string
  boardCategory: BoardCategory
  imageUrl: string | null
  createdAt: string
  author?: {
    username: string
    name: string
  }
  updatedAt?: string
}

/** Spring Data Pageable 스펙 (API 페이지네이션 메타데이터) */
export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: {
    unsorted: boolean
    sorted: boolean
    empty: boolean
  }
  offset: number
  unpaged: boolean
  paged: boolean
}

/**
 * 게시글 목록 조회 API 응답
 * content: 게시글 배열, pageable/totalPages 등 메타데이터
 */
export interface PostListResponse {
  content: PostListItem[]
  pageable: Pageable
  totalPages: number
  totalElements: number
  last: boolean
  numberOfElements: number
  size: number
  number: number
  sort: {
    unsorted: boolean
    sorted: boolean
    empty: boolean
  }
  first: boolean
  empty: boolean
}

/** 게시글 등록 요청 (FormData로 전송, file은 선택) */
export interface CreatePostRequest {
  title: string
  content: string
  category: BoardCategory
  file?: File | null
}

/** 게시글 수정 요청 (기존 이미지 유지 시 file 생략) */
export interface UpdatePostRequest {
  title: string
  content: string
  category: BoardCategory
  file?: File | null
}

/** 게시글 상세/등록/수정 API 응답 (Post와 동일) */
export type GetPostResponse = Post
