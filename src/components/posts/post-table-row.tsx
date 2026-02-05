"use client"

/**
 * 게시글 테이블 행 컴포넌트 (번호, 제목, 카테고리, 작성일)
 */
import {
  TableRow,
  TableCell,
} from "@/components/ui/table"
import type { PostListItem } from "@/types/post"

interface PostTableRowProps {
  post: PostListItem
  postNumber: number
  formatDate: (dateString: string) => string
  categoryLabel: string
  onView: (post: PostListItem) => void
}

export function PostTableRow({
  post,
  postNumber,
  formatDate,
  categoryLabel,
  onView,
}: PostTableRowProps) {
  return (
    <TableRow
      className="hover:bg-muted/20 transition-colors cursor-pointer group"
      onClick={() => onView(post)}
    >
      <TableCell className="font-medium text-muted-foreground w-[80px]">
        {postNumber}
      </TableCell>
      <TableCell>
        <div className="font-medium group-hover:text-primary transition-colors">
          {post.title}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground w-[100px]">
        {categoryLabel}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground w-[140px]">
        {formatDate(post.createdAt)}
      </TableCell>
    </TableRow>
  )
}
