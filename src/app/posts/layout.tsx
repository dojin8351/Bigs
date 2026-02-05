/**
 * 게시판 레이아웃 (/posts)
 * children 그대로 전달. metadata로 SEO 설정.
 */
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "게시판 | DOHYEON",
  description: "게시글을 작성하고 관리하세요",
}

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
