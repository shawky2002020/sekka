import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "مساعدة سِكّة — الأسئلة الشائعة" },
      { name: "description", content: "إجابات على الأسئلة الشائعة عن سِكّة وكيفية استخدامها." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  { q: "سِكّة بتعمل إيه؟", a: "سِكّة بتجهز لك خطة مشوار قبل ما تروح مصلحة أو جهة رسمية: الأوراق، الخطوات، الوقت المتوقع، والتحذيرات." },
  { q: "هل سِكّة جهة حكومية؟", a: "لا. سِكّة دليل مساعد وليست جهة حكومية، ومش بتقدّم استشارة قانونية." },
  { q: "هل المعلومات مضمونة 100%؟", a: "ما نقدرش نضمن إن كل مكتب هيطلب نفس الحاجة. عشان كده بنوضح آخر تحديث ونسمح للمستخدمين يبلغونا بأي اختلاف." },
  { q: "أعمل إيه لو المكتب طلب ورقة زيادة؟", a: "استخدم صفحة «بلّغنا» وابعتلنا التفاصيل، وهنراجع ونحدّث الخطة." },
  { q: "هل أقدر أحفظ الخطة؟", a: "نعم، الخطة بتتحفظ على جهازك في النسخة الحالية وممكن ترجعلها من «خططي»." },
  { q: "هل البيانات بتتزامن بين الأجهزة؟", a: "ليس في نسخة MVP الحالية. الخطط بتتخزن محليًا على كل جهاز لوحده." },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">مساعدة سِكّة</h1>
      <p className="mt-2 text-sm text-muted-foreground">إجابات سريعة على الأسئلة المتكررة.</p>

      <div className="mt-8 space-y-3">
        {FAQ.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 open:shadow-sm">
            <summary className="cursor-pointer text-base font-semibold text-foreground list-none flex items-center justify-between">
              {f.q}
              <span className="text-muted-foreground transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-2">
        <Link to="/services" className="flex-1 rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
          ابدأ خطة جديدة
        </Link>
        <Link to="/report" className="flex-1 rounded-xl border border-border bg-card px-5 py-3 text-center text-sm font-medium text-foreground hover:bg-muted/50">
          بلّغ عن معلومة مختلفة
        </Link>
      </div>
    </div>
  );
}
