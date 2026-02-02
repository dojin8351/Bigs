import { AuthLayout } from "@/components/layout/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthLayout title="로그인" description="계정에 로그인하세요">
      <LoginForm />
    </AuthLayout>
  )
}
