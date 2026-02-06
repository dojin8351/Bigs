import { describe, it, expect } from "vitest"
import { decodeJWT, extractUserFromToken, isTokenExpired, isTokenExpiringSoon } from "@/lib/utils/jwt"

/** Base64URL 인코딩 헬퍼 (테스트용 JWT 생성) */
function base64UrlEncode(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj)
  const base64 = Buffer.from(json, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
  return base64
}

function createTestToken(payload: Record<string, unknown>): string {
  const header = base64UrlEncode({ alg: "HS256", typ: "JWT" })
  const payloadB64 = base64UrlEncode(payload)
  const signature = "fake-signature-for-test"
  return `${header}.${payloadB64}.${signature}`
}

describe("jwt utils", () => {
  describe("decodeJWT", () => {
    it("유효한 JWT 토큰을 디코딩하면 payload를 반환한다", () => {
      const payload = { name: "홍길동", username: "hong@test.com", iat: 1234567890, exp: 9999999999 }
      const token = createTestToken(payload)

      const result = decodeJWT(token)

      expect(result).not.toBeNull()
      expect(result).toEqual(payload)
    })

    it("3개가 아닌 파트로 구성된 토큰은 null을 반환한다", () => {
      expect(decodeJWT("invalid")).toBeNull()
      expect(decodeJWT("a.b")).toBeNull()
      expect(decodeJWT("a.b.c.d")).toBeNull()
    })

    it("잘못된 base64 payload는 null을 반환한다", () => {
      const token = "a.b!!!invalid!!!.c"
      expect(decodeJWT(token)).toBeNull()
    })
  })

  describe("extractUserFromToken", () => {
    it("name과 username이 있으면 사용자 정보를 반환한다", () => {
      const payload = {
        name: "홍길동",
        username: "hong@test.com",
        iat: 1234567890,
        exp: 9999999999,
      }
      const token = createTestToken(payload)

      const result = extractUserFromToken(token)

      expect(result).toEqual({ name: "홍길동", username: "hong@test.com" })
    })

    it("name이 없으면 null을 반환한다", () => {
      const payload = { username: "hong@test.com", exp: 9999999999 }
      const token = createTestToken(payload)
      expect(extractUserFromToken(token)).toBeNull()
    })

    it("username이 없으면 null을 반환한다", () => {
      const payload = { name: "홍길동", exp: 9999999999 }
      const token = createTestToken(payload)
      expect(extractUserFromToken(token)).toBeNull()
    })

    it("잘못된 토큰은 null을 반환한다", () => {
      expect(extractUserFromToken("invalid")).toBeNull()
    })
  })

  describe("isTokenExpired", () => {
    it("exp가 미래이면 false(유효함)를 반환한다", () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600 // 1시간 후
      const payload = { name: "홍길동", username: "hong@test.com", exp: futureExp }
      const token = createTestToken(payload)

      expect(isTokenExpired(token)).toBe(false)
    })

    it("exp가 과거이면 true(만료됨)를 반환한다", () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600 // 1시간 전
      const payload = { name: "홍길동", username: "hong@test.com", exp: pastExp }
      const token = createTestToken(payload)

      expect(isTokenExpired(token)).toBe(true)
    })

    it("exp가 없으면 true(만료로 간주)를 반환한다", () => {
      const payload = { name: "홍길동", username: "hong@test.com" }
      const token = createTestToken(payload)

      expect(isTokenExpired(token)).toBe(true)
    })

    it("잘못된 토큰은 true(만료로 간주)를 반환한다", () => {
      expect(isTokenExpired("invalid")).toBe(true)
    })
  })

  describe("isTokenExpiringSoon", () => {
    it("exp가 버퍼 시간 내에 있으면 true를 반환한다", () => {
      const expIn30Sec = Math.floor(Date.now() / 1000) + 30
      const payload = { name: "홍길동", username: "hong@test.com", exp: expIn30Sec }
      const token = createTestToken(payload)

      expect(isTokenExpiringSoon(token, 60)).toBe(true)
    })

    it("exp가 버퍼 시간 이후이면 false를 반환한다", () => {
      const expIn2Min = Math.floor(Date.now() / 1000) + 120
      const payload = { name: "홍길동", username: "hong@test.com", exp: expIn2Min }
      const token = createTestToken(payload)

      expect(isTokenExpiringSoon(token, 60)).toBe(false)
    })

    it("기본 bufferSeconds 60초를 사용한다", () => {
      const expIn30Sec = Math.floor(Date.now() / 1000) + 30
      const payload = { name: "홍길동", username: "hong@test.com", exp: expIn30Sec }
      const token = createTestToken(payload)

      expect(isTokenExpiringSoon(token)).toBe(true)
    })

    it("exp가 없거나 잘못된 토큰은 true를 반환한다", () => {
      const payload = { name: "홍길동", username: "hong@test.com" }
      const token = createTestToken(payload)

      expect(isTokenExpiringSoon(token)).toBe(true)
      expect(isTokenExpiringSoon("invalid")).toBe(true)
    })
  })
})
