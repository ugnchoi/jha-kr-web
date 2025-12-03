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
            <h3 className="mb-4 text-sm font-semibold">About</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-foreground">
                  History
                </Link>
              </li>
              <li>
                <Link href="/alumni" className="hover:text-foreground">
                  Alumni
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Programs</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/programs" className="hover:text-foreground">
                  All Programs
                </Link>
              </li>
              <li>
                <Link href="/coop" className="hover:text-foreground">
                  Co-op
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-foreground">
                  Activities
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/news" className="hover:text-foreground">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
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
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

