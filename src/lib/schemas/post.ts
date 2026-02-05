/**
 * 게시글 폼 검증 스키마 (Zod)
 *
 * - title, content: 필수, 길이 제한 적용
 * - category: 필수 선택
 * - file: 선택 사항, File 인스턴스만 허용
 */
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
  /** 첨부 파일 (선택). File 인스턴스만 허용, null/undefined 가능 */
  file: z.instanceof(File).nullable().optional(),
})

/** postSchema에서 추론한 폼 값 타입 (react-hook-form 등에서 사용) */
export type PostFormValues = z.infer<typeof postSchema>
