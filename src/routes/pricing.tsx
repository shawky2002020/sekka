import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Shield, Zap, Building2, User } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "أسعار باقات سِكّة — وفّر وقتك ومجهودك" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4">باقات مصممة عشان توفر وقتك</h1>
        <p className="text-base text-muted-foreground">
          سواء كنت فرد بيخلص ورقه أو شركة بتعاين موظفين جداد، عندنا الباقة المناسبة ليك عشان تخلص من أول مرة.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* B2C Pricing */}
        <div className="border border-border bg-card rounded-3xl p-8 relative shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-muted px-4 py-1 rounded-full text-xs font-bold text-muted-foreground flex items-center gap-1.5 border border-border">
            <User className="h-3.5 w-3.5" /> للأفراد
          </div>
          
          <h2 className="text-2xl font-bold mb-2">الأساسي</h2>
          <p className="text-sm text-muted-foreground mb-6">دليل مجاني دايماً لتخليص أوراقك الشخصية</p>
          
          <div className="mb-6">
            <span className="text-4xl font-black font-latin">0</span>
            <span className="text-lg text-muted-foreground"> ج.م</span>
          </div>

          <ul className="space-y-3 mb-8">
            <Feature>البحث في كل الخدمات المتاحة</Feature>
            <Feature>معرفة الأوراق المطلوبة والخطوات</Feature>
            <Feature>تقييم الجاهزية</Feature>
            <Feature>حفظ الخطط محلياً على جهازك</Feature>
          </ul>

          <Link to="/services" className="w-full flex justify-center items-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold px-4 py-3 transition">
            ابدأ مجاناً
          </Link>
        </div>

        {/* B2B Pricing */}
        <div className="border-2 border-primary bg-card rounded-3xl p-8 relative shadow-lg scale-[1.02]">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary px-4 py-1 rounded-full text-xs font-bold text-primary-foreground flex items-center gap-1.5 shadow-sm">
            <Building2 className="h-3.5 w-3.5" /> للشركات (HR)
          </div>
          <div className="absolute top-4 left-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-lg">
            الأكثر توفيراً
          </div>
          
          <h2 className="text-2xl font-bold mb-2">باقة الأعمال</h2>
          <p className="text-sm text-muted-foreground mb-6">وفر أيام عمل الموظفين الضايعة بسبب الورق</p>
          
          <div className="mb-6 flex items-end gap-1">
            <span className="text-4xl font-black font-latin text-primary">500</span>
            <span className="text-sm text-muted-foreground mb-1">ج.م / شهرياً</span>
          </div>

          <ul className="space-y-3 mb-8">
            <Feature highlight>كل مميزات الباقة الأساسية</Feature>
            <Feature>إدارة أوراق فريق العمل من مكان واحد</Feature>
            <Feature>توليد قوائم جاهزية سريعة للموظفين</Feature>
            <Feature>تتبع حالات الإجراءات</Feature>
            <Feature>دعم فني مخصص لتحديثات القوانين</Feature>
          </ul>

          <Link to="/b2b" className="w-full flex justify-center items-center rounded-xl bg-primary text-primary-foreground font-bold px-4 py-3 hover:opacity-90 transition shadow-sm">
            ابدأ مع باقة الأعمال
          </Link>
        </div>

      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto p-6 bg-muted/30 rounded-2xl border border-border">
        <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-2">ضمان الجاهزية</h3>
        <p className="text-sm text-muted-foreground">
          معلوماتنا بتتحدث باستمرار، لو لقيت حاجة مختلفة بلغنا وهنصلحها فوراً عشان نحمي وقت الناس اللي بعدك.
        </p>
      </div>
    </div>
  );
}

function Feature({ children, highlight }: { children: React.ReactNode, highlight?: boolean }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <div className={`mt-0.5 shrink-0 rounded-full p-0.5 ${highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
        <Check className="h-3.5 w-3.5" />
      </div>
      <span className={highlight ? 'font-bold' : 'text-muted-foreground'}>{children}</span>
    </li>
  );
}
