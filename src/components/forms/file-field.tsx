"use client"

/**
 * 파일 업로드 폼 필드 (react-hook-form 연동)
 *
 * - Input을 hidden으로 두고 Button 클릭 시 fileInputRef.current?.click()으로 트리거
 * - value는 field에서 제외: input[type=file]에 value 전달 시 React 경고 (보안상 읽기 전용)
 * - Blob URL 미리보기 후 URL.revokeObjectURL로 메모리 해제
 */
import { useRef, useEffect, useState } from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form"
import { X, Upload } from "lucide-react"

interface FileFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  accept?: string
  description?: string
}

export function FileField<T extends FieldValues>({
  control,
  name,
  label = "파일",
  accept = "image/*",
  description,
}: FileFieldProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  /** useWatch로 file 필드 변화 감지 → 미리보기 업데이트 */
  const file = useWatch({
    control,
    name,
  }) as File | null | undefined

  /** 이미지면 Blob URL 생성. cleanup에서 revokeObjectURL 필수 (메모리 누수 방지) */
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      queueMicrotask(() => setPreviewUrl(url))
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      queueMicrotask(() => setPreviewUrl(null))
    }
  }, [file])

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value: _value, ...field } }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null
                      onChange(selectedFile)
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    파일 선택
                  </Button>
                  {file && (
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm text-muted-foreground truncate">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          onChange(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {previewUrl && (
                  <div className="relative w-full max-w-md">
                    {/* eslint-disable-next-line @next/next/no-img-element -- Blob URL 미리보기 */}
                    <img
                      src={previewUrl}
                      alt="미리보기"
                      className="w-full h-auto rounded-lg border border-border/50 object-contain max-h-64"
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
    />
  )
}
