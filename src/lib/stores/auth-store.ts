import { create } from "zustand"
import { persist } from "zustand/middleware"
import { extractUserFromToken } from "@/lib/utils/jwt"

interface UserInfo {
  name: string
  username: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserInfo | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) => {
        console.log("[AuthStore] 토큰 저장:")
        console.log("  - accessToken:", accessToken)
        console.log("  - refreshToken:", refreshToken)

        // JWT 토큰에서 사용자 정보 추출
        const userInfo = extractUserFromToken(accessToken)
        if (userInfo) {
          console.log("[AuthStore] 사용자 정보 추출:")
          console.log("  - name:", userInfo.name)
          console.log("  - username:", userInfo.username)
        } else {
          console.warn("[AuthStore] 토큰에서 사용자 정보를 추출할 수 없습니다.")
        }

        set({
          accessToken,
          refreshToken,
          user: userInfo,
          isAuthenticated: true,
        })
      },
      clearTokens: () => {
        console.log("[AuthStore] 토큰 제거")
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
)
