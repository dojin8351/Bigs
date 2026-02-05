/**
 * 사용자-facing 메시지 상수
 *
 * Toast, 폼 에러, Alert 등에서 일관된 문구 사용
 */

/** API/서버 에러 시 표시 메시지 */
export const ERROR_MESSAGES = {
  SIGNUP_FAILED: "회원가입에 실패했습니다. 다시 시도해주세요.",
  LOGIN_FAILED: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
  POST_CREATE_FAILED: "게시글 작성에 실패했습니다. 다시 시도해주세요.",
  POST_UPDATE_FAILED: "게시글 수정에 실패했습니다. 다시 시도해주세요.",
  POST_DELETE_FAILED: "게시글 삭제에 실패했습니다. 다시 시도해주세요.",
  POST_FETCH_FAILED: "게시글을 불러오는데 실패했습니다. 다시 시도해주세요.",
} as const

/** 성공 시 Toast 등에 표시 메시지 */
export const SUCCESS_MESSAGES = {
  SIGNUP_COMPLETE: "회원가입이 성공적으로 완료되었습니다.",
  LOGIN_SUCCESS: "로그인에 성공했습니다.",
  POST_CREATE: "게시글이 등록되었습니다.",
  POST_UPDATE: "게시글이 수정되었습니다.",
  POST_DELETE: "게시글이 삭제되었습니다.",
} as const
