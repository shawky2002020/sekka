import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والتنبيه القانوني — سِكّة" },
      { name: "description", content: "تنبيه قانوني وشروط استخدام سِكّة." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const items = [
    "سِكّة ليست جهة حكومية ولا تابعة لأي جهة رسمية.",
    "سِكّة لا تقدم استشارة قانونية رسمية.",
    "المعلومات إرشادية لمساعدة المستخدم على الاستعداد قبل المشوار.",
    "المتطلبات قد تختلف حسب المحافظة أو المكتب أو حالة المستخدم.",
    "يجب الرجوع للجهة الرسمية عند الحاجة أو الشك.",
    "لا تدفع لأي شخص خارج القنوات الرسمية أو الشباك الرسمي.",
    "استخدامك للخدمة يعني فهمك أن الخطة مساعدة وليست ضمانًا بإنهاء الإجراء.",
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">الشروط والتنبيه القانوني</h1>
      <p className="mt-2 text-sm text-muted-foreground">قرايتها مهمة قبل ما تعتمد على الخطة.</p>

      <ul className="mt-6 space-y-3">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-foreground leading-relaxed">
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary text-xs font-semibold font-latin">{i + 1}</span>
            {t}
          </li>
        ))}
      </ul>

      <Link to="/services" className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
        فهمت، ابدأ خطة جديدة
      </Link>
    </div>
  );
}
