import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { services } from "@/lib/services-data";
import { saveReport } from "@/lib/reports";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "بلّغنا — سِكّة" }] }),
  component: ReportPage,
});

const TYPES = ["ورقة", "ختم", "رسوم", "مكان", "وقت انتظار", "موظف طلب حاجة إضافية", "معلومة تانية"];

function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    service: "",
    gov: "",
    type: "ورقة",
    changed: "",
    notes: "",
    occurredAt: "",
    phone: "",
  });

  const reset = () => setForm({ service: "", gov: "", type: "ورقة", changed: "", notes: "", occurredAt: "", phone: "" });

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-foreground">شكرًا، ملاحظتك هتساعد ناس كتير</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          هنراجع المعلومة قبل تحديثها عشان نحافظ على دقة سِكّة.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2">
          <button
            onClick={() => { setSubmitted(false); reset(); }}
            className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
          >
            ابعت ملاحظة تانية
          </button>
          <Link to="/services" className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            ارجع للخدمات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">المعلومة اختلفت؟</h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        لو لقيت إن المطلوب أو الرسوم أو المكان مختلف، بلّغنا. كل ملاحظة بنراجعها قبل ما نحدّث الخطة.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveReport({
            serviceId: form.service,
            governorate: form.gov,
            type: form.type,
            changed: form.changed,
            notes: form.notes || undefined,
            occurredAt: form.occurredAt || undefined,
            phone: form.phone || undefined,
          });
          setSubmitted(true);
        }}
        className="mt-6 rounded-3xl border border-border bg-card p-6 space-y-5"
      >
        <Field label="اسم الخدمة">
          <select
            required
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="">اختار خدمة…</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value="other">خدمة تانية</option>
          </select>
        </Field>

        <Field label="المحافظة">
          <input
            required
            value={form.gov}
            onChange={(e) => setForm({ ...form, gov: e.target.value })}
            placeholder="مثال: القاهرة"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>

        <Field label="نوع التغيير">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition ${
                  form.type === t
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field label="إيه اللي اختلف؟">
          <input
            required
            value={form.changed}
            onChange={(e) => setForm({ ...form, changed: e.target.value })}
            placeholder="مثال: المكتب طلب صورة بطاقة إضافية"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>

        <Field label="تفاصيل إضافية" optional>
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="أي تفاصيل تساعدنا نراجع المعلومة…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
          />
        </Field>

        <Field label="حصل الكلام ده إمتى؟" optional>
          <input
            value={form.occurredAt}
            onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
            placeholder="مثال: الأسبوع اللي فات"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>

        <Field label="رقم تواصل" optional>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="اختياري — لو محتاجين نتأكد"
            dir="ltr"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          ابعت الملاحظة
        </button>

        <p className="text-[11px] text-muted-foreground text-center">
          في نسخة MVP، الملاحظات بتتخزن على جهازك فقط لحد ما نضيف Backend رسمي.
        </p>
      </form>
    </div>
  );
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        {label}
        {optional && <span className="text-[11px] text-muted-foreground font-normal">اختياري</span>}
      </span>
      {children}
    </label>
  );
}
