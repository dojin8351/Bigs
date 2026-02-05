"use client"

/**
 * 게시글 목록 메인 컴포넌트
 *
 * usePostList, usePostCategories, usePostDialog, usePostMutations, usePostDetail, usePostActions 통합.
 * - 카테고리 사이드바 + 테이블/카드 + 페이지네이션
 * - 생성/수정/상세/삭제 다이얼로그. mutation 성공 시 onSuccess로 다이얼로그 자동 닫기
 * - 상세: postDetail API 데이터 사용. 로딩 중이면 selectedPost(목록 데이터)로 먼저 표시
 */
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { PostForm } from "@/components/posts/post-form"
import { PostDetail } from "@/components/posts/post-detail"
import { PostDeleteDialog } from "@/components/posts/post-delete-dialog"
import { PostCategorySidebar } from "@/components/posts/post-category-sidebar"
import { PostListHeader } from "@/components/posts/post-list-header"
import { PostListActiveFilters } from "@/components/posts/post-list-active-filters"
import { PostTable } from "@/components/posts/post-table"
import { PostPagination } from "@/components/posts/post-pagination"
import { usePostCategories } from "@/hooks/use-post-categories"
import { usePostList } from "@/hooks/use-post-list"
import { usePostMutations } from "@/hooks/use-post-mutations"
import { usePostDetail } from "@/hooks/use-post-detail"
import { usePostDialog } from "@/hooks/use-post-dialog"
import { usePostActions } from "@/hooks/use-post-actions"
import { ERROR_MESSAGES } from "@/lib/constants/messages"
import type { PostListItem } from "@/types/post"

export function PostList() {
  // 훅 사용
  const { data: categories } = usePostCategories()
  const {
    postListData,
    currentPosts,
    totalPages,
    currentPage,
    selectedCategory,
    pageSize,
    isLoading,
    isError,
    error,
    setCurrentPage,
    handleCategoryChange,
    handleSort,
    handleSearchChange,
    searchQuery,
    isEmptyFromFilter,
    sortColumn,
    sortDirection,
    refetch,
  } = usePostList({ pageSize: 10 })

  const {
    isCreateDialogOpen,
    isEditDialogOpen,
    isDetailDialogOpen,
    isDeleteDialogOpen,
    selectedPost,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    openDetailDialog,
    closeDetailDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = usePostDialog()

  /** mutation 성공 시 해당 다이얼로그 자동 닫기 */
  const { createMutation, updateMutation, deleteMutation } = usePostMutations({
    selectedPost,
    onSuccess: {
      onCreate: closeCreateDialog,
      onUpdate: closeEditDialog,
      onDelete: closeDeleteDialog,
    },
  })

  /** 상세 다이얼로그 열려 있을 때만 API 호출. postDetail 로딩 완료 전엔 selectedPost(목록 데이터) 사용 */
  const { data: postDetail, isLoading: isPostDetailLoading } = usePostDetail({
    post: selectedPost,
    enabled: isDetailDialogOpen,
  })

  const { handleViewPost, handleEditPost, formatDate } = usePostActions()

  /** 목록 클릭 시 PostListItem → Post 변환 후 다이얼로그 오픈 */
  const onViewPost = async (post: PostListItem) => {
    const fullPost = await handleViewPost(post)
    openDetailDialog(fullPost)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* 사이드바 - 카테고리 필터 */}
      <PostCategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 space-y-6">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5 dark:bg-card dark:shadow-lg dark:shadow-black/10 overflow-hidden">
          <PostListHeader
            onOpenCreateDialog={openCreateDialog}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          <PostListActiveFilters
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            categories={categories}
            totalCount={postListData?.totalElements ?? 0}
            onClearCategory={() => handleCategoryChange(undefined)}
            onClearSearch={() => handleSearchChange("")}
          />
          <CardContent className="p-4 sm:p-6">
            <PostTable
              isLoading={isLoading}
              isError={isError}
              error={error}
              posts={currentPosts}
              postListData={postListData}
              pageSize={pageSize}
              formatDate={formatDate}
              onView={onViewPost}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onRetry={() => refetch()}
              onOpenCreateDialog={openCreateDialog}
              categories={categories}
              isEmptyFromFilter={isEmptyFromFilter}
            />
            <PostPagination
              totalPages={totalPages}
              currentPage={currentPage}
              postListData={postListData}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>

      {/* 글 작성 다이얼로그 */}
      <PostForm
        open={isCreateDialogOpen}
        onOpenChange={closeCreateDialog}
        mode="create"
        onSubmit={async (data) => {
          await createMutation.mutateAsync({
            ...data,
            // file은 data에 이미 포함되어 있으므로 그대로 전달
          })
        }}
        isLoading={createMutation.isPending}
        error={createMutation.isError ? ERROR_MESSAGES.POST_CREATE_FAILED : undefined}
      />

      {/* 글 수정 다이얼로그 */}
      {selectedPost && (
        <PostForm
          open={isEditDialogOpen}
          onOpenChange={closeEditDialog}
          mode="edit"
          post={selectedPost}
          onSubmit={async (data) => {
            await updateMutation.mutateAsync({
              id: selectedPost.id,
              data: {
                ...data,
                // file은 data에 이미 포함되어 있으므로 그대로 전달 (새 파일이 선택되지 않으면 null)
              },
            })
          }}
          isLoading={updateMutation.isPending}
          error={updateMutation.isError ? ERROR_MESSAGES.POST_UPDATE_FAILED : undefined}
        />
      )}

      {/* postDetail: API 상세 데이터(content, imageUrl 포함). 로딩 중이면 selectedPost(목록 데이터)로 먼저 표시 */}
      {selectedPost && (
        <PostDetail
          post={postDetail || selectedPost}
          open={isDetailDialogOpen}
          isLoading={isPostDetailLoading}
          onOpenChange={(open) => {
            if (!open) closeDetailDialog()
          }}
          onEdit={async () => {
            closeDetailDialog()
            const fullPost = await handleEditPost({
              id: selectedPost.id,
              title: selectedPost.title,
              category: selectedPost.boardCategory,
              createdAt: selectedPost.createdAt,
            })
            openEditDialog(fullPost)
          }}
          onDelete={() => {
            closeDetailDialog()
            openDeleteDialog(selectedPost)
          }}
        />
      )}

      {/* 삭제 확인 다이얼로그 */}
      {selectedPost && (
        <PostDeleteDialog
          post={selectedPost}
          open={isDeleteDialogOpen}
          onOpenChange={closeDeleteDialog}
          onDelete={async () => {
            await deleteMutation.mutateAsync(selectedPost.id)
          }}
          isLoading={deleteMutation.isPending}
        />
      )}
      </div>
    </div>
  )
}
