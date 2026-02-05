/**
 * 루트 레이아웃
 *
 * - Geist 폰트, QueryProvider, ThemeProvider, ErrorBoundary, Toaster(sonner) 적용
 * - html lang="ko", suppressHydrationWarning (next-themes SSR 대응)
 * - body overflow-x-hidden: 넓은 이미지 등으로 인한 페이지 가로 스크롤 방지
 */
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/lib/providers/query-provider"
import { ErrorBoundary } from "@/components/error-boundary"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOHYEON | 게시판",
  description: "DOHYEON 게시판 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster position="top-center" richColors closeButton />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
