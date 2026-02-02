import { AuthLayout } from "@/components/layout/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <AuthLayout title="회원가입" description="새 계정을 만드세요">
      <SignupForm />
    </AuthLayout>
  )
}
