"use client"

/**
 * 게시글 작성/수정 폼 다이얼로그
 *
 * - mode: create | edit. edit 시 post로 초기값 설정
 * - postSchema 검증, 카테고리(useQuery), 제목, 내용, 이미지(FileField)
 * - 수정 시 post.imageUrl이 있으면 "현재 이미지" 표시. watchedFile 선택 시 숨김
 * - isDirty + beforeunload: 새로고침/탭 닫기 경고
 * - 닫기 시 isDirty면 "저장하지 않은 내용" 확인 모달
 */
import { useEffect, useCallback, useState } from "react"
import { useWatch } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/forms/text-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { SelectField } from "@/components/forms/select-field"
import { FileField } from "@/components/forms/file-field"
import { postSchema, type PostFormValues } from "@/lib/schemas/post"
import type { Post } from "@/types/post"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/api/post"
import { postKeys } from "@/lib/queries/post-keys"
import { INPUT_LIMITS } from "@/lib/constants/validation"
import { getImageUrl } from "@/lib/constants/api"
import { PostImage } from "./post-image"

interface PostFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  post?: Post
  onSubmit?: (data: PostFormValues) => Promise<void> | void
  isLoading?: boolean
  error?: string
}

export function PostForm({
  open,
  onOpenChange,
  mode,
  post,
  onSubmit,
  isLoading = false,
  error,
}: PostFormProps) {
  /** 카테고리 옵션 (SelectField용). postKeys.categories()로 캐싱 */
  const { data: categories } = useQuery({
    queryKey: postKeys.categories(),
    queryFn: getCategories,
  })

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      file: null,
    },
  })

  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false)

  /** 파일 선택 상태 감시. 새 파일 선택 시 기존 이미지 UI 숨기기 위해 사용 */
  const watchedFile = useWatch({ control: form.control, name: "file", defaultValue: null })

  /** API categories: { key: label } → SelectField options: [{ value, label }] */
  const categoryOptions =
    categories
      ? Object.entries(categories).map(([value, label]) => ({
          value,
          label,
        }))
      : []

  /** 다이얼로그 열릴 때마다 폼 초기화. 수정 시 post 데이터, 작성 시 빈 값. file은 항상 null(새 선택 가능) */
  useEffect(() => {
    if (open && mode === "edit" && post) {
      form.reset({
        title: post.title,
        content: post.content,
        category: post.boardCategory,
        file: null,
      })
    } else if (open && mode === "create") {
      form.reset({
        title: "",
        content: "",
        category: "",
        file: null,
      })
    }
  }, [open, mode, post, form])

  /** 폼 이탈 경고: 다이얼로그 열려 있고 입력 변경 시 새로고침/탭 닫기 경고 */
  useEffect(() => {
    const isDirty = form.formState.isDirty
    if (!open || !isDirty) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [open, form.formState.isDirty])

  const handleSubmit = useCallback(
    async (data: PostFormValues) => {
      try {
        if (onSubmit) {
          await onSubmit(data)
          form.reset()
          onOpenChange(false)
        } else {
          form.reset()
          onOpenChange(false)
        }
      } catch (error) {
        throw error
      }
    },
    [onSubmit, form, onOpenChange]
  )

  /** 다이얼로그 닫기 시도: isDirty면 확인 모달 표시 */
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpenChange(true)
      } else {
        if (form.formState.isDirty) {
          setShowUnsavedConfirm(true)
        } else {
          onOpenChange(false)
        }
      }
    },
    [onOpenChange, form.formState.isDirty]
  )

  /** 확인 모달에서 "닫기" 선택 시 실제 닫기 */
  const handleConfirmClose = useCallback(() => {
    form.reset()
    setShowUnsavedConfirm(false)
    onOpenChange(false)
  }, [form, onOpenChange])

  const isCreate = mode === "create"

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={
          "border border-gray-200/80 dark:border-border/50 bg-white dark:bg-card/95 backdrop-blur-xl shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-primary/5 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 " +
          (isCreate ? "max-w-xl sm:max-w-2xl" : "max-w-2xl sm:max-w-3xl")
        }
      >
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isCreate ? "게시글 작성" : "게시글 수정"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground/80">
            {isCreate
              ? "새로운 게시글을 작성하세요"
              : "게시글을 수정하세요"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="min-w-0 overflow-hidden space-y-4 sm:space-y-6"
          >
            <SelectField
              control={form.control}
              name="category"
              label="카테고리"
              placeholder="카테고리를 선택하세요"
              options={categoryOptions}
            />
            <TextField
              control={form.control}
              name="title"
              label="제목"
              placeholder="게시글 제목을 입력하세요"
              maxLength={INPUT_LIMITS.POST_TITLE}
            />
            <TextareaField
              control={form.control}
              name="content"
              label="내용"
              placeholder="게시글 내용을 입력하세요"
              rows={isCreate ? 6 : 8}
              maxLength={INPUT_LIMITS.POST_CONTENT}
            />
            <FileField
              control={form.control}
              name="file"
              label="이미지 첨부"
              accept="image/*"
              description="이미지 파일을 선택하세요 (선택사항)"
            />
            {/* 수정 모드일 때 기존 이미지 표시 */}
            {!isCreate && post?.imageUrl && !watchedFile && (() => {
              const imageSrc = getImageUrl(post.imageUrl)
              return imageSrc ? (
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-medium">현재 이미지</p>
                <div className="flex min-w-0 w-full items-center justify-center overflow-hidden rounded-md border border-input bg-muted/30 px-4 py-6 min-h-[160px]">
                  <PostImage
                    src={imageSrc}
                    alt={post.title}
                    className="max-h-48 w-auto max-w-full border-0 shadow-none sm:max-h-64"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  새 이미지를 선택하면 기존 이미지가 교체됩니다.
                </p>
              </div>
            ) : null
            })()}
            {(form.formState.errors.root || error) && (
              <div
                role="alert"
                className="rounded-md bg-destructive/15 p-3 text-sm text-destructive"
              >
                {form.formState.errors.root?.message || error}
              </div>
            )}
            <DialogFooter className="gap-3 sm:gap-4 flex-col-reverse sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="h-11 w-full sm:w-auto"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full sm:w-auto text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                      aria-hidden="true"
                    />
                    {mode === "create" ? "작성 중..." : "수정 중..."}
                  </span>
                ) : (
                  mode === "create" ? "작성하기" : "수정하기"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

    {/* 저장되지 않을 수 있다는 확인 모달 */}
    <Dialog open={showUnsavedConfirm} onOpenChange={setShowUnsavedConfirm}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>작성 취소</DialogTitle>
          <DialogDescription>
            저장하지 않은 내용이 있습니다. 닫으면 작성한 내용이 저장되지 않을 수 있습니다. 정말 닫으시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-4 flex-col-reverse sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUnsavedConfirm(false)}
            className="h-11"
          >
            계속 작성
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmClose}
            className="h-11"
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
