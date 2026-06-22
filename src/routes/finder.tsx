import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { services } from "@/lib/services-data";
import { 
  Briefcase, FileText, MapPin, Eye, Compass, HelpCircle, ArrowRight, CheckCircle2, ChevronLeft, Sparkles, Smile
} from "lucide-react";
import { Badge } from "@/components/Badge";

export const Route = createFileRoute("/finder")({
  head: () => ({ meta: [{ title: "مساعد سِكّة الذكي — اعرف ورقك" }] }),
  component: FinderPage,
});

interface Question {
  id: string;
  question: string;
  helper: string;
  icon: React.ReactNode;
  options: {
    value: string;
    label: string;
    description: string;
    emoji: string;
  }[];
}

function FinderPage() {
  const [step, setStep] = useState<"category" | "sub" | "matched">("category");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedInt, setSelectedInt] = useState<string | null>(null);
  const navigate = useNavigate();

  // Multi-step Questions definition
  const subQuestions: Record<string, Question> = {
    "أحوال مدنية": {
      id: "civil",
      question: "إيه الخدمة المدنية اللي محتاجها تحديداً؟",
      helper: "شهادات، بطاقات، بصمات أو وثائق سفر رسمية.",
      icon: <Compass className="h-5 w-5 text-primary" />,
      options: [
        { value: "id-renew", label: "البطاقة الشخصية", description: "تجديد، تالف، مفقود أو تغيير بيانات العنوان والوظيفة", emoji: "🪪" },
        { value: "birth", label: "أوراق الميلاد والنسب", description: "شهادة ميلاد كمبيوتر مميكنة أول مرة أو للأولاد", emoji: "👶" },
        { value: "passport", label: "جواز السفر (الباسبور)", description: "استخراج جواز سفر مصري جديد أو تجديد الحالي", emoji: "✈️" },
        { value: "fish", label: "فيش وتشبيه (بحث جنائي)", description: "صحيفة الحالة الجنائية الموجهة للشركات أو السفر", emoji: "👣" },
      ]
    },
    "شغل وتأمينات": {
      id: "job",
      question: "بتحضر مسوغات تعيين لشركة جديدة؟",
      helper: "أغلب الشركات بتطلب الرقم التأميني وكعب العمل.",
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      options: [
        { value: "kaab", label: "كعب العمل للتوظيف", description: "أول مرة، تجديد أو بدل فاقد من مكتب العمل", emoji: "💼" },
        { value: "ins-num", label: "الرقم البرينت التأميني", description: "برينت الرقم التأميني من التأمينات للتأمين بجهد أقل", emoji: "📉" },
      ]
    },
    "مرور": {
      id: "traffic",
      question: "إنت عايز تسوق سيارة أو ترخص؟",
      helper: "المرور بيقدم رخص المركبات ورخص القيادة الخاصة.",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      options: [
        { value: "drive", label: "رخصة القيادة الشخصية", description: "استخراج رخصة أول مرة، إثبات كشف طبي واختبار القيادة", emoji: "🚗" },
      ]
    },
    "شهر عقاري وتوثيق": {
      id: "auth",
      question: "العقود والتوكيلات الرسمية:",
      helper: "لإقرار بيع أو إيجار أو تفويض شخص بالنيابة.",
      icon: <FileText className="h-5 w-5 text-primary" />,
      options: [
        { value: "tokil", label: "توكيل عام أو خاص لإجراء", description: "لعمل توكيل رسمي لشخص ينوب عنك في المحاكم أو المعاميل", emoji: "📜" },
        { value: "okat", label: "توثيق عقد بيع أو إيجار", description: "توثيق العقود مع حفظ الأطراف بحضور أو غياب", emoji: "🖊️" },
      ]
    },
    "تجارة وأعمال": {
      id: "business",
      question: "بتسجل شركتك أو نشاطك التجاري؟",
      helper: "السجل التجاري والضرائب لفتح السجلات الرسمية.",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      options: [
        { value: "commercial", label: "مستخرج السجل التجاري", description: "مزاولة المهنة، الغرفة التجارية وتدابير الضرائب", emoji: "🏬" },
      ]
    }
  };

  // Resolve matching service IDs
  const matchedServices = useMemo(() => {
    if (!selectedCat) return [];
    
    // If no sub select, filter only by overall category
    let res = services.filter(s => s.category === selectedCat);

    if (selectedInt) {
      if (selectedInt === "id-renew") res = res.filter(s => s.id === "renew-id");
      if (selectedInt === "birth") res = res.filter(s => s.id === "birth-cert");
      if (selectedInt === "passport") res = res.filter(s => s.id === "passport-renew");
      if (selectedInt === "fish") res = res.filter(s => s.id === "fish-w-tashbeeh");
      
      if (selectedInt === "kaab") res = res.filter(s => s.id === "kaab-amal");
      if (selectedInt === "ins-num") res = res.filter(s => s.id === "insurance-number");
      
      if (selectedInt === "drive") res = res.filter(s => s.id === "driving-license");
      
      if (selectedInt === "tokil") res = res.filter(s => s.id === "power-of-attorney");
      if (selectedInt === "okat") res = res.filter(s => s.id === "contract-auth");
      
      if (selectedInt === "commercial") res = res.filter(s => s.id === "commercial-reg");
    }

    return res;
  }, [selectedCat, selectedInt]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCat(cat);
    setSelectedInt(null);
    setStep("sub");
  };

  const handleSubSelect = (val: string) => {
    setSelectedInt(val);
    setStep("matched");
  };

  const handleReset = () => {
    setSelectedCat(null);
    setSelectedInt(null);
    setStep("category");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-8 md:py-16 font-sans">
      
      {/* Header breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-3.5 w-3.5" /> العودة للرئيسية
        </Link>
        <Badge tone="primary">مساعد خطة سِكّة الإرشادي</Badge>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm relative overflow-hidden">
        
        {/* Step 1: Category selection */}
        {step === "category" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-4xl">🗺️</span>
              <h1 className="mt-3 text-xl md:text-2xl font-bold text-foreground">مش عارف اسم الإجراء أو المصلحة؟</h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                اختار المجال العام اللي مشوارك متعلق بيه، واحنا هنمشّيك خطوة بخطوة للأوراق الصح.
              </p>
            </div>

            <div className="grid gap-3 pt-2">
              {[
                { name: "أحوال مدنية", desc: "بطاقات الهوية، شهادات ميلاد، فيش جنائي، جوازات السفر", icon: "🪪", color: "hover:border-blue-500/35 hover:bg-blue-500/5" },
                { name: "شغل وتأمينات", desc: "كعب العمل، الرقم التأميني ومستندات التوظيف بالشركات", icon: "💼", color: "hover:border-green-500/35 hover:bg-green-500/5" },
                { name: "مرور", desc: "رخص القيادة الخاصة والمهنية ووحدات المرور بالمحافظات", icon: "🚗", color: "hover:border-orange-500/35 hover:bg-orange-500/5" },
                { name: "شهر عقاري وتوثيق", desc: "توثيق عقود البيع، عقود الإيجار، والتوكيلات العامة والخاصة", icon: "📜", color: "hover:border-purple-500/35 hover:bg-purple-500/5" },
                { name: "تجارة وأعمال", desc: "تأسيس الأنشطة، السجل التجاري، والضرائب لأصحاب الشركات", icon: "🏬", color: "hover:border-amber-500/35 hover:bg-amber-500/5" }
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleCategorySelect(c.name)}
                  className={`w-full text-right flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition ${c.color} active:scale-[0.99]`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5">{c.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              سِكّة مصممة لمصر بالكامل بالعامية البسيطة واللغة الفصحى لتسهيل الخطوات.
            </p>
          </div>
        )}

        {/* Step 2: Specific Intents */}
        {step === "sub" && selectedCat && subQuestions[selectedCat] && (
          <div className="space-y-6">
            <button 
              onClick={() => setStep("category")} 
              className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
            >
              <ArrowRight className="h-3.5 w-3.5" /> رجوع للخطوة السابقة
            </button>

            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                {subQuestions[selectedCat].icon}
                <span>{selectedCat}</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-foreground">
                {subQuestions[selectedCat].question}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {subQuestions[selectedCat].helper}
              </p>
            </div>

            <div className="grid gap-3 pt-1">
              {subQuestions[selectedCat].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSubSelect(opt.value)}
                  className="w-full text-right flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 hover:border-primary/45 hover:bg-primary-soft/10 transition active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5">{opt.emoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{opt.label}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{opt.description}</p>
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" />
                </button>
              ))}
              
              <button
                onClick={() => setStep("matched")}
                className="w-full text-center py-3 border border-dashed rounded-2xl text-xs text-muted-foreground font-bold hover:text-foreground hover:bg-muted/30 transition"
              >
                تخطي وعرض كل خدمات {selectedCat}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Matches Screen */}
        {step === "matched" && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-4xl">✨</span>
              <h2 className="mt-3 text-xl font-bold text-foreground">دليل الإجراءات المطابقة المجهزة</h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                وجدنا خطط السير الذكية التالية بناءً على اختياراتك لخدمة {selectedCat}:
              </p>
            </div>

            <div className="space-y-2.5">
              {matchedServices.length > 0 ? (
                matchedServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl bg-background hover:bg-muted/15 transition"
                  >
                    <div>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-primary-soft text-primary rounded-full mb-1">{service.category}</span>
                      <h3 className="text-sm font-bold text-foreground">{service.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{service.description}</p>
                    </div>
                    
                    <button
                      onClick={() => navigate({ to: `/service/${service.id}/intake` as any })}
                      className="inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shrink-0 hover:opacity-90 self-start sm:self-center"
                    >
                      ابدأ خطة المشوار <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-dashed text-center rounded-2xl text-muted-foreground text-xs leading-relaxed">
                  للأسف لم نجد خدمة مطابقة بالضبط، جرب تصفح جميع الخدمات أو التواصل معنا.
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs leading-relaxed">
              <button 
                onClick={handleReset} 
                className="text-primary font-bold hover:underline"
              >
                🔄 إعادة استخدام المساعد من الأول
              </button>
              <Link to="/services" className="text-muted-foreground hover:text-foreground hover:underline">
                تصفح كل الخدمات بالكامل
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
