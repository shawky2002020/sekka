import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bookmark, Home, MessageSquareWarning, Search } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <LogoMark />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-foreground">سِكّة</span>
            <span className="hidden sm:block text-[11px] text-muted-foreground">طريقك الصح قبل أي مشوار</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/services">الخدمات</NavLink>
          <NavLink to="/saved">خططي</NavLink>
          <NavLink to="/report">بلّغنا</NavLink>
          <NavLink to="/about">عن سِكّة</NavLink>
        </nav>
        <Link
          to="/services"
          className="hidden md:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
        >
          ابدأ خطة مشوار
        </Link>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      activeProps={{ className: "text-foreground bg-muted" }}
      inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-muted/60" }}
      className="rounded-md px-3 py-2 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <div className="grid grid-cols-4 text-[11px]">
        <BottomItem to="/" icon={<Home className="h-5 w-5" />} label="الرئيسية" exact />
        <BottomItem to="/services" icon={<Search className="h-5 w-5" />} label="الخدمات" />
        <BottomItem to="/saved" icon={<Bookmark className="h-5 w-5" />} label="خططي" />
        <BottomItem to="/report" icon={<MessageSquareWarning className="h-5 w-5" />} label="بلّغنا" />
      </div>
    </nav>
  );
}

function BottomItem({ to, icon, label, exact }: { to: string; icon: ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      activeProps={{ className: "text-primary" }}
      inactiveProps={{ className: "text-muted-foreground" }}
      className="flex flex-col items-center justify-center gap-1 py-2.5"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="hidden md:block border-t border-border mt-12">
      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-4 sm:grid-cols-[1fr_auto] items-start">
        <div className="text-xs text-muted-foreground leading-relaxed max-w-md">
          <p className="text-sm font-semibold text-foreground">سِكّة — طريقك الصح قبل أي مشوار حكومي</p>
          <p className="mt-1">سِكّة دليل مساعد وليست جهة حكومية. المعلومات قد تختلف حسب المحافظة أو المكتب.</p>
        </div>
        <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">عن سِكّة</Link>
          <Link to="/help" className="hover:text-foreground">المساعدة</Link>
          <Link to="/privacy" className="hover:text-foreground">الخصوصية</Link>
          <Link to="/terms" className="hover:text-foreground">الشروط</Link>
          <Link to="/report" className="hover:text-foreground">بلّغ عن معلومة</Link>
          <Link to="/suggest" className="hover:text-foreground">اقترح خدمة</Link>
        </nav>
      </div>
    </footer>
  );
}

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div className={`${className} grid place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm`}>
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M5 19c2.5-3 5-3 7 0s4.5 3 7 0" />
        <circle cx="5" cy="19" r="1" fill="currentColor" />
        <circle cx="19" cy="19" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}
