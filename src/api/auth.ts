import { publicApiClient } from "@/lib/api/client";
import type {
  signUpReq,
  signUpRes,
  loginReq,
  refreshReq,
  refreshRes,
} from "@/types/auth";

const SIGNUP_URL = "/auth/signup";
const LOGIN_URL = "/auth/signin";
const REFRESH_URL = "/auth/refresh";

/**
 * 회원가입 API
 * 성공 시 응답 body가 없음 (200 OK, Content-Length: 0)
 * 공개 API이므로 publicApiClient 사용
 */
export const signUp = async (data: signUpReq): Promise<void> => {
  const response = await publicApiClient.post(SIGNUP_URL, data);
  return response.data;
};

/**
 * 로그인 API
 * 공개 API이므로 publicApiClient 사용
 */
export const login = async (data: loginReq): Promise<signUpRes> => {
  const response = await publicApiClient.post<signUpRes>(LOGIN_URL, data);
  return response.data;
};

/**
 * 토큰 갱신 API
 * 공개 API이므로 publicApiClient 사용 (refreshToken으로 인증)
 */
export const refresh = async (data: refreshReq): Promise<refreshRes> => {
  const response = await publicApiClient.post<refreshRes>(REFRESH_URL, data);
  return response.data;
};
