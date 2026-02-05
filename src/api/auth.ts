/**
 * 인증 관련 API 모듈
 *
 * - signUp: 회원가입 (토큰 불필요)
 * - login: 로그인 (accessToken, refreshToken 반환)
 * - refresh: accessToken 만료 시 refreshToken으로 갱신
 *
 * 모든 엔드포인트는 publicApiClient 사용 (Authorization 헤더 없음)
 */
import { publicApiClient } from "@/lib/api/client";
import type {
  signUpReq,
  signUpRes,
  loginReq,
  refreshReq,
  refreshRes,
} from "@/types/auth";

/** API 경로 상수 */
const SIGNUP_URL = "/auth/signup";
const LOGIN_URL = "/auth/signin";
const REFRESH_URL = "/auth/refresh";

/**
 * 회원가입 API
 *
 * @param data - username(이메일), name, password, confirmPassword
 * @returns 성공 시 void (200 OK, 응답 body 없음)
 * @throws API 에러 시 상위로 전파
 */
export const signUp = async (data: signUpReq): Promise<void> => {
  const response = await publicApiClient.post(SIGNUP_URL, data);
  return response.data;
};

/**
 * 로그인 API
 *
 * @param data - username(이메일), password
 * @returns accessToken, refreshToken
 * @throws 인증 실패 시 401 등 에러
 */
export const login = async (data: loginReq): Promise<signUpRes> => {
  const response = await publicApiClient.post<signUpRes>(LOGIN_URL, data);
  return response.data;
};

/**
 * 토큰 갱신 API
 *
 * accessToken 만료 시 refreshToken으로 새 토큰 쌍 발급.
 * apiClient의 401 인터셉터에서 자동 호출됨.
 *
 * @param data - refreshToken
 * @returns 새로운 accessToken, refreshToken
 * @throws refreshToken 만료/무효 시 에러
 */
export const refresh = async (data: refreshReq): Promise<refreshRes> => {
  const response = await publicApiClient.post<refreshRes>(REFRESH_URL, data);
  return response.data;
};
