import * as z from "zod"
import { INPUT_LIMITS } from "@/lib/constants/validation"

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(INPUT_LIMITS.POST_TITLE, `제목은 최대 ${INPUT_LIMITS.POST_TITLE}자까지 입력 가능합니다`),
  content: z
    .string()
    .min(1, "내용을 입력해주세요")
    .max(INPUT_LIMITS.POST_CONTENT, `내용은 최대 ${INPUT_LIMITS.POST_CONTENT}자까지 입력 가능합니다`),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  file: z.instanceof(File).nullable().optional(), // 파일 필드 추가 (선택사항)
})

export type PostFormValues = z.infer<typeof postSchema>
