import axios from "axios"
import type { signUpReq, signUpRes, loginReq, refreshReq, refreshRes } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

const SIGNUP_URL = `${API_BASE_URL}/auth/signup`
const LOGIN_URL = `${API_BASE_URL}/auth/signin`
const REFRESH_URL = `${API_BASE_URL}/auth/refresh`

/**
 * 회원가입 API
 * 성공 시 응답 body가 없음 (200 OK, Content-Length: 0)
 */
export const signUp = async (data: signUpReq): Promise<void> => {
  const response = await axios.post(SIGNUP_URL, data, {
    validateStatus: (status) => status === 200,
  })

  return response.data
}

/**
 * 로그인 API
 */
export const login = async (data: loginReq): Promise<signUpRes> => {
  const response = await axios.post<signUpRes>(LOGIN_URL, data)
  return response.data
}

/**
 * 토큰 갱신 API
 */
export const refresh = async (data: refreshReq): Promise<refreshRes> => {
  const response = await axios.post<refreshRes>(REFRESH_URL, data)
  return response.data
}
