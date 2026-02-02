"use client"

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

interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
}

export function EmailField<T extends FieldValues>({
  control,
  name,
  label = "이메일",
  placeholder = "example@email.com",
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
