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
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background/95 to-accent/10 dark:from-background dark:via-background/98 dark:to-accent/5">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-6 py-4">
        <h1 className="text-2xl font-bold text-primary transition-all hover:opacity-80">
          DOHYEON
        </h1>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5 dark:shadow-primary/10">
            <CardHeader className="space-y-3 text-center pb-6">
              <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                환영합니다
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground/80">
                로그인하거나 새 계정을 만들어 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/login" className="block">
                <Button 
                  className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
                  size="lg"
                >
                  로그인
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium border-2 hover:bg-accent/50 transition-all duration-300" 
                  size="lg"
                >
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
