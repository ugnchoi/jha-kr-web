import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">JHA (Korea)</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering families through Christ-centered education and community.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">소개</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  사명
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-foreground">
                  연혁
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-foreground">
                  동문
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">프로그램</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/programs" className="hover:text-foreground">
                  전체 프로그램
                </Link>
              </li>
              <li>
                <Link href="/coop" className="hover:text-foreground">
                  코업
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-foreground">
                  활동
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">소식 · 문의</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/news" className="hover:text-foreground">
                  소식 및 행사
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-xs text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} JHA (Korea). All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              개인정보 처리방침
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              이용 약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

