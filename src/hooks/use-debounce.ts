import { useState, useEffect } from "react"

/**
 * 디바운스 훅
 *
 * value가 변경된 후 delay ms 동안 추가 변경이 없을 때만 debouncedValue를 갱신합니다.
 * 검색 입력 등 연속 입력 시 API 호출 횟수를 줄이는 데 사용합니다.
 *
 * @param value - 디바운스할 값 (예: 검색어)
 * @param delay - 지연 시간 (ms). 이 시간 내에 value가 다시 변경되면 타이머가 리셋됩니다.
 * @returns debounce된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
