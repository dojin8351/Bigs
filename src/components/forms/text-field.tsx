"use client"

/**
 * 일반 텍스트 입력 폼 필드 (react-hook-form 연동)
 *
 * FormField + Input. label, placeholder, maxLength 지원.
 * 게시글 제목 등 단일 라인 텍스트용.
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

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  maxLength?: number
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  maxLength,
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} maxLength={maxLength} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
