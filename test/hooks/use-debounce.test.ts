import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/hooks/use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("초기값을 즉시 반환한다", () => {
    const { result } = renderHook(() => useDebounce("initial", 500))
    expect(result.current).toBe("initial")
  })

  it("delay 후에 새 값이 반영된다", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    )

    expect(result.current).toBe("initial")

    rerender({ value: "updated", delay: 500 })
    expect(result.current).toBe("initial")

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe("updated")
  })

  it("delay 내에 값이 다시 변경되면 타이머가 리셋된다", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "first", delay: 500 } }
    )

    rerender({ value: "second", delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    rerender({ value: "third", delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe("first")

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current).toBe("third")
  })

  it("delay가 0이어도 동작한다", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 0 } }
    )

    rerender({ value: "b", delay: 0 })
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(result.current).toBe("b")
  })
})
