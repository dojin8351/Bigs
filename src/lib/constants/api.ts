/**
 * API 관련 상수 및 유틸
 *
 * - API_BASE_URL: .env.local의 NEXT_PUBLIC_API_BASE_URL (fallback 없음)
 * - getImageUrl: 상대 경로 이미지 URL을 전체 URL로 변환
 */

/** API 서버 베이스 URL. 반드시 .env.local에 설정 필요 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

/**
 * 이미지 전체 URL 생성
 *
 * API는 상대 경로(/media/images/xxx.png)만 반환하므로
 * API_BASE_URL과 결합해 img src에 사용
 *
 * @param imageUrl - API 응답 imageUrl (예: "/media/images/5196...png")
 * @returns 전체 URL 또는 null (빈 값/공백 시)
 */
export function getImageUrl(
  imageUrl: string | null | undefined
): string | null {
  if (!imageUrl || imageUrl.trim() === "") {
    return null
  }
  return `${API_BASE_URL}${imageUrl}`
}
