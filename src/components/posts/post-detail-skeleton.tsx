"use client"

/**
 * 게시글 상세 조회 로딩 스켈레톤
 *
 * PostDetail과 동일한 레이아웃 구조로 Skeleton 표시.
 * 제목 → 메타정보(작성자/날짜) → 구분선 → 이미지 영역 → 본문 줄들 → 푸터 버튼.
 */
import { Skeleton } from "@/components/ui/skeleton"

export function PostDetailSkeleton() {
  return (
    <div className="space-y-4">
      {/* 헤더: 제목 */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-full max-w-[90%] sm:h-10" />
        <Skeleton className="h-8 w-3/4 max-w-[70%] sm:h-9" />
        {/* 메타정보: 작성자, 날짜 */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <Skeleton className="my-4 h-px w-full" />

      {/* 이미지 영역 (이미지 존재 가정, PostDetail 이미지 높이와 동일) */}
      <div className="w-full">
        <Skeleton className="h-[200px] w-full rounded-lg border border-border/50 sm:h-[300px] md:h-[400px]" />
      </div>

      {/* 본문: 여러 줄 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* 푸터 버튼 */}
      <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end sm:gap-4">
        <Skeleton className="h-11 w-full rounded-md sm:w-24" />
        <Skeleton className="h-11 w-full rounded-md sm:w-24" />
        <Skeleton className="h-11 w-full rounded-md sm:w-24" />
      </div>
    </div>
  )
}
