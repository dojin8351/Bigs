"use client"

/**
 * 게시글 삭제 확인 다이얼로그
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types/post"
import { devLog } from "@/lib/utils/logger"

interface PostDeleteDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => Promise<void>
  isLoading?: boolean
}

export function PostDeleteDialog({
  post,
  open,
  onOpenChange,
  onDelete,
  isLoading = false,
}: PostDeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onDelete()
    } catch (error) {
      devLog.error("게시글 삭제 실패:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-gray-200/80 dark:border-border/50 bg-white dark:bg-card/95 backdrop-blur-xl shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-primary/5 w-[calc(100vw-2rem)] max-w-[min(28rem,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto p-4 sm:p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">게시글 삭제</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground/80">
            정말로 이 게시글을 삭제하시겠습니까?
            <br />
            <span className="font-medium text-foreground mt-2 block">
              &quot;{post.title}&quot;
            </span>
            <br />
            이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="h-11 w-full sm:w-auto text-base font-medium shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 transition-all duration-300"
          >
            {isLoading ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
