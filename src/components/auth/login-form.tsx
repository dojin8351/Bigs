"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { EmailField } from "@/components/forms/email-field"
import { PasswordField } from "@/components/forms/password-field"
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth"
import { login } from "@/api/auth"
import type { loginReq } from "@/types/auth"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ERROR_MESSAGES } from "@/lib/constants/messages"

export function LoginForm() {
  const router = useRouter()
  const setTokens = useAuthStore((state) => state.setTokens)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: loginReq) => {
      const response = await login(data)
      // 로그인 성공 시 토큰 저장
      setTokens(response.accessToken, response.refreshToken)
      return response
    },
    onSuccess: () => {
      // Zustand store에서 저장된 사용자 정보 가져오기
      const user = useAuthStore.getState().user
      
      console.log("=".repeat(50))
      console.log("✅ 로그인 성공!")
      console.log("=".repeat(50))
      if (user) {
        console.log("👤 사용자 정보:")
        console.log("  - 이름:", user.name)
        console.log("  - 이메일:", user.username)
      } else {
        console.warn("⚠️ 사용자 정보를 가져올 수 없습니다.")
      }
      console.log("=".repeat(50))
      
      // 로그인 성공 시 메인 페이지로 리다이렉트
      router.push("/")
    },
    onError: () => {
      form.setError("root", {
        type: "server",
        message: ERROR_MESSAGES.LOGIN_FAILED,
      })
    },
  })

  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      form.clearErrors("root")
      loginMutation.mutate({
        username: data.username,
        password: data.password,
      })
    },
    [loginMutation, form]
  )

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">로그인</CardTitle>
        <CardDescription>
          계정에 로그인하려면 이메일과 비밀번호를 입력하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EmailField
              control={form.control}
              name="username"
              label="이메일"
              placeholder="example@email.com"
            />
            <PasswordField
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
            />
            {form.formState.errors.root && (
              <div
                role="alert"
                className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
              >
                {form.formState.errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              aria-busy={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="inline-flex items-center">
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                    aria-hidden="true"
                  />
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            회원가입
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
