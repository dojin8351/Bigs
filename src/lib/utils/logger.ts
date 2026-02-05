/**
 * 개발 환경에서만 콘솔 로그 출력
 * 프로덕션에서는 로그가 출력되지 않음
 */
const isDev = process.env.NODE_ENV === "development"

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
