/**
 * 입력 필드 최대 길이 상수 (스키마와 UI 일치)
 */
export const INPUT_LIMITS = {
  /** 이메일  */
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
