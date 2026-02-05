"use client"

/**
 * 회원가입 폼 컴포넌트
 * 이메일·이름·비밀번호·비밀번호 확인 입력 후 가입 API 호출, 성공 시 완료 모달 표시 후 로그인 페이지로 이동
 */
import { useState, useEffect, useCallback } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { EmailField } from "@/components/forms/email-field"
import { NameField } from "@/components/forms/name-field"
import { PasswordField } from "@/components/forms/password-field"
import { signupSchema, type SignupFormValues } from "@/lib/schemas/auth"
import { signUp } from "@/api/auth"
import type { signUpReq } from "@/types/auth"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants/messages"
import { INPUT_LIMITS } from "@/lib/constants/validation"

export function SignupForm() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace("/posts")
    }
  }, [hasHydrated, isAuthenticated, router])

  /** signupSchema: 이메일, 이름(2~50자), 비밀번호(8자+숫자·영문·특수문자), 비밀번호 확인 일치 */
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  const signupMutation = useMutation<void, Error, signUpReq>({
    mutationFn: (data: signUpReq) => signUp(data),
    onSuccess: () => {
      // 성공 시 모달 표시
      setIsSuccessModalOpen(true)
    },
    onError: () => {
      form.setError("root", {
        type: "server",
        message: ERROR_MESSAGES.SIGNUP_FAILED,
      })
    },
  })

  const onSubmit = useCallback(
    (data: SignupFormValues) => {
      // 이전 에러 메시지 제거
      form.clearErrors("root")
      
      signupMutation.mutate({
        username: data.username,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    },
    [signupMutation, form]
  )

  const handleSuccessConfirm = useCallback(() => {
    setIsSuccessModalOpen(false)
    // 모달 확인 후 폼 리셋 및 페이지 이동
    form.reset()
    router.push("/login")
  }, [form, router])

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5 dark:shadow-primary/10">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          회원가입
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">
          새 계정을 만들려면 아래 정보를 입력하세요
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
            <NameField
              control={form.control}
              name="name"
              label="사용자 이름"
              placeholder="홍길동"
              maxLength={INPUT_LIMITS.NAME}
              autoComplete="name"
            />
            <PasswordField
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              description="8자 이상, 숫자, 영문자, 특수문자(!%*#?&)를 각각 1개 이상 포함해야 합니다"
              showDescription={true}
              maxLength={INPUT_LIMITS.PASSWORD}
              autoComplete="new-password"
            />
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              maxLength={INPUT_LIMITS.PASSWORD}
              autoComplete="new-password"
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
              className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              disabled={signupMutation.isPending}
              aria-busy={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <span className="inline-flex items-center">
                  <Loader2
                    className="mr-2 h-4 w-4 animate-spin"
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                    aria-hidden="true"
                  />
                  가입 중...
                </span>
              ) : (
                "회원가입"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            로그인
          </Link>
        </div>
      </CardFooter>

      {/* 회원가입 성공 모달 */}
      <Dialog
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>회원가입 완료</DialogTitle>
            <DialogDescription>
              {SUCCESS_MESSAGES.SIGNUP_COMPLETE}
              <br />
              로그인 페이지로 이동하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessConfirm} className="w-full">
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
