import { describe, it, expect } from "vitest"
import { loginSchema, signupSchema } from "@/lib/schemas/auth"

describe("auth schemas", () => {
  describe("loginSchema", () => {
    it("유효한 이메일과 비밀번호는 통과한다", () => {
      const result = loginSchema.safeParse({
        username: "test@example.com",
        password: "password123",
      })
      expect(result.success).toBe(true)
    })

    it("잘못된 이메일 형식은 실패한다", () => {
      const result = loginSchema.safeParse({
        username: "invalid-email",
        password: "password123",
      })
      expect(result.success).toBe(false)
    })

    it("빈 비밀번호는 실패한다", () => {
      const result = loginSchema.safeParse({
        username: "test@example.com",
        password: "",
      })
      expect(result.success).toBe(false)
    })

    it("이메일 최대 길이 초과 시 실패한다", () => {
      const longEmail = "a".repeat(250) + "@test.com"
      const result = loginSchema.safeParse({
        username: longEmail,
        password: "password123",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("signupSchema", () => {
    const validSignup = {
      username: "test@example.com",
      name: "홍길동",
      password: "Test1234!",
      confirmPassword: "Test1234!",
    }

    it("유효한 회원가입 데이터는 통과한다", () => {
      const result = signupSchema.safeParse(validSignup)
      expect(result.success).toBe(true)
    })

    it("비밀번호와 확인 비밀번호가 일치하지 않으면 실패한다", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        confirmPassword: "Different123!",
      })
      expect(result.success).toBe(false)
    })

    it("8자 미만 비밀번호는 실패한다", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "Test1!",
        confirmPassword: "Test1!",
      })
      expect(result.success).toBe(false)
    })

    it("숫자/영문/특수문자 미포함 비밀번호는 실패한다", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "testtesttest",
        confirmPassword: "testtesttest",
      })
      expect(result.success).toBe(false)
    })

    it("이름이 2자 미만이면 실패한다", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        name: "A",
      })
      expect(result.success).toBe(false)
    })

    it("허용된 특수문자(!%*#?&) 포함 비밀번호는 통과한다", () => {
      const passwords = ["Test1234!", "Test1234%", "Test1234*", "Test1234#", "Test1234?", "Test1234&"]
      for (const pwd of passwords) {
        const result = signupSchema.safeParse({
          username: "test@example.com",
          name: "홍길동",
          password: pwd,
          confirmPassword: pwd,
        })
        expect(result.success).toBe(true)
      }
    })
  })
})
