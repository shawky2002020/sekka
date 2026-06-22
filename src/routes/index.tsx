import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, ArrowLeft, ShieldCheck, Clock, Route as RouteIcon, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { services } from "@/lib/services-data";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustNotice } from "@/components/TrustNotice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سِكّة — خلّص ورقك من أول مرة" },
      { name: "description", content: "خطة مشوار شخصية: الأوراق، الخطوات، الوقت المتوقع، والتحذيرات قبل أي مشوار حكومي في مصر." },
      { property: "og:title", content: "سِكّة — خلّص ورقك من أول مرة" },
      { property: "og:description", content: "اعرف الأوراق المطلوبة، الخطوات، الوقت، والتحذيرات قبل ما تنزل." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const popular = services.filter((s) => s.popular);
  const rest = services.filter((s) => !s.popular);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/services", search: { q } as never });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/40 via-background to-background" />
        <div className="mx-auto max-w-3xl px-4 md:px-6 pt-12 pb-10 md:pt-20 md:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground mb-5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            دليل مساعد — مش جهة حكومية
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            خلّص ورقك من أول مرة
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            سِكّة بتقولك الأوراق المطلوبة، الخطوات، الختم، الوقت المتوقع، والتحذيرات قبل ما تروح أي مصلحة.
          </p>

          <form onSubmit={onSubmit} className="mt-8 mx-auto max-w-xl">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-card)] focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition">
              <div className="grid h-10 w-10 place-items-center text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="اكتب اسم الإجراء… كعب العمل، بطاقة، رخصة"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
                ابدأ خطة المشوار
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>مش عارف اسم الإجراء؟</span>
              <Link to="/finder" className="text-primary hover:underline font-semibold">مساعد سِكّة الذكي</Link>
              <span className="opacity-50">·</span>
              <Link to="/services" className="text-primary hover:underline">تصفح الخدمات الشائعة</Link>
            </div>
          </form>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: RouteIcon, title: "خطة مرتبة", text: "خطوات بالترتيب" },
            { icon: Clock, title: "وقت متوقع", text: "ومستوى الزحام" },
            { icon: ShieldCheck, title: "تحذيرات", text: "أخطاء ترفض الطلب" },
            { icon: AlertTriangle, title: "حماية", text: "من السماسرة" },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-4">
              <f.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">الخدمات الشائعة</h2>
            <p className="text-sm text-muted-foreground mt-1">اللي بيسأل عنها الناس أكتر.</p>
          </div>
          <Link to="/services" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            كل الخدمات <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {popular.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>

        {rest.length > 0 && (
          <>
            <h3 className="mt-10 mb-4 text-sm font-semibold text-foreground">خدمات إضافية</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {rest.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </>
        )}
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-3xl px-4 md:px-6 py-8">
        <TrustNotice />
      </section>
    </div>
  );
}
