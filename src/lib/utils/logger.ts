/**
 * 개발 전용 로거 모듈
 *
 * NODE_ENV === "development" 일 때만 console.log/warn/error를 출력합니다.
 * 프로덕션 빌드에서는 모든 로그가 무시되어 성능 및 보안에 유리합니다.
 */
const isDev = process.env.NODE_ENV === "development"

/** 개발 환경에서만 동작하는 로그 유틸리티 */
export const devLog = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args)
  },
}
