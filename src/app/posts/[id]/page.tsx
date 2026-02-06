"use client"

/**
 * 게시글 상세 페이지 (/posts/[id])
 * 인증 필요. 로그아웃 시 queryClient.clear()로 캐시 초기화 후 / 로 이동.
 * router.replace 사용으로 뒤로가기 시 상세 페이지 재진입 방지.
 */
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Edit, Link2, Loader2, Trash2 } from "lucide-react"
import { getPost } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import { useAuthStore } from "@/lib/stores/auth-store"
import { PostDetailBody } from "@/components/posts/post-detail-body"
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants/messages"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserInfo } from "@/components/user/user-info"
import { PostDetailSkeleton } from "@/components/posts/post-detail-skeleton"
import { PostForm } from "@/components/posts/post-form"
import { PostDeleteDialog } from "@/components/posts/post-delete-dialog"
import { Button } from "@/components/ui/button"
import { usePostDialog } from "@/hooks/use-post-dialog"
import { usePostMutations } from "@/hooks/use-post-mutations"
import type { Post } from "@/types/post"

async function copyPostLink(postId: number) {
  const url = `${window.location.origin}/posts/${postId}`
  await navigator.clipboard.writeText(url)
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const idParam = params.id as string
  const postId = parseInt(idParam, 10)

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const {
    isEditDialogOpen,
    isDeleteDialogOpen,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = usePostDialog()

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled: hasHydrated && isAuthenticated && !Number.isNaN(postId) && postId > 0,
  })

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | BIGS`
      return () => {
        document.title = "게시판 | BIGS"
      }
    }
  }, [post?.title])

  const { updateMutation, deleteMutation } = usePostMutations({
    selectedPost: post ?? null,
    onSuccess: {
      onUpdate: () => {
        closeEditDialog()
      },
      onDelete: () => {
        closeDeleteDialog()
        router.replace("/posts")
      },
    },
  })

  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthenticated || !accessToken) {
      router.replace("/login")
    }
  }, [hasHydrated, isAuthenticated, accessToken, router])

  const handleCopyLink = async () => {
    if (Number.isNaN(postId) || postId <= 0) return
    try {
      await copyPostLink(postId)
      toast.success(SUCCESS_MESSAGES.LINK_COPY)
    } catch {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  if (!hasHydrated || !isAuthenticated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (Number.isNaN(postId) || postId <= 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-background via-background/95 to-accent/10 p-6">
        <p className="text-muted-foreground">잘못된 게시글 주소입니다.</p>
        <Button asChild variant="outline">
          <Link href="/posts">목록으로</Link>
        </Button>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-background via-background/95 to-accent/10 p-6">
        <p className="text-destructive">
          {error instanceof Error ? error.message : ERROR_MESSAGES.POST_FETCH_FAILED}
        </p>
        <Button asChild variant="outline">
          <Link href="/posts">목록으로</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
        <Link
          href="/posts"
          className="text-xl sm:text-2xl font-bold text-primary transition-all hover:opacity-80"
        >
          BIGS
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <UserInfo
              username={user.username}
              name={user.name}
              onLogout={() => {
                useAuthStore.getState().clearTokens()
                queryClient.clear()
                router.replace("/")
              }}
            />
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-3xl w-full">
        {isLoading ? (
          <PostDetailSkeleton />
        ) : post ? (
          <PostDetailContent
            post={post}
            onCopyLink={handleCopyLink}
            onEdit={() => openEditDialog(post)}
            onDelete={() => openDeleteDialog(post)}
          />
        ) : null}
      </main>

      {post && (
        <>
          <PostForm
            open={isEditDialogOpen}
            onOpenChange={closeEditDialog}
            mode="edit"
            post={post}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({
                id: post.id,
                data: { ...data, file: data.file ?? null },
              })
            }}
            isLoading={updateMutation.isPending}
            error={updateMutation.isError ? ERROR_MESSAGES.POST_UPDATE_FAILED : undefined}
          />
          <PostDeleteDialog
            post={post}
            open={isDeleteDialogOpen}
            onOpenChange={closeDeleteDialog}
            onDelete={async () => {
              await deleteMutation.mutateAsync(post.id)
            }}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  )
}

function PostDetailContent({
  post,
  onCopyLink,
  onEdit,
  onDelete,
}: {
  post: Post
  onCopyLink: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/posts" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>
      </Button>

      <div className="flex flex-col rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl p-4 sm:p-6 shadow-sm">
        <div className="min-h-0 flex-1">
          <PostDetailBody
            post={post}
            titleAs="h1"
            titleClassName="text-xl sm:text-3xl font-bold tracking-tight wrap-break-word"
          />
        </div>
        <div className="mt-6 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
          <Button variant="outline" asChild className="h-11 w-full sm:w-auto">
            <Link href="/posts">목록으로</Link>
          </Button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="outline"
              onClick={onCopyLink}
              className="h-11 w-full sm:w-auto"
            >
              <Link2 className="mr-2 h-4 w-4" />
              링크 복사
            </Button>
            <Button
              variant="outline"
              onClick={onEdit}
              className="h-11 w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              수정
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="h-11 w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
