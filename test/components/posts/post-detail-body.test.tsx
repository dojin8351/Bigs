import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { PostDetailBody } from "@/components/posts/post-detail-body"
import type { Post } from "@/types/post"

const createMockPost = (overrides?: Partial<Post>): Post => ({
  id: 1,
  title: "테스트 제목",
  content: "테스트 내용",
  boardCategory: "FREE",
  imageUrl: null,
  createdAt: "2024-01-15T10:00:00.000Z",
  author: { username: "user@test.com", name: "홍길동" },
  ...overrides,
})

describe("PostDetailBody", () => {
  it("제목, 작성자, 작성일, 내용을 렌더링한다", () => {
    const post = createMockPost()
    render(
      <PostDetailBody post={post} titleAs="h1" />
    )

    expect(screen.getByText("테스트 제목")).toBeInTheDocument()
    expect(screen.getByText("홍길동")).toBeInTheDocument()
    expect(screen.getByText("user@test.com")).toBeInTheDocument()
    expect(screen.getByText(/작성일:/)).toBeInTheDocument()
    expect(screen.getByText("테스트 내용")).toBeInTheDocument()
  })

  it("수정일이 작성일과 다르면 수정일을 렌더링한다", () => {
    const post = createMockPost({
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-16T12:00:00.000Z",
    })
    render(
      <PostDetailBody post={post} titleAs="h1" />
    )

    expect(screen.getByText(/수정일:/)).toBeInTheDocument()
  })

  it("imageUrl이 있으면 이미지를 렌더링한다", () => {
    const post = createMockPost({ imageUrl: "/media/images/test.png" })
    render(
      <PostDetailBody post={post} titleAs="h1" />
    )

    const img = screen.getByRole("img", { name: "테스트 제목" })
    expect(img).toBeInTheDocument()
  })

  it("imageUrl이 null이면 이미지를 렌더링하지 않는다", () => {
    const post = createMockPost({ imageUrl: null })
    render(
      <PostDetailBody post={post} titleAs="h1" />
    )

    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("author가 없어도 작성일과 내용은 렌더링된다", () => {
    const post = createMockPost({ author: undefined })
    render(
      <PostDetailBody post={post} titleAs="h1" />
    )

    expect(screen.getByText("테스트 제목")).toBeInTheDocument()
    expect(screen.getByText(/작성일:/)).toBeInTheDocument()
    expect(screen.getByText("테스트 내용")).toBeInTheDocument()
  })
})
