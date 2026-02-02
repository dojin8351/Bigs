"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      // TODO: 실제 로그인 API 호출
      console.log("Login data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
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
