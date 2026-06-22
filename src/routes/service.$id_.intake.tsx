import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { getService, visibleQuestions, answerLabel } from "@/lib/services-data";
import { savePlan } from "@/lib/saved-plans";

export const Route = createFileRoute("/service/$id_/intake")({
  loader: ({ params }) => {
    const s = getService(params.id);
    if (!s) throw notFound();
    if (s.comingSoon) throw notFound();
    return { service: s };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `أسئلة ${loaderData?.service.name ?? ""} — سِكّة` }],
  }),
  component: Intake,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h2 className="text-xl font-semibold">الخدمة دي مش متاحة لسه</h2>
      <p className="mt-2 text-sm text-muted-foreground">ممكن تكون قيد الإعداد أو الرابط قديم.</p>
      <Link to="/services" className="mt-4 inline-block text-primary hover:underline">ارجع للخدمات</Link>
    </div>
  ),
});

function Intake() {
  const { service } = Route.useLoaderData();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const visible = useMemo(() => visibleQuestions(service, answers), [service, answers]);
  const total = visible.length;
  const safeStep = Math.min(step, Math.max(0, total - 1));
  const q = visible[safeStep];
  const isLast = safeStep === total - 1;
  const currentAnswer = q ? answers[q.id] : undefined;

  const pickAndAdvance = (val: string) => {
    if (!q) return;
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    // Recompute visible against the next answers to decide next step
    const nextVisible = visibleQuestions(service, next);
    const nextIdx = nextVisible.findIndex((x) => x.id === q.id) + 1;
    if (nextIdx < nextVisible.length) {
      setTimeout(() => setStep(nextIdx), 140);
    } else {
      setTimeout(() => setReviewing(true), 160);
    }
  };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const id = savePlan({ serviceId: service.id, answers });
      navigate({ to: "/plan/$id", params: { id } });
    }, 700);
  };

  if (generating) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" />
        <h2 className="mt-5 text-lg font-semibold text-foreground">بنجهز خطة مشوارك</h2>
        <p className="mt-2 text-sm text-muted-foreground">بنرتب الأوراق والخطوات والتحذيرات حسب إجاباتك.</p>
      </div>
    );
  }

  if (reviewing) {
    const allVisible = visibleQuestions(service, answers);
    const missing = allVisible.filter((qq) => qq.required && !answers[qq.id]);
    return (
      <div className="mx-auto max-w-xl px-4 md:px-6 py-8">
        <button onClick={() => setReviewing(false)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4" /> رجوع للأسئلة
        </button>
        <div className="mt-5 rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">راجع إجاباتك</h2>
          <p className="mt-2 text-sm text-muted-foreground">هناخد الإجابات دي ونبني عليها خطة المشوار.</p>

          <ul className="mt-5 divide-y divide-border">
            {allVisible.map((qq, i) => (
              <li key={qq.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{qq.question}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">
                    {answerLabel(service, qq.id, answers[qq.id]) ?? "— لم تختر بعد"}
                  </p>
                </div>
                <button
                  onClick={() => { setReviewing(false); setStep(i); }}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" /> عدّل
                </button>
              </li>
            ))}
          </ul>

          {missing.length > 0 && (
            <div className="mt-4 rounded-xl border border-warning/30 bg-warning-soft/60 p-3 text-xs text-foreground">
              لسه في {missing.length} إجابة مطلوبة قبل ما نعمل الخطة.
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setReviewing(false)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              عدّل الإجابات
            </button>
            <button
              onClick={generate}
              disabled={missing.length > 0}
              className="flex-1 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              اعمل خطة المشوار
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">الخدمة دي مفيهاش أسئلة لسه.</p>
        <Link to="/services" className="mt-4 inline-block text-primary hover:underline">ارجع للخدمات</Link>
      </div>
    );
  }

  const progress = ((safeStep + (currentAnswer ? 1 : 0)) / total) * 100;

  return (
    <div className="mx-auto max-w-xl px-4 md:px-6 py-8">
      <Link to="/service/$id" params={{ id: service.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> رجوع لـ {service.name}
      </Link>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>سؤال <span data-numeric>{safeStep + 1}</span> من <span data-numeric>{total}</span></span>
          <span>{service.name}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={q.id} className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8 animate-fade-up">
        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">{q.question}</h2>
        {q.helper && <p className="mt-2 text-sm text-muted-foreground">{q.helper}</p>}

        <div className="mt-6 grid gap-2.5">
          {q.options.map((opt) => {
            const selected = currentAnswer === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => pickAndAdvance(opt.value)}
                className={`group flex items-center justify-between rounded-xl border px-4 py-3.5 text-right transition-all ${
                  selected
                    ? "border-primary bg-primary-soft/60 text-foreground"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <span className="text-sm font-medium">{opt.label}</span>
                <span className={`h-4 w-4 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={safeStep === 0}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" /> السابق
          </button>

          {isLast ? (
            <button
              onClick={() => setReviewing(true)}
              disabled={!currentAnswer}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              راجع الإجابات
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
              disabled={!currentAnswer}
              className="inline-flex items-center gap-1 rounded-lg bg-foreground/90 text-background px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              التالي <ArrowLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
