import { describe, it, expect } from "vitest"
import { postSchema } from "@/lib/schemas/post"

describe("postSchema", () => {
  it("유효한 게시글 데이터는 통과한다", () => {
    const result = postSchema.safeParse({
      title: "제목",
      content: "내용",
      category: "FREE",
    })
    expect(result.success).toBe(true)
  })

  it("빈 제목은 실패한다", () => {
    const result = postSchema.safeParse({
      title: "",
      content: "내용",
      category: "FREE",
    })
    expect(result.success).toBe(false)
  })

  it("빈 내용은 실패한다", () => {
    const result = postSchema.safeParse({
      title: "제목",
      content: "",
      category: "FREE",
    })
    expect(result.success).toBe(false)
  })

  it("카테고리 미선택 시 실패한다", () => {
    const result = postSchema.safeParse({
      title: "제목",
      content: "내용",
      category: "",
    })
    expect(result.success).toBe(false)
  })

  it("file이 File 인스턴스이면 통과한다", () => {
    const file = new File(["content"], "test.txt", { type: "text/plain" })
    const result = postSchema.safeParse({
      title: "제목",
      content: "내용",
      category: "FREE",
      file,
    })
    expect(result.success).toBe(true)
  })

  it("file이 null이면 통과한다", () => {
    const result = postSchema.safeParse({
      title: "제목",
      content: "내용",
      category: "FREE",
      file: null,
    })
    expect(result.success).toBe(true)
  })

  it("file을 생략해도 통과한다", () => {
    const result = postSchema.safeParse({
      title: "제목",
      content: "내용",
      category: "FREE",
    })
    expect(result.success).toBe(true)
  })

  it("file이 string이면 실패한다", () => {
    const result = postSchema.safeParse({
      title: "제목",
      content: "내용",
      category: "FREE",
      file: "not-a-file",
    })
    expect(result.success).toBe(false)
  })
})
