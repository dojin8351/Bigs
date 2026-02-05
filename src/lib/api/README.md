# API 클라이언트 사용 가이드

## 개요

`apiClient`는 자동으로 토큰을 헤더에 추가하고, 토큰이 만료되면 자동으로 갱신한 후 재요청하는 기능을 제공합니다.

## 사용 방법

### 게시판 API 예시

```typescript
// src/api/post.ts
import { apiClient } from "@/lib/api/client"

// 게시글 목록 조회
export const getPosts = async (page: number = 1) => {
  const response = await apiClient.get("/posts", {
    params: { page },
  })
  return response.data
}

// 게시글 작성
export const createPost = async (data: { title: string; content: string }) => {
  const response = await apiClient.post("/posts", data)
  return response.data
}

// 게시글 수정
export const updatePost = async (id: string, data: { title: string; content: string }) => {
  const response = await apiClient.put(`/posts/${id}`, data)
  return response.data
}

// 게시글 삭제
export const deletePost = async (id: string) => {
  const response = await apiClient.delete(`/posts/${id}`)
  return response.data
}
```

## 동작 방식

1. **요청 전**: `apiClient`는 자동으로 `Authorization: Bearer {accessToken}` 헤더를 추가합니다.

2. **401 에러 발생 시**:
   - 토큰이 만료되었는지 확인
   - `refreshToken`을 사용하여 새로운 토큰 발급
   - 새로운 토큰을 Zustand store에 저장
   - 원래 요청을 새로운 토큰으로 재시도

3. **동시 요청 처리**:
   - 여러 요청이 동시에 401 에러를 받으면, 첫 번째 요청만 refresh를 수행
   - 나머지 요청은 대기열에 추가되어 토큰 갱신 후 처리

4. **갱신 실패 시**:
   - refreshToken도 만료되었거나 유효하지 않으면
   - 자동으로 로그아웃 처리 (토큰 제거)

## 토큰 유틸리티 함수

### `isTokenExpired(token: string)`
토큰이 만료되었는지 확인합니다.

```typescript
import { isTokenExpired } from "@/lib/utils/jwt"

const token = useAuthStore.getState().accessToken
if (token && isTokenExpired(token)) {
  // 토큰이 만료됨
}
```

### `isTokenExpiringSoon(token: string, bufferSeconds?: number)`
토큰이 곧 만료될 예정인지 확인합니다 (기본값: 60초 전).

```typescript
import { isTokenExpiringSoon } from "@/lib/utils/jwt"

const token = useAuthStore.getState().accessToken
if (token && isTokenExpiringSoon(token, 120)) {
  // 120초 이내에 만료될 예정
}
```

### `ensureValidToken()`
토큰이 만료되었으면 자동으로 갱신합니다.

```typescript
import { ensureValidToken } from "@/lib/api/client"

const token = await ensureValidToken()
if (token) {
  // 유효한 토큰 사용 가능
} else {
  // 토큰 갱신 실패 또는 로그인 필요
}
```

## 주의사항

- **인증이 필요 없는 API** (로그인, 회원가입, refresh 등)는 `apiClient`를 사용하지 않고 일반 `axios`를 사용해야 합니다.
- `apiClient`는 자동으로 토큰을 관리하므로, 수동으로 토큰을 확인하거나 갱신할 필요가 없습니다.
