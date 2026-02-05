"use client"

/**
 * 게시글 상세 본문 (제목, 작성자, 날짜, 이미지, 내용)
 * PostDetail 다이얼로그와 /posts/[id] 페이지에서 공통 사용
 */
import { Separator } from "@/components/ui/separator"
import { getImageUrl } from "@/lib/constants/api"
import { PostImage } from "./post-image"
import type { Post } from "@/types/post"

interface PostDetailBodyProps {
  post: Post
  /** 제목을 감싸는 wrapper (DialogTitle 또는 h1 등) */
  titleAs: React.ElementType
  /** 제목 wrapper에 줄 클래스 */
  titleClassName?: string
}

export function PostDetailBody({
  post,
  titleAs: TitleTag,
  titleClassName = "",
}: PostDetailBodyProps) {
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
    <>
      <div className="space-y-4">
        <TitleTag className={titleClassName}>{post.title}</TitleTag>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap text-sm text-muted-foreground">
          {post.author && (
            <>
              <div>
                <span className="font-medium text-foreground">{post.author.name}</span>
                <span className="ml-2 text-muted-foreground">{post.author.username}</span>
              </div>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
            </>
          )}
          <span>작성일: {formatDate(post.createdAt)}</span>
          {isUpdated && post.updatedAt && (
            <>
              <Separator orientation="vertical" className="h-4 hidden sm:block" />
              <span>수정일: {formatDate(post.updatedAt)}</span>
            </>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        {imageUrl && (
          <div className="min-w-0 w-full overflow-hidden">
            <PostImage src={imageUrl} alt={post.title} />
          </div>
        )}
        <div className="whitespace-pre-wrap text-foreground leading-relaxed">
          {post.content}
        </div>
      </div>
    </>
  )
}
