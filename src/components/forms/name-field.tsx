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

interface NameFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
}

export function NameField<T extends FieldValues>({
  control,
  name,
  label = "사용자 이름",
  placeholder = "홍길동",
}: NameFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
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
