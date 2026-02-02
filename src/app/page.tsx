import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/20">
      <header className="flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 py-3">
        <h1 className="text-xl font-bold text-primary">BIGS</h1>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">환영합니다</CardTitle>
              <CardDescription className="text-base">
                로그인하거나 새 계정을 만들어 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login" className="block">
                <Button className="w-full" size="lg">
                  로그인
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  회원가입
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
