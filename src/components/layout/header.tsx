import Link from "next/link";
import { Menu, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "소개", href: "/about" },
  { label: "프로그램", href: "/programs" },
  { label: "코업", href: "/coop" },
  { label: "활동", href: "/activities" },
  { label: "소식", href: "/news" },
  { label: "입학 안내", href: "/admissions" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Nav */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" aria-label="홈" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">JHA (Korea)</span>
          </Link>
          <nav aria-label="주요 내비게이션" className="flex items-center gap-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-sm text-foreground/60 transition-colors hover:text-foreground/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기/닫기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="gap-6 px-6 py-8">
              <div className="border-border/60 border-b pb-4">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-bold">JHA (Korea)</span>
                </Link>
              </div>
              <nav
                aria-label="모바일 내비게이션"
                className="flex flex-col gap-5 text-base font-medium"
              >
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-sm py-2 text-foreground/80 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" aria-label="홈" className="flex items-center space-x-2">
            <span className="font-bold">JHA</span>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <Button asChild variant="ghost" size="icon">
              <a
                href="https://www.youtube.com/channel/UCStDxg4zE0jM5Gog4iEF-HQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="유튜브 채널 열기"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/admissions">입학 지원하기</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

