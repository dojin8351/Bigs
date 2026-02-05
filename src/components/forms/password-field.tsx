"use client"

/**
 * 비밀번호 입력 폼 필드 (react-hook-form 연동)
 * 비밀번호 표시/숨기기 토글 버튼 포함
 */
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { cn } from "@/lib/utils"
import { INPUT_LIMITS } from "@/lib/constants/validation"
import type { ComponentProps } from "react"

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  description?: string
  showDescription?: boolean
  maxLength?: number
  autoComplete?: string
}

interface PasswordInputProps extends ComponentProps<typeof Input> {
  showPassword: boolean
  onToggle: () => void
}

function PasswordInput({ showPassword, onToggle, className, ...props }: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={onToggle}
        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label = "비밀번호",
  placeholder = "비밀번호를 입력하세요",
  description,
  showDescription = false,
  maxLength = INPUT_LIMITS.PASSWORD,
  autoComplete = "current-password",
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PasswordInput
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              placeholder={placeholder}
              maxLength={maxLength}
              autoComplete={autoComplete}
              className={cn(
                fieldState.error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              )}
              {...field}
            />
          </FormControl>
          {showDescription && description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
