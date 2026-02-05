import { devLog } from "@/lib/utils/logger"

/**
 * JWT 토큰 디코딩 유틸리티
 */

interface JWTPayload {
  name?: string
  username?: string
  iat?: number
  exp?: number
  [key: string]: unknown
}

/**
 * Base64URL을 디코딩하여 UTF-8 문자열로 변환합니다.
 * 한글 등 멀티바이트 문자를 올바르게 처리합니다.
 */
function base64UrlDecode(str: string): string {
  // base64url을 base64로 변환 (URL-safe 문자를 일반 base64로)
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  
  // 패딩 추가
  const padding = (4 - (base64.length % 4)) % 4
  base64 += "=".repeat(padding)
  
  // base64 디코딩
  const binaryString = atob(base64)
  
  // UTF-8 바이트 배열로 변환
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  // UTF-8 디코딩
  return new TextDecoder("utf-8").decode(bytes)
}

/**
 * JWT 토큰의 payload를 디코딩합니다.
 * @param token JWT 토큰
 * @returns 디코딩된 payload 또는 null
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT는 header.payload.signature 형식
    const parts = token.split(".")
    if (parts.length !== 3) {
      devLog.error("[JWT] 토큰 형식이 올바르지 않습니다.")
      return null
    }

    // payload 부분 디코딩 (base64url)
    const payload = parts[1]
    
    // UTF-8을 고려한 디코딩
    const decoded = base64UrlDecode(payload)
    const parsed = JSON.parse(decoded) as JWTPayload

    return parsed
  } catch (error) {
    devLog.error("[JWT] 토큰 디코딩 실패:", error)
    return null
  }
}

/**
 * JWT 토큰에서 사용자 정보를 추출합니다.
 * @param token JWT 토큰
 * @returns 사용자 정보 (name, username) 또는 null
 */
export function extractUserFromToken(token: string): {
  name: string
  username: string
} | null {
  const payload = decodeJWT(token)
  if (!payload) {
    return null
  }

  const name = payload.name
  const username = payload.username

  if (!name || !username) {
    devLog.warn("[JWT] 토큰에 사용자 정보가 없습니다:", payload)
    return null
  }

  return {
    name: String(name),
    username: String(username),
  }
}

/**
 * JWT 토큰이 만료되었는지 확인합니다.
 * @param token JWT 토큰
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) {
    return true
  }

  // exp는 Unix timestamp (초 단위)
  const expirationTime = payload.exp * 1000 // 밀리초로 변환
  const currentTime = Date.now()

  // 만료 시간이 현재 시간보다 작으면 만료됨
  return expirationTime < currentTime
}

/**
 * JWT 토큰이 곧 만료될 예정인지 확인합니다.
 * @param token JWT 토큰
 * @param bufferSeconds 만료 전 버퍼 시간 (초 단위, 기본값: 60초)
 * @returns 곧 만료될 예정 여부
 */
export function isTokenExpiringSoon(
  token: string,
  bufferSeconds: number = 60
): boolean {
  const payload = decodeJWT(token)
  if (!payload || !payload.exp) {
    return true
  }

  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  const bufferTime = bufferSeconds * 1000

  // 만료 시간이 (현재 시간 + 버퍼 시간)보다 작으면 곧 만료될 예정
  return expirationTime < currentTime + bufferTime
}
