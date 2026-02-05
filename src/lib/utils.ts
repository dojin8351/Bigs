/**
 * Tailwind CSS 클래스 병합 유틸리티
 *
 * clsx로 조건부 클래스를 결합한 뒤 tailwind-merge로 충돌하는 Tailwind 클래스를
 * 올바르게 병합합니다. (예: "p-2"와 "p-4" → "p-4")
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** 조건부 Tailwind 클래스를 병합하여 반환 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
