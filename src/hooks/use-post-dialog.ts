import { useState } from "react"
import type { Post } from "@/types/post"

/**
 * 게시글 CRUD 다이얼로그 상태 관리 훅
 *
 * 생성/수정/상세/삭제 4종 다이얼로그의 열림 상태와 선택된 게시글을 관리합니다.
 * - selectedPost: 수정·상세·삭제 시 대상 게시글. 생성(create)은 선택 없음.
 * - 동시에 하나의 다이얼로그만 열린다고 가정 (상세→수정 전환 시 closeDetail 후 openEdit 호출)
 */
export function usePostDialog() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const openCreateDialog = () => setIsCreateDialogOpen(true)
  const closeCreateDialog = () => setIsCreateDialogOpen(false)

  /** 수정/상세/삭제 시 post를 selectedPost에 저장한 뒤 해당 다이얼로그 오픈 */
  const openEditDialog = (post: Post) => {
    setSelectedPost(post)
    setIsEditDialogOpen(true)
  }
  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setSelectedPost(null)
  }

  const openDetailDialog = (post: Post) => {
    setSelectedPost(post)
    setIsDetailDialogOpen(true)
  }
  const closeDetailDialog = () => {
    setIsDetailDialogOpen(false)
    setSelectedPost(null)
  }

  const openDeleteDialog = (post: Post) => {
    setSelectedPost(post)
    setIsDeleteDialogOpen(true)
  }
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setSelectedPost(null)
  }

  return {
    // 상태
    isCreateDialogOpen,
    isEditDialogOpen,
    isDetailDialogOpen,
    isDeleteDialogOpen,
    selectedPost,
    // 액션
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDetailDialog,
    closeDetailDialog,
    openDeleteDialog,
    closeDeleteDialog,
    setSelectedPost,
  }
}
