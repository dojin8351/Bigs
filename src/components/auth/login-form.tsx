"use client"

const SAVED_USERNAME_KEY = "saved-login-username"

/**
 * 로그인 폼 컴포넌트
 *
 * - react-hook-form + zodResolver(loginSchema)로 클라이언트 검증
 * - 로그인 API 성공 시 accessToken/refreshToken을 auth store에 저장 후 /posts로 이동
 * - 이미 로그인된 경우(hasHydrated && isAuthenticated) /posts로 리다이렉트
 * - router.replace 사용: 뒤로가기 시 로그인 페이지 재진입 방지
 * - 아이디 저장: 체크 시 username을 localStorage에 저장, 다음 방문 시 자동 입력
 */
import { useEffect, useCallback, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { INPUT_LIMITS } from "@/lib/constants/validation"
import { postKeys } from "@/lib/queries/post-keys"

export function LoginForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const [rememberMe, setRememberMe] = useState(() =>
    typeof window !== "undefined" && !!localStorage.getItem(SAVED_USERNAME_KEY)
  )

  /** zodResolver + loginSchema: 이메일 형식, 비밀번호 필수 검증 */
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/posts")
    }
  }, [hasHydrated, isAuthenticated, router])

  /** 저장된 아이디 복원 (클라이언트에서만) */
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem(SAVED_USERNAME_KEY)
    if (saved) {
      form.setValue("username", saved)
    }
  }, [form])

  const loginMutation = useMutation({
    mutationFn: async (data: loginReq & { rememberMe?: boolean }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- rememberMe는 onSuccess에서 사용
      const { rememberMe, ...loginData } = data
      const response = await login(loginData)
      setTokens(response.accessToken, response.refreshToken)
      return response
    },
    onSuccess: async (_data, variables) => {
      if (variables.rememberMe) {
        localStorage.setItem(SAVED_USERNAME_KEY, variables.username)
      } else {
        localStorage.removeItem(SAVED_USERNAME_KEY)
      }
      await queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      router.replace("/posts")
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
        rememberMe,
      })
    },
    [loginMutation, form, rememberMe]
  )

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5 dark:shadow-primary/10">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          로그인
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">
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
              maxLength={INPUT_LIMITS.EMAIL}
              autoComplete="email"
            />
            <PasswordField
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              maxLength={INPUT_LIMITS.PASSWORD}
              autoComplete="current-password"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
                aria-label="아이디 저장"
              />
              <span className="text-sm text-muted-foreground">아이디 저장</span>
            </label>
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
              className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
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
