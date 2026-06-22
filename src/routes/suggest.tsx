import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { saveSuggestion } from "@/lib/suggestions";

export const Route = createFileRoute("/suggest")({
  head: () => ({ meta: [{ title: "اقترح خدمة — سِكّة" }] }),
  component: SuggestPage,
});

function SuggestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ procedure: "", gov: "", office: "", problem: "", phone: "" });
  const reset = () => setForm({ procedure: "", gov: "", office: "", problem: "", phone: "" });

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-foreground">وصلنا اقتراحك</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          هنستخدم الاقتراحات عشان نضيف خدمات أكتر في سِكّة.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2">
          <button
            onClick={() => { setSubmitted(false); reset(); }}
            className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
          >
            اقترح خدمة تانية
          </button>
          <Link to="/services" className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            تصفح الخدمات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">مش لاقي الإجراء اللي محتاجه؟</h1>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        اكتب لنا أنت عايز تخلص إيه، وسِكّة هتساعدك توصله بأوضح طريقة.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveSuggestion({
            procedure: form.procedure,
            governorate: form.gov,
            knownOffice: form.office || undefined,
            problem: form.problem || undefined,
            phone: form.phone || undefined,
          });
          setSubmitted(true);
        }}
        className="mt-6 rounded-3xl border border-border bg-card p-6 space-y-5"
      >
        <Field label="الإجراء اللي محتاجه">
          <input
            required
            value={form.procedure}
            onChange={(e) => setForm({ ...form, procedure: e.target.value })}
            placeholder="مثال: تجديد جواز السفر"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="المحافظة">
          <input
            required
            value={form.gov}
            onChange={(e) => setForm({ ...form, gov: e.target.value })}
            placeholder="مثال: الجيزة"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="أنت رايح أنهي جهة لو تعرف؟" optional>
          <input
            value={form.office}
            onChange={(e) => setForm({ ...form, office: e.target.value })}
            placeholder="مثال: مصلحة الجوازات"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="إيه المشكلة اللي واقف عندها؟" optional>
          <textarea
            rows={3}
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
            placeholder="مثال: مش عارف الأوراق المطلوبة"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
          />
        </Field>
        <Field label="رقم تواصل" optional>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="اختياري"
            dir="ltr"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>

        <button
          type="submit"
          className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          اقترح الخدمة
        </button>
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
