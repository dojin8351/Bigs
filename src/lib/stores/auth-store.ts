import { create } from "zustand"
import { persist } from "zustand/middleware"
import { extractUserFromToken, isTokenExpired } from "@/lib/utils/jwt"
import { devLog } from "@/lib/utils/logger"

interface UserInfo {
  name: string
  username: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserInfo | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setTokens: (accessToken, refreshToken) => {
        devLog.log("[AuthStore] 토큰 저장됨")

        const userInfo = extractUserFromToken(accessToken)
        if (!userInfo) {
          devLog.warn("[AuthStore] 토큰에서 사용자 정보를 추출할 수 없습니다.")
        }

        set({
          accessToken,
          refreshToken,
          user: userInfo,
          isAuthenticated: true,
        })
      },
      clearTokens: () => {
        devLog.log("[AuthStore] 토큰 제거")
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated })
      },
    }),
    {
      name: "auth-storage", // localStorage key
      // localStorage에서 복원된 후 실행되는 콜백
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { accessToken } = state
          
          // 토큰이 있으면 사용자 정보를 다시 추출하고 인증 상태를 복원
          if (accessToken) {
            devLog.log("[AuthStore] localStorage에서 토큰 복원 중...")
            
            // 토큰 만료 확인
            if (isTokenExpired(accessToken)) {
              devLog.warn("[AuthStore] 복원된 토큰이 만료되었습니다.")
              // 토큰이 만료되었으면 초기화 (토큰 갱신은 API 요청 시 자동으로 처리됨)
              state.accessToken = null
              state.refreshToken = null
              state.user = null
              state.isAuthenticated = false
              state.hasHydrated = true
              return
            }
            
            const userInfo = extractUserFromToken(accessToken)
            if (userInfo) {
              devLog.log("[AuthStore] 사용자 정보 복원됨")
              
              // 사용자 정보와 인증 상태 복원
              state.user = userInfo
              state.isAuthenticated = true
            } else {
              devLog.warn("[AuthStore] 복원된 토큰에서 사용자 정보를 추출할 수 없습니다.")
              // 토큰이 유효하지 않으면 초기화
              state.accessToken = null
              state.refreshToken = null
              state.user = null
              state.isAuthenticated = false
            }
          } else {
            // 토큰이 없으면 인증 상태 초기화
            state.isAuthenticated = false
            state.user = null
          }
          
          // hydration 완료 표시
          state.hasHydrated = true
        }
      },
    }
  )
)
