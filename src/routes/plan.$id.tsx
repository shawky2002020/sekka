import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowLeft, Check, CheckCircle2, ClipboardCheck, Clock, FileText,
  MapPin, MessageSquare, Pencil, ShieldAlert, Share2, Sparkles, Wallet, X,
  Printer, CheckSquare, HelpCircle, AlertOctagon
} from "lucide-react";
import { answerLabel, buildTripPlan, getService, visibleQuestions, type Service, type TripPlan } from "@/lib/services-data";
import { getPlan, savePlan, updatePlan, type SavedPlan } from "@/lib/saved-plans";
import { getOfficeGuidance } from "@/lib/offices-data";
import { Badge, badgeToneFor } from "@/components/Badge";
import { TrustNotice } from "@/components/TrustNotice";

export const Route = createFileRoute("/plan/$id")({
  head: () => ({ meta: [{ title: "خطة مشوارك — سِكّة" }] }),
  component: PlanPage,
});

function PlanPage() {
  const { id } = Route.useParams();
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  // Load plan/service from id
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

  // Compute computed trip plan dynamically with checked items passed in
  const trip: TripPlan | null = useMemo(
    () => (service ? buildTripPlan(service, plan?.answers ?? {}, checked) : null),
    [service, plan, checked]
  );

  // Compute readiness from documents + checked items.
  const totalChecks = trip ? trip.documents.length + (service?.readyChecklist.length ?? 0) : 0;
  
  let doneChecks = 0;
  trip?.documents.forEach((_, idx) => {
    if (checked[`doc-${idx}`]) doneChecks++;
  });
  service?.readyChecklist?.forEach((_, idx) => {
    if (checked[`r${idx}`]) doneChecks++;
  });

  const readiness = totalChecks === 0 ? 0 : Math.round((doneChecks / totalChecks) * 100);

  // Persist checked items & readiness whenever they change
  useEffect(() => {
    if (!plan) return;
    updatePlan(plan.id, { checkedItems: checked, readiness });
  }, [checked, readiness, plan]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    if (!plan && service) {
      const newId = savePlan({ serviceId: service.id, answers: {}, readiness, checkedItems: checked });
      const p = getPlan(newId);
      if (p) setPlan(p);
      showToast("تم حفظ خطة المشوار ✅");
      return;
    }
    if (plan) {
      updatePlan(plan.id, { checkedItems: checked, readiness });
      showToast("تم تحديث الخطة وحفظ تقدمك ✅");
    }
  };

  const handleShare = async () => {
    if (!trip) return;
    const text = trip.shareText;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `سِكّة — خطة مشوار ${service?.name}`, text });
        return;
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("تم نسخ الخطة لمشاركتها على واتساب 📋");
    } catch {
      showToast("ما قدرناش ننسخ الملخص");
    }
  };

  const handleWhatsApp = () => {
    if (!trip) return;
    const url = `https://wa.me/?text=${encodeURIComponent(trip.shareText)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-muted-foreground font-sans">
        بنحمّل خطة مشوارك…
      </div>
    );
  }

  if (!service || !trip) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center font-sans">
        <h2 className="text-xl font-semibold text-foreground">الخطة دي مش موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          ممكن تكون اتحذفت من الجهاز أو الرابط قديم. ابدأ خطة جديدة واحفظها قبل ما تنزل.
        </p>
        <Link to="/services" className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          ابدأ خطة جديدة
        </Link>
      </div>
    );
  }

  const govLabel = trip.governorateLabel;
  
  // Specific government office lookup based on user's governorate
  const officeGuidance = getOfficeGuidance(service.category, plan?.answers?.gov || "other", service.id);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 md:py-10 font-sans">
      <div className="flex items-center justify-between">
        <Link to="/service/$id" params={{ id: service.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> رجوع للخدمة
        </Link>
        <Link 
          to="/plan/$id/print" 
          params={{ id }}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <Printer className="h-4 w-4" /> نسخة للطباعة (PDF)
        </Link>
      </div>

      <div className="mt-4 grid lg:grid-cols-[1fr_325px] gap-6">
        <div className="space-y-6 min-w-0">
          
          {/* Main Plan Header Card */}
          <header className="rounded-3xl border border-border bg-card p-6 md:p-8 relative overflow-hidden shadow-sm">
            <Badge tone="primary">خطة المشوار الذكية</Badge>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {service.name}{govLabel ? ` — ${govLabel}` : ""}
            </h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
              بناءً على إجاباتك، دي الخطة الأقرب عشان تخلص {service.name} من غير مشوار زيادة.
            </p>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryStat icon={<Clock className="h-4 w-4 text-primary" />} label="الوقت المتوقع" value={service.averageDuration} />
              <SummaryStat icon={<MapPin className="h-4 w-4 text-warning" />} label="مستوى الزحام" value={service.congestionLevel}
                tone={service.congestionLevel === "مرتفع" ? "warning" : "neutral"} />
              <SummaryStat icon={<Sparkles className="h-4 w-4 text-success" />} label="أفضل وقت" value={service.bestTime} />
              <SummaryStat icon={<CheckCircle2 className="h-4 w-4 text-success" />} label="الجاهزية" value={`${readiness}%`} tone="success" />
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground">آخر مراجعة للبيانات: {service.lastUpdated} · {service.trustLevel}</p>
          </header>

          {/* SIGNATURE FEATURE: جاهز أنزل النهارده؟ */}
          {trip.todayDecision && (
            <div className={`rounded-2xl border ${trip.todayDecision.borderColor} ${trip.todayDecision.bgColor} p-6 transition-all shadow-sm`}>
              <div className="flex gap-4">
                <div className="mt-1">
                  {trip.todayDecision.status === "ready" && (
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-success text-success-foreground">
                      <CheckCircle2 className="h-6 w-6" />
                    </span>
                  )}
                  {trip.todayDecision.status === "almost" && (
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                      <Sparkles className="h-6 w-6" />
                    </span>
                  )}
                  {trip.todayDecision.status === "wait" && (
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-warning text-warning-foreground">
                      <AlertTriangle className="h-6 w-6" />
                    </span>
                  )}
                  {trip.todayDecision.status === "rejected" && (
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-danger text-danger-foreground">
                      <AlertOctagon className="h-6 w-6" />
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">
                    جاهز أنزل النهارده؟
                    <span className="mr-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full border border-current opacity-85">
                      {trip.todayDecision.status === "ready" ? "جاهز تمامًا" :
                       trip.todayDecision.status === "almost" ? "شبه جاهز" :
                       trip.todayDecision.status === "wait" ? "مؤجل مؤقتًا" : "هترجع فاضي"}
                    </span>
                  </h3>
                  
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    {trip.todayDecision.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-dashed border-foreground/10 flex items-center justify-between text-xs text-foreground/80">
                    <span>تحرك في أفضل وقت: <strong className="text-foreground">{service.bestTime}</strong> لتجنب الطوابير.</span>
                    <span>جاهزية: <strong>{readiness}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional notes from answers */}
          {trip.notes.length > 0 && (
            <div className="space-y-2">
              {trip.notes.map((n, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-3 text-sm leading-relaxed flex items-start gap-2.5 ${
                    n.tone === "warning"
                      ? "border-warning/30 bg-warning-soft/60 text-foreground"
                      : "border-primary/20 bg-primary-soft/40 text-foreground"
                  }`}
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <div>{n.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* قبل ما تنزل */}
          {service.prep.length > 0 && (
            <Section title="خطوات التحضير قبل ما تنزل" icon={<ClipboardCheck className="h-5 w-5" />}>
              <ul className="space-y-2.5">
                {service.prep.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-semibold text-xs">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* الأوراق المطلوبة والتشك لست */}
          <Section title="الأوراق المطلوبة (علّم على الجاهز معاك)" icon={<FileText className="h-5 w-5" />}>
            <ul className="divide-y divide-border">
              {trip.documents.map((doc, i) => {
                const key = `doc-${i}`;
                const isChecked = !!checked[key];
                const isRequired = doc.badges.includes("مطلوب") || doc.badges.includes("مهم");
                return (
                  <li key={key} className="py-3.5 first:pt-0 last:pb-0 transition hover:bg-muted/10 px-1 rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex items-start gap-3">
                        <button
                          onClick={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                          aria-label={`تأكيد ${doc.name}`}
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                            isChecked 
                              ? "bg-success border-success text-success-foreground" 
                              : isRequired 
                                ? "border-amber-500/50 bg-amber-500/5" 
                                : "border-border"
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </button>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold flex items-center gap-1.5 ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {doc.name}
                            {isRequired && !isChecked && <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" title="مستند إلزامي" />}
                          </p>
                          <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{doc.note}</p>
                          {doc.conditionalLabel && (
                            <p className="mt-1.5 text-[11px] text-primary/80 bg-primary-soft/50 w-fit px-1.5 py-0.5 rounded-md font-medium">{doc.conditionalLabel}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 shrink-0 justify-end max-w-[45%]">
                        {doc.badges.map((b) => <Badge key={b} tone={badgeToneFor(b)}>{b}</Badge>)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>

          {/* تروح فين؟ - المقر الحكومي المحدد أو الإرشاد التفصيلي */}
          <Section title="تروح فين؟ ومواعيد العمل" icon={<MapPin className="h-5 w-5" />}>
            {officeGuidance.office ? (
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-primary-soft text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-foreground"> المقر الحكومي المقترح لمحافظتك:</h4>
                    <p className="text-base font-bold text-primary">{officeGuidance.office.name}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2 text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">العنوان والتغطية الجغرافية:</span>
                    <p className="text-foreground font-medium">{officeGuidance.office.area}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{officeGuidance.office.notes}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">ساعات العمل:</span>
                    <p className="text-foreground font-semibold text-success">{officeGuidance.office.workingHoursNote}</p>
                  </div>
                </div>

                {officeGuidance.office.cautionNote && (
                  <div className="rounded-lg bg-warning-soft/40 border border-warning/20 p-3 text-xs leading-relaxed text-foreground/95">
                    <strong>💡 خد بالـك في المقر ده:</strong> {officeGuidance.office.cautionNote}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
                <HelpCircle className="h-5 w-5 text-primary mb-2" />
                {officeGuidance.guidanceText}
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">خطوات المشوار الإجرائية:</h4>
              <ol className="relative space-y-4">
                {service.routeSteps.map((step, i) => (
                  <li key={i} className="relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold font-latin">{i + 1}</span>
                      {i < service.routeSteps.length - 1 && <span className="mt-1 w-px flex-1 bg-border min-h-6" />}
                    </div>
                    <p className="pt-1 text-sm text-foreground leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            
            <p className="mt-4 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              {service.routeNote ?? "العنوان الدقيق يتغير حسب مربعك الإداري. في النسخة القادمة هندعم الإحداثيات والخرائط المباشرة لجميع المحافظات."}
            </p>
          </Section>

          {/* الرسوم بالتفصيل ومستوى الهدر المالي */}
          <Section title="الرسوم المتوقعة ومستوى الأمان المالي" icon={<Wallet className="h-5 w-5" />}>
            <div className="rounded-xl border border-warning/30 bg-warning-soft/60 p-4 text-sm text-foreground leading-relaxed">
              {service.feesNote}
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              * الأرقام المذكورة إرشادية وتخضع للتغيرات الطفيفة. ادفع دائمًا داخل منافذ الدفع المعتمدة واحصل على وصل سداد مالي مطبوع رسمي لضمان حقك وتجنب أي نوع من الابتزاز.
            </p>
          </Section>

          {/* أخطاء شائعة تجنبها لضمان المشوار */}
          {service.mistakes.length > 0 && (
            <Section title="أخطاء إدارية شائعة تسبب رفض الطلب" icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}>
              <ul className="space-y-2.5">
                {service.mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-danger-soft text-danger">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* مكافحة النصب والاحتيال */}
          {service.scamWarning && (
            <div className="rounded-2xl border border-danger/20 bg-danger-soft/60 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5.5 w-5.5 shrink-0 text-danger" />
                <div>
                  <h3 className="text-base font-bold text-foreground">تنبيه حماية سِكّة: تجنب السماسرة</h3>
                  <p className="mt-1.5 text-sm text-foreground/85 leading-relaxed">{service.scamWarning}</p>
                </div>
              </div>
            </div>
          )}

          {/* إجاباتك كاملة */}
          {plan && (
            <Section title="الإجابات القانونية المدخلة" icon={<MessageSquare className="h-5 w-5" />}>
              <button
                onClick={() => setShowAnswers((v) => !v)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {showAnswers ? "إخفاء التفاصيل" : "عرض الإجابات اللي بنينا عليها الخطة الحالية"}
              </button>
              {showAnswers && (
                <ul className="mt-4 divide-y divide-border">
                  {visibleQuestions(service, plan.answers).map((qq) => (
                    <li key={qq.id} className="py-3">
                      <p className="text-xs text-muted-foreground mb-0.5">{qq.question}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {answerLabel(service, qq.id, plan.answers[qq.id]) ?? "—"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/service/$id/intake"
                params={{ id: service.id }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition"
              >
                <Pencil className="h-4 w-4" /> عدّل الإجابات لتحديث الخطة
              </Link>
            </Section>
          )}

          {/* جاهز تنزل تانكس استبيان */}
          {service.readyChecklist.length > 0 && (
            <Section title="التحقق النهائي من الجاهزية الشخصية" icon={<CheckSquare className="h-5 w-5" />}>
              <ul className="space-y-2.5">
                {service.readyChecklist.map((item, i) => {
                  const key = `r${i}`;
                  const isChecked = !!checked[key];
                  return (
                    <li key={key}>
                      <button
                        onClick={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                        className="w-full flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-right hover:border-primary/30 transition shadow-xs"
                      >
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${isChecked ? "bg-success border-success text-success-foreground" : "border-border"}`}>
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className={`text-sm ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}>{item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <button onClick={handleSave} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm transition">
                  <CheckCircle2 className="h-4 w-4" /> حفظ التقدم الحالي
                </button>
                <button onClick={handleShare} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition">
                  <Share2 className="h-4 w-4" /> شارك خطة WhatsApp
                </button>
                <button onClick={handleWhatsApp} className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-xs font-semibold text-success hover:bg-success-soft/30 transition">
                  إرسال مباشر
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link to="/report" className="text-xs text-primary hover:underline">المعلومات اختلفت أو غير مطابقة للواقع؟ بلّغنا</Link>
                <Link to="/finder" className="text-xs text-primary hover:underline">مشوار آخر؟ مساعد سِكّة الذكي</Link>
              </div>
            </Section>
          )}

          <TrustNotice />
        </div>

        {/* Dynamic Interactive Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">معدل جاهزيتك للتحرك:</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span data-numeric className="text-4xl font-extrabold text-foreground">{readiness}</span>
              <span className="text-sm text-muted-foreground font-medium">%</span>
            </div>
            
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className={`h-full transition-all duration-500 ${
                  readiness >= 85 ? "bg-success" : readiness >= 40 ? "bg-primary" : "bg-warning"
                }`} 
                style={{ width: `${readiness}%` }} 
              />
            </div>
            
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed font-medium">
              حالة الخطة: <strong className="text-foreground">
                {readiness >= 85 ? "جاهز وآمن للنزول" : readiness >= 40 ? "أوراقك شبه كاملة" : "لسه ناقصك أوراق مهمة"}
              </strong>
            </p>
            
            <div className="mt-5 flex flex-col gap-2">
              <button onClick={handleSave} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-xs transition">
                حفظ التقدم
              </button>
              <button onClick={handleShare} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition">
                مشاركة الخطة
              </button>
              <Link
                to="/service/$id/intake"
                params={{ id: service.id }}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 text-center transition"
              >
                تغيير إجابات الاستبيان
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-xs text-muted-foreground leading-relaxed shadow-xs">
            <p className="font-bold text-foreground mb-1">دليل سِكّة الإرشادي</p>
            <p>جميع البيانات مراجعة وتحديثها مستمد من التجارب الميكانيكية الحية للمواطنين وخبرات السجلات الحكومية.</p>
            <Link to="/report" className="mt-3 inline-block font-semibold text-primary hover:underline">تبليغ عن خطأ بالبيانات</Link>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-24 md:bottom-8 inset-x-0 mx-auto w-fit rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium shadow-xl z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
        <h2 className="text-base md:text-lg font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SummaryStat({ icon, label, value, tone = "neutral" }: { icon: React.ReactNode; label: string; value: string; tone?: "neutral" | "warning" | "success" }) {
  const bg = tone === "warning" ? "bg-warning-soft/75" : tone === "success" ? "bg-success-soft/75" : "bg-background/60";
  return (
    <div className={`rounded-xl border border-border ${bg} p-3 shadow-xs`}>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">{icon}<span>{label}</span></div>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
