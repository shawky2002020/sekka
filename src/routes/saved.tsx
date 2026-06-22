import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { listPlans, removePlan, readinessStatus, type SavedPlan } from "@/lib/saved-plans";
import { getService, answerLabel } from "@/lib/services-data";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "خططي المحفوظة — سِكّة" }] }),
  component: SavedPage,
});

function SavedPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => { setPlans(listPlans()); }, []);
  const refresh = () => setPlans(listPlans());

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">خططي المحفوظة</h1>
      <p className="mt-2 text-sm text-muted-foreground">كل خططك بتتحفظ على جهازك. ارجعلها قبل أي مشوار.</p>

      {plans.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <h3 className="text-base font-semibold text-foreground">لسه مفيش خطط محفوظة</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            ابدأ بخدمة زي كعب العمل أو البطاقة، واحفظ خطة المشوار قبل ما تنزل.
          </p>
          <Link to="/services" className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            ابدأ خطة جديدة
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {plans.map((p) => {
            const s = getService(p.serviceId);
            if (!s) return null;
            const gov = answerLabel(s, "gov", p.answers.gov) ?? "—";
            const status = readinessStatus(p.readiness);
            const toneClass =
              status.tone === "success" ? "bg-success-soft text-success"
              : status.tone === "warning" ? "bg-warning-soft text-foreground"
              : "bg-danger-soft text-danger";
            return (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">المحافظة: {gov} · <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] ${toneClass}`}>{status.label}</span></p>
                    <p className="text-[11px] text-muted-foreground mt-1" data-numeric>
                      آخر تحديث: {new Date(p.updatedAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/plan/$id"
                      params={{ id: p.id }}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      افتح الخطة
                    </Link>
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-danger hover:border-danger/30"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-success" style={{ width: `${p.readiness}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">جاهزية <span data-numeric>{p.readiness}</span>٪</p>
              </li>
            );
          })}
        </ul>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setConfirmId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-danger-soft text-danger">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">تحذف الخطة؟</h3>
                <p className="mt-1 text-sm text-muted-foreground">مش هتقدر ترجعها بعد الحذف.</p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setConfirmId(null)} className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50">إلغاء</button>
              <button
                onClick={() => { if (confirmId) removePlan(confirmId); setConfirmId(null); refresh(); }}
                className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                حذف الخطة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
