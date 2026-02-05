"use client"

/**
 * 이메일 입력 폼 필드 (react-hook-form 연동)
 */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { cn } from "@/lib/utils"
import { INPUT_LIMITS } from "@/lib/constants/validation"

interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  maxLength?: number
  autoComplete?: string
}

export function EmailField<T extends FieldValues>({
  control,
  name,
  label = "이메일",
  placeholder = "example@email.com",
  maxLength = INPUT_LIMITS.EMAIL,
  autoComplete = "email",
}: EmailFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder={placeholder}
              maxLength={maxLength}
              autoComplete={autoComplete}
              className={cn(
                fieldState.error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              )}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
