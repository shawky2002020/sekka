import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Users, HelpCircle, Shield, Info, FileQuestion } from "lucide-react";
import { getService } from "@/lib/services-data";
import { Badge } from "@/components/Badge";
import { TrustNotice } from "@/components/TrustNotice";

export const Route = createFileRoute("/service/$id")({
  loader: ({ params }) => {
    const s = getService(params.id);
    if (!s) throw notFound();
    return { service: s };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `دليل استخراج ${loaderData?.service.name ?? "الخدمة"} في مصر — سِكّة` },
      { name: "description", content: loaderData?.service.description ?? "" },
    ],
  }),
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h2 className="text-xl font-semibold">الخدمة دي مش موجودة</h2>
      <Link to="/services" className="mt-4 inline-block text-primary hover:underline">ارجع للخدمات</Link>
    </div>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 font-sans">
      <Link to="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> كل الخدمات
      </Link>

      <div className="mt-4 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone="primary">{service.category}</Badge>
          <Badge tone="success">{service.trustLevel}</Badge>
          <Badge>{service.lastUpdated}</Badge>
        </div>
        <h1 className="mt-3 text-2xl md:text-3xl font-bold text-foreground leading-tight">{service.name}</h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">{service.description}</p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat icon={<Clock className="h-4 w-4 text-primary" />} label="الوقت المتوقع" value={service.averageDuration} />
          <Stat icon={<Users className="h-4 w-4 text-warning" />} label="الزحام المقدر" value={service.congestionLevel} />
          <Stat icon={<MapPin className="h-4 w-4 text-success" />} label="أفضل وقت للتقديم" value={service.bestTime} />
        </div>

        <div className="mt-6 rounded-xl bg-primary-soft/60 border border-primary/15 p-4 text-sm text-foreground">
          هنسألك <span className="font-semibold">{service.questions.length} أسئلة سريعة</span> عشان نخصصلك خطة المشوار بالظبط بناءً على وظيفتك وسنّك ومحافظتك.
        </div>

        <Link
          to="/service/$id/intake"
          params={{ id: service.id }}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm transition"
        >
          ابدأ خطة المشوار الشخصية
        </Link>
      </div>

      {/* SEO / HELPFUL FAQ & GUIDELINES BELOW CTA */}
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            معلومات تهمك عن إجراء {service.name}
          </h2>

          <div className="divide-y divide-border text-sm leading-relaxed space-y-4">
            
            <div className="pt-3">
              <h3 className="font-bold text-foreground flex items-center gap-1.5 text-xs text-primary mb-1">
                <FileQuestion className="h-4 w-4" /> مين الموظف المختص اللي هتتعامل معاه؟
              </h3>
              <p className="text-muted-foreground text-xs">
                في أغلب المقرات، بيتم المراجعة أولاً لدى موظف الاستقبال أو الاستعلامات لمطابقة أصل الأوراق، ثم التوجه للخزينة لدفع الرسوم الحكومية، تليها الخطوة الفنية كالتصوير أو البصمة أو تقديم الملف لرئيس القسم للختم وصرف المستند النهائي.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-foreground flex items-center gap-1.5 text-xs text-primary mb-1">
                <Shield className="h-4 w-4" /> إزاي سِكّة بتضمن تخلص مشوارك من غير بهدلة؟
              </h3>
              <p className="text-muted-foreground text-xs">
                المنصة بتحلل حالتك الشخصية؛ فلو طالب أو خريج أو ربة منزل أو عاطل، الأوراق والدمغات والخطوات الحقيقية بتختلف تماماً. سِكّة مبنية على فرز الأسئلة بشكل تنازلي تفاعلي بيوصلك لخطتك الشاملة لفرع محافظتك بدون أخطاء إدارية.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="font-bold text-foreground flex items-center gap-1.5 text-xs text-primary mb-1">
                <HelpCircle className="h-4 w-4" /> نصيحة سريعة في المقر الحكومي:
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                حاول تجهيز فكة نقدية كافية لأن الخزينة بنسبة كبيرة لا تدعم بطاقات الدفع الإلكتروني في بعض الفروع، واصطحب معك قلم حبر جاف أزرق لملء استمارات الطلبات مجانًا دون الحاجة لشرائه بضعف ثمنه بالخارج.
              </p>
            </div>

          </div>
        </div>

        <TrustNotice />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3 shadow-xs">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">{icon}<span>{label}</span></div>
      <p className="mt-1 text-xs font-bold text-foreground">{value}</p>
    </div>
  );
}
