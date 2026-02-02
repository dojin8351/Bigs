"use client"

import { useState, useCallback } from "react"
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
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants/messages"

export function SignupForm() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const router = useRouter()

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
    <Card className="border-2 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        <CardDescription>
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
            />
            <NameField
              control={form.control}
              name="name"
              label="사용자 이름"
              placeholder="홍길동"
            />
            <PasswordField
              control={form.control}
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              description="8자 이상, 숫자, 영문자, 특수문자(!%*#?&)를 각각 1개 이상 포함해야 합니다"
              showDescription={true}
            />
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
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
        onOpenChange={(open) => {
          if (!open) return
          setIsSuccessModalOpen(open)
        }}
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
