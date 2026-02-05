"use client"

/**
 * 게시글 상세 보기 다이얼로그
 *
 * - PostDetailBody로 제목/메타/이미지/본문 공통 렌더
 * - flex 레이아웃: 본문은 flex-1 overflow-y-auto, 푸터는 shrink-0 (이미지·버튼 겹침 방지)
 * - isLoading 시 PostDetailSkeleton 표시
 * - 푸터: 닫기, 링크 복사, 수정, 삭제
 */
import { Edit, Link2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types/post"
import { SUCCESS_MESSAGES } from "@/lib/constants/messages"
import { PostDetailSkeleton } from "./post-detail-skeleton"
import { PostDetailBody } from "./post-detail-body"

interface PostDetailProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
  isLoading?: boolean
}

export function PostDetail({
  post,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  isLoading = false,
}: PostDetailProps) {
  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/posts/${post.id}`
      await navigator.clipboard.writeText(url)
      toast.success(SUCCESS_MESSAGES.LINK_COPY)
    } catch {
      toast.error("링크 복사에 실패했습니다.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col border border-gray-200/80 dark:border-border/50 bg-white dark:bg-card/95 backdrop-blur-xl shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-primary/5 w-[calc(100vw-2rem)] max-w-3xl p-4 sm:p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {isLoading ? (
          <>
            <DialogTitle className="sr-only">게시글 로딩 중</DialogTitle>
            <PostDetailSkeleton />
          </>
        ) : (
        <>
        <DialogHeader className="sr-only">
          <DialogTitle>{post.title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <PostDetailBody
            post={post}
            titleAs="h2"
            titleClassName="text-xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent wrap-break-word"
          />
        </div>

        <DialogFooter className="mt-6 shrink-0 gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full sm:w-auto"
          >
            닫기
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="h-11 w-full sm:w-auto"
          >
            <Link2 className="mr-2 h-4 w-4" />
            링크 복사
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              onEdit()
            }}
            className="h-11 w-full sm:w-auto"
          >
            <Edit className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false)
              onDelete()
            }}
            className="h-11 w-full sm:w-auto text-base font-medium shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 transition-all duration-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  )
}
