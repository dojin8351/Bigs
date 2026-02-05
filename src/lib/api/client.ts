import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { refresh } from "@/api/auth"
import { useAuthStore } from "@/lib/stores/auth-store"
import { isTokenExpired } from "@/lib/utils/jwt"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

/**
 * 공개 API 클라이언트 (토큰 없이 호출)
 * 로그인, 회원가입 등 인증이 필요 없는 API에 사용
 */
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * 보호된 API 클라이언트 (토큰 자동 추가 및 갱신)
 * 게시판 등 인증이 필요한 API에 사용
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * 토큰 갱신 중인지 추적하는 플래그
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

/**
 * 대기 중인 요청들을 처리합니다.
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

/**
 * Request Interceptor: 요청 전에 accessToken을 헤더에 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // FormData인 경우 Content-Type을 제거하여 브라우저가 자동으로 boundary를 설정하도록 함
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor: 401 에러 시 토큰 갱신 후 재요청
 */
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // 401 에러이고, 이미 재시도한 요청이 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = useAuthStore.getState().refreshToken

      if (!refreshToken) {
        // refreshToken이 없으면 로그아웃 처리
        useAuthStore.getState().clearTokens()
        processQueue(error, null)
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        // 토큰 갱신 요청
        const response = await refresh({ refreshToken })
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response

        // 새로운 토큰 저장
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)

        // 대기 중인 요청들 처리
        processQueue(null, newAccessToken)

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        isRefreshing = false
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        useAuthStore.getState().clearTokens()
        processQueue(refreshError as AxiosError, null)
        isRefreshing = false
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

/**
 * 토큰이 만료되었는지 확인하고, 만료되었다면 자동으로 갱신합니다.
 * @returns 갱신된 accessToken 또는 null
 */
export async function ensureValidToken(): Promise<string | null> {
  const { accessToken, refreshToken } = useAuthStore.getState()

  if (!accessToken || !refreshToken) {
    return null
  }

  // 토큰이 만료되지 않았으면 그대로 반환
  if (!isTokenExpired(accessToken)) {
    return accessToken
  }

  // 토큰이 만료되었으면 갱신 시도
  try {
    const response = await refresh({ refreshToken })
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response

    useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)
    return newAccessToken
  } catch {
    // 갱신 실패 시 로그아웃 처리
    useAuthStore.getState().clearTokens()
    return null
  }
}
