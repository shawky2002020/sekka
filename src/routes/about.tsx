import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن سِكّة — دليل مساعد للأوراق الحكومية" },
      { name: "description", content: "سِكّة دليل مساعد وليس جهة حكومية. بنوضح إزاي بنحدّث المعلومات ونحافظ على دقتها." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        مبدأ سِكّة
      </div>
      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground leading-tight">
        سِكّة مش جهة حكومية
      </h1>
      <p className="mt-3 text-base text-muted-foreground leading-relaxed">
        سِكّة دليل مساعد بيجمع وينظم المعلومات عشان تعرف تستعد قبل المشوار. المتطلبات ممكن تختلف حسب المحافظة أو المكتب، لذلك بنوضح آخر تحديث ومستوى الثقة، ونسمح للمستخدمين يبلغونا بأي اختلاف.
      </p>

      <div className="mt-8 space-y-6">
        <Block title="ليه سِكّة موجودة؟">
          الورقة الناقصة = مشوار زيادة. بنخلي المعلومة واضحة قبل ما تنزل: الأوراق، الخطوات، الوقت، والتحذيرات.
        </Block>
        <Block title="المعلومة بتتحدث إزاي؟">
          بنراجع المعلومات بشكل دوري ومن بلاغات المستخدمين. كل خدمة عليها تاريخ آخر مراجعة ومستوى الثقة.
        </Block>
        <Block title="ليه بنقول «قد تختلف حسب المكتب»؟">
          بعض المكاتب بتطلب أوراق إضافية أو ختم معين. بنقولك الصورة الكاملة عشان تروح مستعد لأكتر الحالات.
        </Block>
        <Block title="إزاي تبلغنا بمعلومة مختلفة؟">
          من صفحة «بلّغنا» — اكتبلنا اسم الخدمة، المحافظة، وإيه اللي اختلف. هنراجعها قبل ما نحدّث.
        </Block>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">تنويه قانوني:</span>{" "}
        سِكّة لا تُقدّم استشارات قانونية أو وعود رسمية. عند الحاجة، راجع الجهة الرسمية أو محامي متخصص.
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}
