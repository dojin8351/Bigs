import * as z from "zod"
import { INPUT_LIMITS } from "@/lib/constants/validation"

// 비밀번호 검증: 8자 이상, 숫자, 영문자, 특수문자(!%*#?&) 1개 이상의 조합
const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!%*#?&]).{8,}$/

export const loginSchema = z.object({
  username: z.string().email("올바른 이메일 형식이 아닙니다").max(INPUT_LIMITS.EMAIL, `이메일은 최대 ${INPUT_LIMITS.EMAIL}자까지 입력 가능합니다`),
  password: z.string().min(1, "비밀번호를 입력해주세요").max(INPUT_LIMITS.PASSWORD, `비밀번호는 최대 ${INPUT_LIMITS.PASSWORD}자까지 입력 가능합니다`),
})

export const signupSchema = z
  .object({
    username: z.string().email("올바른 이메일 형식이 아닙니다").max(INPUT_LIMITS.EMAIL, `이메일은 최대 ${INPUT_LIMITS.EMAIL}자까지 입력 가능합니다`),
    name: z
      .string()
      .min(2, "이름은 최소 2자 이상이어야 합니다")
      .max(INPUT_LIMITS.NAME, `이름은 최대 ${INPUT_LIMITS.NAME}자까지 입력 가능합니다`),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .max(INPUT_LIMITS.PASSWORD, `비밀번호는 최대 ${INPUT_LIMITS.PASSWORD}자까지 입력 가능합니다`)
      .regex(
        passwordRegex,
        "비밀번호는 숫자, 영문자, 특수문자(!%*#?&)를 각각 1개 이상 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요").max(INPUT_LIMITS.PASSWORD, `비밀번호 확인은 최대 ${INPUT_LIMITS.PASSWORD}자까지 입력 가능합니다`),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
