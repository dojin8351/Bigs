import { describe, it, expect } from "vitest"
import { postKeys } from "@/lib/queries/post-keys"

describe("postKeys", () => {
  it("lists()는 올바른 prefix를 반환한다", () => {
    expect(postKeys.lists()).toEqual(["posts", "list"])
  })

  it("list()는 전체 목록 쿼리 키를 반환한다", () => {
    expect(postKeys.list()).toEqual(["posts", "list", "all"])
  })

  it("details()는 올바른 prefix를 반환한다", () => {
    expect(postKeys.details()).toEqual(["posts", "detail"])
  })

  it("detail(id)는 id를 포함한 상세 쿼리 키를 반환한다", () => {
    expect(postKeys.detail(1)).toEqual(["posts", "detail", 1])
    expect(postKeys.detail(42)).toEqual(["posts", "detail", 42])
  })

  it("categories()는 카테고리 쿼리 키를 반환한다", () => {
    expect(postKeys.categories()).toEqual(["posts", "categories"])
  })
})
