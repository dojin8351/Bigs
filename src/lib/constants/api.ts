/**
 * API 베이스 URL (.env.local의 NEXT_PUBLIC_API_BASE_URL)
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

/**
 * 이미지 URL 생성
 * API가 반환하는 imageUrl(/media/images/xxx.png)을 NEXT_PUBLIC_API_BASE_URL과 결합
 *
 * @param imageUrl - API 응답의 이미지 경로 (예: "/media/images/5196...png")
 * @returns API_BASE_URL + imageUrl 또는 null (빈 값일 때)
 */
export function getImageUrl(
  imageUrl: string | null | undefined
): string | null {
  if (!imageUrl || imageUrl.trim() === "") {
    return null
  }
  return `${API_BASE_URL}${imageUrl}`
}
