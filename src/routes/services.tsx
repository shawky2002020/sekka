import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { services } from "@/lib/services-data";
import { searchServices } from "@/lib/service-search";
import { ServiceCard } from "@/components/ServiceCard";
import { TrustNotice } from "@/components/TrustNotice";

export const Route = createFileRoute("/services")({
  validateSearch: z.object({ q: z.string().optional(), cat: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "الخدمات الحكومية سِكّة — خطة المشوار" },
      { name: "description", content: "تصفح كل الخدمات الحكومية وابدأ خطة المشوار المخصصة لك في مصر." },
    ],
  }),
  component: ServicesPage,
});

const CATEGORIES = ["كل الخدمات", "شغل وتأمينات", "أحوال مدنية", "مرور", "شهر عقاري وتوثيق", "تجارة وأعمال"];

function ServicesPage() {
  const { q: initialQ, cat: initialCat } = Route.useSearch();
  const [q, setQ] = useState(initialQ ?? "");
  const [cat, setCat] = useState<string>(initialCat ?? "كل الخدمات");

  const filtered = useMemo(() => {
    // 1. Prioritize smart search with normalizing and synonyms
    const rankedMatches = searchServices(q, services);
    const matchedServices = rankedMatches.map(m => m.service);

    // 2. Filter by category if selected
    return matchedServices.filter((s) => {
      const matchesCat = cat === "كل الخدمات" ? true : s.category === cat;
      return matchesCat;
    });
  }, [q, cat]);

  const live = filtered.filter((s) => !s.comingSoon);
  const soon = filtered.filter((s) => s.comingSoon);

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-8 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">الخدمات الحكومية</h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        المتطلبات والخطوات تختلف حسب المحافظة وحالتك الفردية. ابحث عن الإجراء ثم جاوب لتخصيص خطتك.
      </p>

      {/* Search Input with Synonym Labels */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition shadow-xs">
        <div className="grid h-10 w-10 place-items-center text-muted-foreground animate-pulse">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث: كعب العمل، رخصة، باسبور، فيش وتشبيه، توكيل…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              cat === c
                ? "border-primary bg-primary-soft text-primary shadow-xs"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {live.length === 0 && soon.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-xs">
          <h3 className="text-base font-bold text-foreground">المعذرة، مش لاقيين الخدمة دي لسه</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            جرب تبحث بكلمة تانية (مثلاً: ابحث بـ «باسبور» بدل جواز، أو «بطاقة» بدل شخصية)، أو اقترح علينا الإجراء لنجهزه فورًا.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link to="/suggest" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-xs">
              اقترح خدمة لإضافتها
            </Link>
            <button onClick={() => setQ("")} className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted/30">
              مسح البحث
            </button>
          </div>
        </div>
      ) : (
        <>
          {live.length > 0 && (
            <div className="mt-6 grid sm:grid-cols-2 gap-3 ">
              {live.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
          {soon.length > 0 && (
            <>
              <h3 className="mt-10 mb-3 text-sm font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                قريبًا جداً (تحت المراجعة الجنائية والقانونية):
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 opacity-80">
                {soon.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            </>
          )}
        </>
      )}

      <div className="mt-10">
        <TrustNotice />
      </div>
    </div>
  );
}
