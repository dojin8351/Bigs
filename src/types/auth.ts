/**
 * 인증 관련 타입 정의
 * API 요청/응답 및 JWT 페이로드에 사용
 */

/** 회원가입 요청 (username = 이메일) */
export type signUpReq = {
  username : string
  name : string
  password : string
  confirmPassword : string
}

/** 로그인 요청 */
export type loginReq = {
  username : string
  password : string
}

/** 로그인/회원가입 성공 응답 (JWT 토큰 쌍) */
export type signUpRes = {
  accessToken : string
  refreshToken : string
}

/** 토큰 갱신 요청 */
export type refreshReq = {
  refreshToken : string
}

/** 토큰 갱신 응답 (signUpRes와 동일) */
export type refreshRes = signUpRes