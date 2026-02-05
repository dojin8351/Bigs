"use client"

/**
 * 게시판 헤더
 *
 * - 제목 "게시판", 설명, "글 작성" 버튼
 * - onSearchChange가 있으면 제목 검색 Input 표시 (Search 아이콘, aria-label)
 */
import { Plus, Search } from "lucide-react"
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PostListHeaderProps {
  onOpenCreateDialog: () => void
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

export function PostListHeader({
  onOpenCreateDialog,
  searchQuery = "",
  onSearchChange,
}: PostListHeaderProps) {
  return (
    <CardHeader className="space-y-4 pb-4 sm:pb-6 px-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            게시판
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-muted-foreground/80 mt-1 sm:mt-2">
            게시글을 작성하고 관리하세요
          </CardDescription>
        </div>
        <Button
          onClick={onOpenCreateDialog}
          className="h-11 w-full sm:w-auto text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          글 작성
        </Button>
      </div>
      {onSearchChange && (
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="제목으로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-11"
            aria-label="게시글 제목 검색"
          />
        </div>
      )}
    </CardHeader>
  )
}
