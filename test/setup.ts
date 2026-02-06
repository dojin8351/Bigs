import "@testing-library/jest-dom/vitest"
import React from "react"
import { vi } from "vitest"

// devLog 모킹 (jwt.test.ts에서 console 출력 방지)
vi.mock("@/lib/utils/logger", () => ({
  devLog: {
    error: vi.fn(),
    warn: vi.fn(),
    log: vi.fn(),
  },
}))

// next/image 모킹 (컴포넌트 테스트용)
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) =>
    React.createElement("img", {
      ...props,
      "data-testid": "next-image",
    }),
}))
