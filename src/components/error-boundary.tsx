"use client"

/**
 * React Error Boundary
 *
 * 하위 트리에서 렌더링 중 발생한 예기치 않은 에러를 캐치하여 fallback UI를 표시합니다.
 * - fallback prop이 있으면 해당 노드를 렌더링
 * - 없으면 기본 "문제가 발생했습니다" 메시지와 "다시 시도" 버튼 표시
 * - handleRetry: 상태 초기화 후 children 다시 렌더링 시도
 */
import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center"
          role="alert"
        >
          <AlertCircle className="h-12 w-12 text-destructive" aria-hidden />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              문제가 발생했습니다
            </h2>
            <p className="text-sm text-muted-foreground">
              일시적인 오류가 발생했습니다. 다시 시도해 주세요.
            </p>
          </div>
          <Button onClick={this.handleRetry} variant="outline">
            다시 시도
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
