/**
 * 입력 필드 최대 길이 상수
 *
 * Zod 스키마(.max)와 UI Input maxLength에 동일 값 사용하여
 * 클라이언트/서버 검증 일치
 */
export const INPUT_LIMITS = {
  /** 이메일 RFC 5321 최대 길이 */
  EMAIL: 254,
  /** 비밀번호 */
  PASSWORD: 128,
  /** 사용자 이름 */
  NAME: 50,
  /** 게시글 제목 */
  POST_TITLE: 200,
  /** 게시글 내용 */
  POST_CONTENT: 10000,
} as const
