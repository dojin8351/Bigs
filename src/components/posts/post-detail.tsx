"use client"

/**
 * 게시글 상세 보기 다이얼로그
 * 제목, 작성자, 날짜, 내용, 첨부 이미지 표시 및 수정/삭제 버튼 제공
 */
import { Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Post } from "@/types/post"
import { getImageUrl } from "@/lib/constants/api"

interface PostDetailProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function PostDetail({
  post,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: PostDetailProps) {
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

  const isUpdated = post.createdAt !== post.updatedAt
  const imageUrl = getImageUrl(post.imageUrl)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-gray-200/80 dark:border-border/50 bg-white dark:bg-card/95 backdrop-blur-xl shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-primary/5 w-[calc(100vw-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent wrap-break-word">
                {post.title}
              </DialogTitle>
              {/* DialogDescription은 <p> 태그이므로 div를 사용할 수 없음. 별도 div로 변경 */}
              <div className="text-sm sm:text-base text-muted-foreground/80 mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                  {post.author && (
                    <>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {post.author.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {post.author.username}
                        </span>
                      </div>
                      <Separator orientation="vertical" className="h-6 hidden sm:block" />
                    </>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm">작성일</span>
                    <span className="text-sm font-medium">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  {isUpdated && post.updatedAt && (
                    <>
                      <Separator orientation="vertical" className="h-6 hidden sm:block" />
                      <div className="flex flex-col">
                        <span className="text-sm">수정일</span>
                        <span className="text-sm font-medium">
                          {formatDate(post.updatedAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-4">
          {/* 이미지가 있는 경우 표시 */}
          {imageUrl && (
            <div className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- 외부 API 이미지 URL */}
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-auto rounded-lg border border-gray-200/80 dark:border-border/50 object-contain max-h-[200px] sm:max-h-[300px] md:max-h-[400px]"
                onError={(e) => {
                  // 이미지 로드 실패 시 에러 메시지 표시
                  const img = e.currentTarget
                  img.style.display = "none"
                  const parent = img.parentElement
                  if (parent && !parent.querySelector(".image-error")) {
                    const errorDiv = document.createElement("div")
                    errorDiv.className = "image-error text-sm text-muted-foreground p-4 border border-border/50 rounded-lg bg-muted/50"
                    errorDiv.textContent = `이미지를 불러올 수 없습니다. (URL: ${imageUrl})`
                    parent.appendChild(errorDiv)
                  }
                }}
              />
            </div>
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-4 mt-6 flex-col-reverse sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full sm:w-auto"
          >
            닫기
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
      </DialogContent>
    </Dialog>
  )
}
