import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("getImageUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv
  })

  it("상대 경로와 API_BASE_URL을 결합해 전체 URL을 반환한다", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com"
    const { getImageUrl } = await import("@/lib/constants/api")

    expect(getImageUrl("/media/images/test.png")).toBe(
      "https://api.example.com/media/images/test.png"
    )
  })

  it("null 또는 undefined는 null을 반환한다", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com"
    const { getImageUrl } = await import("@/lib/constants/api")

    expect(getImageUrl(null)).toBe(null)
    expect(getImageUrl(undefined)).toBe(null)
  })

  it("빈 문자열 또는 공백만 있으면 null을 반환한다", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com"
    const { getImageUrl } = await import("@/lib/constants/api")

    expect(getImageUrl("")).toBe(null)
    expect(getImageUrl("   ")).toBe(null)
  })

  it("API_BASE_URL이 빈 문자열이어도 상대 경로는 그대로 결합된다", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = ""
    const { getImageUrl } = await import("@/lib/constants/api")

    expect(getImageUrl("/media/images/test.png")).toBe("/media/images/test.png")
  })
})
