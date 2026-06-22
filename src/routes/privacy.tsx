import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "الخصوصية — سِكّة" },
      { name: "description", content: "سياسة الخصوصية المبسطة لسِكّة في نسخة MVP." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">الخصوصية</h1>
      <p className="mt-2 text-sm text-muted-foreground">شفاف وقصير عشان تعرف بياناتك بتروح فين.</p>

      <div className="mt-6 space-y-4 text-sm text-foreground leading-relaxed">
        <p>في نسخة MVP الحالية، الخطط المحفوظة وبلاغاتك واقتراحاتك بتتخزن على جهازك فقط باستخدام <span className="font-semibold">localStorage</span>.</p>
        <p>لا يتم إرسال بياناتك إلى أي خادم خارجي في هذه النسخة.</p>
        <p>لو كتبت رقم تواصل في صفحة «بلّغنا» أو «اقترح خدمة»، يتم حفظه محليًا فقط ولا يصل إلينا في نسخة MVP.</p>
        <p>الرجاء تجنّب إدخال أي بيانات حسّاسة (أرقام بطاقات، كلمات سر، بيانات بنكية) لأنها غير مطلوبة.</p>
        <p>عند إضافة حسابات أو Backend في نسخة لاحقة، هنحدّث سياسة الخصوصية ونوضح إيه اللي بيتجمع وإزاي.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">ملاحظة:</span> ده ليس مستند قانوني كامل. سيتم استبداله بسياسة خصوصية رسمية عند الإطلاق العام.
      </div>

      <Link to="/services" className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
        ارجع للخدمات
      </Link>
    </div>
  );
}
