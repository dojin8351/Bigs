/**
 * 회원가입 페이지 (/signup)
 * AuthLayout + SignupForm. metadata로 SEO 설정.
 */
import type { Metadata } from "next"
import { AuthLayout } from "@/components/layout/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "회원가입 | DOHYEON",
  description: "새 계정을 만드세요",
}

export default function SignupPage() {
  return (
    <AuthLayout title="회원가입" description="새 계정을 만드세요">
      <SignupForm />
    </AuthLayout>
  )
}
