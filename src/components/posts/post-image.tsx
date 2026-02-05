"use client"

/**
 * 게시글 첨부 이미지 (Next.js Image)
 * next.config images.remotePatterns 설정된 외부 API URL 전용.
 * 로드 실패 시 에러 메시지 표시.
 */
import { useState } from "react"
import Image from "next/image"

interface PostImageProps {
  src: string
  alt: string
  /** 이미지 래퍼 클래스 (max-h 등) */
  className?: string
}

const DEFAULT_IMAGE_CLASS = "max-h-[200px] sm:max-h-[300px] md:max-h-[400px]"

export function PostImage({
  src,
  alt,
  className = DEFAULT_IMAGE_CLASS,
}: PostImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="text-sm text-muted-foreground p-4 border border-border/50 rounded-lg bg-muted/50">
        이미지를 불러올 수 없습니다.
      </div>
    )
  }

  return (
    <div className={`relative min-w-0 max-w-full overflow-hidden rounded-lg border border-border/50 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className={`h-auto max-w-full object-contain object-center ${className}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        onError={() => setError(true)}
      />
    </div>
  )
}
