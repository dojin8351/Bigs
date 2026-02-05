// 게시글 타입 정의 (API 연동 시 사용)

export type BoardCategory = "NOTICE" | "FREE" | "QNA" | "ETC" | string

// 카테고리 조회 응답
export interface CategoryResponse {
  NOTICE: string
  FREE: string
  QNA: string
  ETC: string
}

// 게시글 목록 조회 응답의 개별 게시글 (간략 정보)
export interface PostListItem {
  id: number
  title: string
  category: BoardCategory
  createdAt: string
}

// 게시글 상세 조회 응답
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

// 페이지네이션 정보
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

// 게시글 목록 조회 응답
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

export interface CreatePostRequest {
  title: string
  content: string
  category: BoardCategory
  file?: File | null
}

export interface UpdatePostRequest {
  title: string
  content: string
  category: BoardCategory
  file?: File | null
}

// 게시글 상세 조회 응답 (GetPostResponse는 Post와 동일)
export type GetPostResponse = Post
