import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { listPlans, type SavedPlan, removePlan } from "@/lib/saved-plans";
import { listSuggestions, type Suggestion } from "@/lib/suggestions";
import { listReports, type Report } from "@/lib/reports";
import { getService, services } from "@/lib/services-data";
import { 
  Shield, FileText, MessageSquare, AlertTriangle, Trash2, CheckCircle, Database, BarChart3, ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة تحكم سِكّة — Admin Lite" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"stats" | "plans" | "suggestions" | "reports">("stats");
  const [plans, setPlans] = useState<SavedPlan[]>(() => listPlans());
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => listSuggestions());
  const [reports, setReports] = useState<Report[]>(() => listReports());

  const handleRemovePlan = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الخطة المحفوظة؟")) {
      removePlan(id);
      setPlans(listPlans());
    }
  };

  // Analytics Computations
  const stats = useMemo(() => {
    return {
      totalServices: services.length,
      comingSoonServices: services.filter(s => s.comingSoon).length,
      liveServices: services.filter(s => !s.comingSoon).length,
      savedPlansCount: plans.length,
      suggestionsCount: suggestions.length,
      reportsCount: reports.length,
    };
  }, [plans, suggestions, reports]);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12 font-sans">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-white">
            <Shield className="h-6 w-6 text-indigo-400" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-foreground">لوحة تحكم سِكّة (النسخة الإرشادية)</h1>
            <p className="text-xs text-muted-foreground mt-0.5">مراجعة البيانات، المقترحات، وتقارير أخطاء السجلات المحلية.</p>
          </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
          <ArrowRight className="h-4 w-4" /> العودة للرئيسية
        </Link>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        
        {/* Navigation Sidebar Tabs */}
        <aside className="space-y-1.5">
          {[
            { id: "stats", label: "مُلخص الأداء", icon: <BarChart3 className="h-4 w-4" /> },
            { id: "plans", label: "الخطط المحفوظة كوكيز", count: stats.savedPlansCount, icon: <FileText className="h-4 w-4" /> },
            { id: "suggestions", label: "مقترحات الإجراءات", count: stats.suggestionsCount, icon: <MessageSquare className="h-4 w-4" /> },
            { id: "reports", label: "بلاغات أخطاء البيانات", count: stats.reportsCount, icon: <AlertTriangle className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-right flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-black text-white shadow-xs"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-indigo-900 text-indigo-100" : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Tab Contents */}
        <main className="min-w-0">
          
          {/* STATS ANALYTICS TAB */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">إجمالي الخدمات المتوفرة</span>
                  <p className="mt-2 text-3xl font-extrabold text-foreground">{stats.totalServices}</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <span className="text-success font-bold font-latin">{stats.liveServices}</span> سارية مجهزة · <span className="text-amber-600 font-bold font-latin">{stats.comingSoonServices}</span> قريبًا
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">الخطط المستخرجة للمواطنين</span>
                  <p className="mt-2 text-3xl font-extrabold text-foreground">{stats.savedPlansCount}</p>
                  <p className="mt-2 text-[10px] text-muted-foreground">مخزنة كليًا محليًا لحفظ الخصوصية.</p>
                </div>

                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                  <span className="text-xs text-muted-foreground font-semibold">تفاعل واقتراحات الخدمات</span>
                  <p className="mt-2 text-3xl font-extrabold text-foreground">{stats.suggestionsCount + stats.reportsCount}</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <span className="text-indigo-600 font-bold font-latin">{stats.suggestionsCount}</span> اقتراح · <span className="text-red-500 font-bold font-latin">{stats.reportsCount}</span> بلاغ تغيير
                  </div>
                </div>
              </div>

              {/* Quick instructions/credits */}
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 leading-relaxed text-xs text-muted-foreground space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-1.5 text-sm">
                  <Database className="h-4 w-4 text-primary" /> دليل تشغيل MVP سِكّة:
                </h4>
                <p>
                  اللوحة دي بتعرض اقتراحات المستخدمين وبلاغات عدم مطابقة الورق عشان تمكّن فريق تحرير سِكّة من تحديث قاعدة البيانات في الملف الثابت <strong className="font-bold text-foreground">services-data.ts</strong>.
                </p>
                <p>
                  بعد مراجعة أي بلاغ وتحديث الأوراق أو الرسوم، بيتم قفل البلاغ. في النسخ المستقبلية هيدخل الكلام ده على سيرفر مخصص وقاعدة بيانات سحابية متكاملة لجميع المحافظات.
                </p>
              </div>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === "plans" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-foreground">الخطط المحفوظة محليًا على جهازك</h2>
                <span className="text-xs text-muted-foreground">بروتوكول خصوصية سِكّة 🛡️</span>
              </div>
              
              {plans.length === 0 ? (
                <div className="p-8 text-center border rounded-2xl text-xs text-muted-foreground">
                  مفيش خطط محفوظة لسه. روح لصفحة الخدمات وابدأ خطة مشوار واحفظها عشان تظهر هنا.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {plans.map((p) => {
                    const s = getService(p.serviceId);
                    return (
                      <div key={p.id} className="p-4 border rounded-xl bg-card flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{s?.name || "خدمة غير معروفة"}</h4>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            حالة الجاهزية: <strong className="text-foreground">{p.readiness}%</strong> · تم الإنشاء: {new Date(p.createdAt).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link 
                            to="/plan/$id" 
                            params={{ id: p.id }}
                            className="bg-muted hover:bg-muted/75 text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            عرض الخطة
                          </Link>
                          <button
                            onClick={() => handleRemovePlan(p.id)}
                            className="text-danger hover:bg-danger-soft p-1.5 rounded-lg transition"
                            title="حذف الخطة"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUGGESTIONS TAB */}
          {activeTab === "suggestions" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground mb-2">مقترحات المستخدمين لخدمات جديدة</h2>

              {suggestions.length === 0 ? (
                <div className="p-8 text-center border rounded-2xl text-xs text-muted-foreground">
                  لا توجد مقترحات مدخلة لخدمات جديدة حتى الآن.
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((s) => (
                    <div key={s.id} className="p-4 border rounded-xl bg-card space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">جديد</span>
                          <h4 className="text-sm font-bold text-foreground mt-1">الإجراء: {s.procedure}</h4>
                          <p className="text-xs text-muted-foreground">المحافظة: {s.governorate} {s.knownOffice ? `· المقر التقديري: ${s.knownOffice}` : ""}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{new Date(s.createdAt).toLocaleDateString("ar-EG")}</span>
                      </div>
                      {s.problem && (
                        <p className="text-xs bg-muted/40 p-2.5 rounded-lg text-foreground/90 leading-relaxed">
                          <strong>المشكلة العائقة:</strong> {s.problem}
                        </p>
                      )}
                      {s.phone && (
                        <p className="text-[10px] text-muted-foreground font-mono">رقم تواصل العميل: {s.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground mb-2">بلاغات المواطنين عن اختلاف الأوراق والرسوم</h2>

              {reports.length === 0 ? (
                <div className="p-8 text-center border rounded-2xl text-xs text-muted-foreground">
                  لا توجد بلاغات مسجلة بخصوص أي اختلاف في المستندات حتي الآن. متسقة بالكامل!
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => {
                    const s = getService(r.serviceId);
                    return (
                      <div key={r.id} className="p-4 border rounded-xl bg-card space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">تبديل / اختلاف فى: {r.type}</span>
                            <h4 className="text-sm font-bold text-foreground mt-1">الخدمة المعنية: {s?.name || r.serviceId} ({r.governorate})</h4>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                        
                        <div className="text-xs bg-red-50/50 p-2.5 rounded-lg border border-red-100 text-foreground/90 leading-relaxed">
                          <strong>ما الذي تغير أو اختلف على الواقع؟</strong>
                          <p className="mt-1 font-bold text-red-700">{r.changed}</p>
                        </div>

                        {r.notes && (
                          <p className="text-xs text-muted-foreground leading-relaxed pl-2">
                            <strong>ملاحظات مكملة:</strong> {r.notes} (حصل إمتى: {r.occurredAt || "غير محدد"})
                          </p>
                        )}

                        {r.phone && (
                          <p className="text-[10px] text-muted-foreground font-mono">تليفون المُبلّغ: {r.phone}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
