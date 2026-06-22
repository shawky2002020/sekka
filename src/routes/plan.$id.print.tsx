import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { answerLabel, buildTripPlan, getService, visibleQuestions, type Service, type TripPlan } from "@/lib/services-data";
import { getPlan, type SavedPlan } from "@/lib/saved-plans";
import { getOfficeGuidance } from "@/lib/offices-data";
import { ArrowLeft, Printer } from "lucide-react";

export const Route = createFileRoute("/plan/$id/print")({
  head: () => ({ meta: [{ title: "نسخة للطباعة — سِكّة" }] }),
  component: PrintPage,
});

function PrintPage() {
  const { id } = Route.useParams();
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getPlan(id);
    if (p) {
      setPlan(p);
      setService(getService(p.serviceId) ?? null);
      setChecked(p.checkedItems ?? {});
    } else {
      const sid = id.split("-").slice(0, -1).join("-") || id;
      const s = getService(sid);
      if (s) setService(s);
    }
    setLoading(false);
  }, [id]);

  const trip: TripPlan | null = useMemo(
    () => (service ? buildTripPlan(service, plan?.answers ?? {}, checked) : null),
    [service, plan, checked]
  );

  const officeGuidance = getOfficeGuidance(service?.category || "", plan?.answers?.gov || "other", service?.id);

  // Automatically open browser print dialog when loaded
  useEffect(() => {
    if (!loading && service) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          window.print();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, service]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 font-sans">
        جاري تهيئة نسخة الطباعة لمشوارك…
      </div>
    );
  }

  if (!service || !trip) {
    return (
      <div className="p-12 text-center font-sans max-w-sm mx-auto">
        <h2 className="text-lg font-bold text-gray-900">الخطة غير متوفرة</h2>
        <Link to="/services" className="mt-4 inline-block text-sm text-primary underline">
          العودة للخدمات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans direction-rtl text-right print:p-0">
      
      {/* Screen only navigation header */}
      <div className="mb-8 flex items-center justify-between border-b pb-4 print:hidden">
        <Link to="/plan/$id" params={{ id }} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-black transition">
          <ArrowLeft className="h-4 w-4" /> العودة لخطة المشوار التفاعلية
        </Link>
        <button 
          onClick={() => window.print()} 
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
        >
          <Printer className="h-4 w-4" /> اطبع الآن
        </button>
      </div>

      {/* Print Document Content */}
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Document Header */}
        <div className="border-b-4 border-black pb-4 text-center sm:text-right">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              مُلخّص مشوار: {service.name}
            </h1>
            <span className="text-xs font-mono font-bold text-gray-600 mt-2 sm:mt-0">
              سِكّة — طريقك الصح
            </span>
          </div>
          
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-700 bg-gray-50 p-3 rounded-lg border">
            <div>المحافظة: {trip.governorateLabel || "الكل"}</div>
            <div>الوقت المتوقع: {service.averageDuration}</div>
            <div>أفضل وقت للذهاب: {service.bestTime}</div>
            <div>معدل الموثوقية: مراجعة تجريبية حديثة</div>
          </div>
        </div>

        {/* جاهز أنزل؟ */}
        {trip.todayDecision && (
          <div className="p-4 border rounded-xl bg-gray-50/50">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900">
               حالة الجاهزية للنزول اليوم: [ {trip.todayDecision.title} ]
            </h3>
            <p className="mt-1.5 text-xs text-gray-700 leading-relaxed font-medium">
              {trip.todayDecision.description}
            </p>
          </div>
        )}

        {/* المستندات والتحققات */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold border-b-2 border-black pb-1 uppercase tracking-wide">
             أولاً: المستندات والأوراق المطلوبة للتقديم
          </h2>
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="py-2 px-3 font-bold w-[35%]">المستند / الورقة</th>
                <th className="py-2 px-3 font-bold w-[25%]">الحالة المطلوبة</th>
                <th className="py-2 px-3 font-bold">تعليمات وتنبيهات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {trip.documents.map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-semibold text-black flex items-center gap-1.5">
                    <span className="inline-block h-3.5 w-3.5 rounded border border-gray-400 shrink-0" />
                    {doc.name}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    {doc.badges.join(", ")}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 leading-relaxed">
                    {doc.note} {doc.conditionalLabel ? `(${doc.conditionalLabel})` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* خطوات التحضير */}
        {service.prep.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-base font-extrabold border-b-2 border-black pb-1">
               ثانياً: خطوات مسبقة قبل التوجّه للمقر
            </h2>
            <ul className="space-y-1 text-xs text-gray-800 list-decimal list-inside pr-1">
              {service.prep.map((p, i) => (
                <li key={i} className="leading-relaxed">
                  <span className="font-semibold">{p}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* تروح فين؟ */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold border-b-2 border-black pb-1">
             ثالثاً: المقر الحكومي وخطوات إنهاء الإجراء
          </h2>
          {officeGuidance.office ? (
            <div className="p-3 border rounded-lg bg-gray-50 text-xs text-gray-800 space-y-1">
              <p className="font-bold text-black text-sm">المقر التابع لك: {officeGuidance.office.name}</p>
              <p>العنوان: {officeGuidance.office.area} · {officeGuidance.office.notes}</p>
              <p className="font-semibold text-gray-900">مواعيد وساعات العمل بالفرع: {officeGuidance.office.workingHoursNote}</p>
              {officeGuidance.office.cautionNote && (
                <p className="text-xs text-gray-600 mt-1 italic">💡 ملحوظة: {officeGuidance.office.cautionNote}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed">
              {officeGuidance.guidanceText}
            </p>
          )}

          <div className="pt-2">
            <h4 className="text-xs font-bold text-gray-700 mb-2">تسلسل خطوات تسيير المشوار:</h4>
            <ol className="space-y-2.5 text-xs list-decimal list-inside pr-2 text-gray-800">
              {service.routeSteps.map((step, i) => (
                <li key={i} className="leading-relaxed font-semibold">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* الرسوم وتحذيرات رفض الإجراء */}
        <div className="grid sm:grid-cols-2 gap-6 text-xs pt-4">
          
          <div className="space-y-2 border-t border-black pt-3">
            <h3 className="font-bold text-black uppercase">الرسوم الإرشادية والمصاريف:</h3>
            <p className="text-gray-700 leading-relaxed">{service.feesNote}</p>
            <p className="text-xs text-gray-500 italic">ملاحظة: لضمان حقك سدد داخل الفرع حصراً واطلب وصلاً رسمياً.</p>
          </div>

          <div className="space-y-2 border-t border-black pt-3">
            <h3 className="font-bold text-black uppercase">أخطاء متكررة تؤدي لرفض المعاملة:</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              {service.mistakes.map((m, i) => (
                <li key={i} className="leading-relaxed">{m}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t pt-8 mt-12 text-center text-[10px] text-gray-500 space-y-1">
          <p>تم استخراج هذه الخدمة وتنظيمها إلكترونياً بواسطة منصة سِكّة — طريقك الصح قبل أي مشوار حكومي.</p>
          <p>سِكّة دليل إرشادي مبني على التجارب الفعلية، يرجى التثبت من اللوحات الإرشادية بداخل مفر السجل دائماً.</p>
        </div>

      </div>
    </div>
  );
}
