/**
 * 로그인 페이지 (/login)
 * AuthLayout + LoginForm. metadata로 SEO 설정.
 */
import type { Metadata } from "next"
import { AuthLayout } from "@/components/layout/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "로그인 | BIGS",
  description: "계정에 로그인하세요",
}

export default function LoginPage() {
  return (
    <AuthLayout title="로그인" description="계정에 로그인하세요">
      <LoginForm />
    </AuthLayout>
  )
}
