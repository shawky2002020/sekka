export type DocBadge =
  | "أصل"
  | "صورة"
  | "أصل + صورة"
  | "للذكور"
  | "حسب المكتب"
  | "قد يُطلب"
  | "حسب الحالة"
  | "يحتاج ختم"
  | "مطلوب"
  | "مهم";

export interface ServiceDoc {
  name: string;
  badges: string[];
  note: string;
  why?: string;
}

export interface IntakeOption {
  value: string;
  label: string;
}

export interface DependsOn {
  questionId: string;
  value: string | string[];
}

export interface IntakeQuestion {
  id: string;
  question: string;
  helper?: string;
  options: IntakeOption[];
  required?: boolean;
  allowSkip?: boolean;
  dependsOn?: DependsOn;
}

export interface ConditionalDoc extends ServiceDoc {
  when?: DependsOn;
  conditionalLabel?: string;
}

export interface ConditionalNote {
  text: string;
  tone?: "info" | "warning";
  when?: DependsOn;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  popular?: boolean;
  comingSoon?: boolean;
  averageDuration: string;
  congestionLevel: "منخفض" | "متوسط" | "مرتفع";
  bestTime: string;
  lastUpdated: string;
  trustLevel: "مراجعة حديثة" | "قيد المراجعة" | "حسب المحافظة";
  questions: IntakeQuestion[];
  prep: string[];
  documents: ServiceDoc[];
  conditionalDocs?: ConditionalDoc[];
  conditionalNotes?: ConditionalNote[];
  routeSteps: string[];
  routeNote?: string;
  feesNote: string;
  mistakes: string[];
  scamWarning: string;
  readyChecklist: string[];
}

const govOptions: IntakeOption[] = [
  { value: "cairo", label: "القاهرة" },
  { value: "giza", label: "الجيزة" },
  { value: "alex", label: "الإسكندرية" },
  { value: "daqahliya", label: "الدقهلية" },
  { value: "sharqiya", label: "الشرقية" },
  { value: "other", label: "محافظة أخرى" },
];

export const services: Service[] = [
  {
    id: "kaab-amal",
    name: "كعب العمل",
    category: "شغل وتأمينات",
    description: "اعرف الأوراق والخطوات قبل ما تروح مكتب العمل.",
    popular: true,
    averageDuration: "١–٣ ساعات",
    congestionLevel: "متوسط",
    bestTime: "٨:٣٠ ص – ١٠:٣٠ ص",
    lastUpdated: "تمت المراجعة هذا الشهر",
    trustLevel: "مراجعة حديثة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", helper: "بنستخدمها عشان نقولك المكتب التابع لك.", options: govOptions, required: true },
      { id: "type", question: "كعب العمل لأول مرة ولا تجديد؟", required: true, options: [
        { value: "first", label: "أول مرة" },
        { value: "renew", label: "تجديد" },
        { value: "lost", label: "بدل فاقد" },
      ]},
      { id: "edu", question: "معاك مؤهل دراسي؟", required: true, options: [
        { value: "high", label: "مؤهل عالي" },
        { value: "mid", label: "مؤهل متوسط" },
        { value: "none", label: "بدون مؤهل" },
        { value: "student", label: "طالب" },
      ]},
      { id: "gender", question: "النوع؟", helper: "بنستخدمها لتحديد لو موقف التجنيد مطلوب.", required: true, options: [
        { value: "m", label: "ذكر" },
        { value: "f", label: "أنثى" },
      ]},
      { id: "army", question: "موقفك من التجنيد؟", required: true, dependsOn: { questionId: "gender", value: "m" }, options: [
        { value: "done", label: "أديت الخدمة" },
        { value: "exempt", label: "إعفاء" },
        { value: "postpone", label: "تأجيل" },
        { value: "notreq", label: "غير مطلوب" },
      ]},
      { id: "purpose", question: "محتاج كعب العمل لإيه؟", required: true, options: [
        { value: "job", label: "التقديم على شغل" },
        { value: "travel", label: "السفر" },
        { value: "gov", label: "جهة حكومية" },
        { value: "other", label: "غير ذلك" },
      ]},
    ],
    prep: [
      "صوّر البطاقة مرتين على الأقل.",
      "اتأكد إن معاك الأصل، مش الصورة بس.",
      "راجع لو المؤهل محتاج ختم أو اعتماد.",
      "جهّز مبلغ صغير للرسوم أو التصوير.",
    ],
    documents: [
      { name: "بطاقة الرقم القومي", badges: ["أصل + صورة", "مطلوب"], note: "لازم تكون سارية." },
      { name: "شهادة المؤهل", badges: ["أصل + صورة"], note: "بعض الحالات قد تحتاج اعتماد أو ختم." },
      { name: "صورة شخصية", badges: ["حسب المكتب"], note: "يفضل تكون معاك احتياطي." },
      { name: "الرقم التأميني", badges: ["قد يُطلب"], note: "بعض المكاتب قد تطلبه حسب الحالة." },
    ],
    conditionalDocs: [
      { name: "موقف التجنيد", badges: ["للذكور", "مطلوب"], note: "شهادة تأدية الخدمة أو الإعفاء أو التأجيل.", when: { questionId: "gender", value: "m" }, conditionalLabel: "أُضيف لأنك ذكر" },
      { name: "خطاب جهة العمل", badges: ["قد يُطلب"], note: "لو الجهة طلبت كعب عمل بصيغة معينة.", when: { questionId: "purpose", value: "job" }, conditionalLabel: "أُضيف بسبب الغرض: شغل" },
    ],
    conditionalNotes: [
      { text: "للسفر: بعض السفارات بتطلب الكعب مترجم ومعتمد. اسأل السفارة قبل ما تروح.", tone: "info", when: { questionId: "purpose", value: "travel" } },
      { text: "بدل فاقد عادة بياخد وقت أطول وقد يحتاج محضر فقد.", tone: "warning", when: { questionId: "type", value: "lost" } },
    ],
    routeSteps: [
      "جهّز الأوراق وصوّرها قبل ما تنزل.",
      "روح مكتب العمل التابع لمحل الإقامة.",
      "اسأل عن شباك كعب العمل.",
      "سلّم الأوراق وراجع البيانات قبل التوقيع.",
      "استلم كعب العمل أو اسأل عن موعد الاستلام.",
    ],
    routeNote: "العنوان الدقيق يختلف حسب المحافظة والمنطقة. في النسخة القادمة هنضيف أقرب مكتب حسب موقعك.",
    feesNote: "قد توجد رسوم بسيطة أو تكلفة تصوير وطباعة حسب المكتب. متدفعش لأي شخص خارج الشباك الرسمي.",
    mistakes: [
      "البطاقة منتهية.",
      "نسيان أصل المستند.",
      "صورة غير واضحة.",
      "مؤهل غير معتمد عند الحاجة.",
      "الذهاب لمكتب غير تابع لمنطقتك.",
    ],
    scamWarning: "أي شخص يقولك «هخلصهالك أسرع» مقابل فلوس غالبًا بيستغل عدم وضوح الإجراءات. اسأل داخل المكتب الرسمي فقط.",
    readyChecklist: [
      "معاك أصل البطاقة وهو ساري؟",
      "معاك صورة البطاقة؟",
      "معاك أصل المؤهل؟",
      "معاك موقف التجنيد لو مطلوب؟",
      "عارف تروح فين؟",
      "عارف الوقت المتوقع؟",
    ],
  },

  {
    id: "renew-id",
    name: "تجديد بطاقة الرقم القومي",
    category: "أحوال مدنية",
    description: "اعرف الاستمارة والأوراق المطلوبة قبل ما تروح السجل المدني.",
    popular: true,
    averageDuration: "حسب نوع الاستمارة والزحام",
    congestionLevel: "مرتفع",
    bestTime: "٨:٠٠ ص – ٩:٣٠ ص",
    lastUpdated: "تمت المراجعة هذا الشهر",
    trustLevel: "حسب المحافظة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "reason", question: "سبب التجديد؟", required: true, options: [
        { value: "expired", label: "البطاقة منتهية" },
        { value: "lost", label: "فقد أو تلف" },
        { value: "change", label: "تغيير بيانات" },
      ]},
      { id: "change", question: "إيه البيانات اللي هتتغير؟", required: true, dependsOn: { questionId: "reason", value: "change" }, options: [
        { value: "address", label: "العنوان" },
        { value: "job", label: "الوظيفة" },
        { value: "marital", label: "الحالة الاجتماعية" },
      ]},
      { id: "addressProof", question: "هل معاك إثبات محل إقامة؟", helper: "إيصال مرافق حديث باسمك أو ولي الأمر.", required: true, dependsOn: { questionId: "change", value: "address" }, options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لا" },
      ]},
      { id: "jobProof", question: "هل معاك إثبات الوظيفة؟", helper: "خطاب من جهة العمل أو ما يثبت.", required: true, dependsOn: { questionId: "change", value: "job" }, options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لا" },
      ]},
    ],
    prep: [
      "جهّز البطاقة القديمة لو موجودة.",
      "لو هتغير العنوان، جهّز إيصال مرافق حديث.",
      "تأكد من كتابة الاسم بشكل صحيح.",
    ],
    documents: [
      { name: "البطاقة القديمة", badges: ["أصل", "مطلوب"], note: "لو متوفرة. لو مفقودة هتحتاج محضر." },
      { name: "استمارة البطاقة", badges: ["مطلوب"], note: "بتتسحب من السجل المدني." },
    ],
    conditionalDocs: [
      { name: "محضر فقد", badges: ["أصل", "مطلوب"], note: "من قسم الشرطة قبل ما تنزل السجل المدني.", when: { questionId: "reason", value: "lost" }, conditionalLabel: "أُضيف بسبب الفقد" },
      { name: "إيصال مرافق حديث", badges: ["أصل + صورة", "مطلوب"], note: "خلال آخر ٣ شهور غالبًا.", when: { questionId: "change", value: "address" }, conditionalLabel: "أُضيف لتغيير العنوان" },
      { name: "إثبات الوظيفة", badges: ["أصل + صورة"], note: "خطاب جهة العمل أو ما يثبت المهنة الجديدة.", when: { questionId: "change", value: "job" }, conditionalLabel: "أُضيف لتغيير الوظيفة" },
      { name: "وثيقة زواج أو طلاق", badges: ["أصل + صورة"], note: "حسب التغيير في الحالة الاجتماعية.", when: { questionId: "change", value: "marital" }, conditionalLabel: "أُضيف لتغيير الحالة الاجتماعية" },
    ],
    conditionalNotes: [
      { text: "مفيش إثبات إقامة معاك؟ غالبًا الطلب هيترفض. جهّزه قبل ما تنزل.", tone: "warning", when: { questionId: "addressProof", value: "no" } },
      { text: "مفيش إثبات وظيفة؟ ممكن يطلبوا منك ترجع تاني بالخطاب.", tone: "warning", when: { questionId: "jobProof", value: "no" } },
    ],
    routeSteps: [
      "روح السجل المدني التابع لمحل إقامتك.",
      "اسحب الاستمارة المناسبة من الشباك.",
      "املأ البيانات وسلّم الأوراق.",
      "ادفع الرسوم واحفظ الإيصال.",
      "استلم موعد التسليم.",
    ],
    feesNote: "الرسوم تختلف حسب نوع الاستمارة (عادية أو مستعجلة). راجع الشباك للرقم المحدّث.",
    mistakes: [
      "نسيان إيصال المرافق عند تغيير العنوان.",
      "اختيار استمارة غير مناسبة.",
      "الذهاب لسجل مدني غير تابع.",
    ],
    scamWarning: "في ناس بتعرض عليك «استخراج سريع» برا الشباك. متدفعش، كل الخدمات بتتم داخل السجل المدني.",
    readyChecklist: [
      "معاك البطاقة القديمة أو محضر فقد؟",
      "عارف نوع الاستمارة المطلوبة؟",
      "معاك مستندات إثبات أي تغيير؟",
      "عارف السجل المدني التابع لك؟",
    ],
  },

  {
    id: "driving-license",
    name: "استخراج رخصة قيادة",
    category: "مرور",
    description: "الأوراق، الكشف الطبي، والاختبارات قبل ما تروح وحدة المرور.",
    popular: true,
    averageDuration: "عدة ساعات وقد تحتاج أكثر من زيارة",
    congestionLevel: "مرتفع",
    bestTime: "٧:٣٠ ص – ٩:٠٠ ص",
    lastUpdated: "تمت المراجعة هذا الشهر",
    trustLevel: "حسب المحافظة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "type", question: "نوع الرخصة؟", required: true, options: [
        { value: "private", label: "خاصة" },
        { value: "moto", label: "دراجة بخارية" },
        { value: "pro", label: "مهنية" },
      ]},
      { id: "first", question: "أول مرة ولا تجديد؟", required: true, options: [
        { value: "first", label: "أول مرة" },
        { value: "renew", label: "تجديد" },
      ]},
      { id: "prev", question: "عندك رخصة سابقة؟", required: true, dependsOn: { questionId: "first", value: "renew" }, options: [
        { value: "yes", label: "نعم" },
        { value: "lost", label: "ضايعة" },
      ]},
      { id: "medical", question: "عملت الكشف الطبي؟", required: true, options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لسه" },
      ]},
    ],
    prep: [
      "صوّر البطاقة وجهز صور شخصية.",
      "اعمل الكشف الطبي قبل ما تنزل وحدة المرور.",
      "تأكد إن سنك مناسب لنوع الرخصة.",
    ],
    documents: [
      { name: "بطاقة الرقم القومي", badges: ["أصل + صورة", "مطلوب"], note: "لازم تكون سارية." },
      { name: "صور شخصية", badges: ["مطلوب"], note: "العدد حسب وحدة المرور." },
      { name: "شهادة طبية", badges: ["مطلوب"], note: "من جهة معتمدة." },
      { name: "نموذج المرور", badges: ["مطلوب"], note: "بيتسحب من الوحدة." },
    ],
    conditionalDocs: [
      { name: "الرخصة السابقة", badges: ["أصل", "مطلوب"], note: "للتجديد.", when: { questionId: "first", value: "renew" }, conditionalLabel: "أُضيف لأنه تجديد" },
      { name: "محضر فقد الرخصة", badges: ["أصل", "مطلوب"], note: "من قسم الشرطة لو الرخصة ضايعة.", when: { questionId: "prev", value: "lost" }, conditionalLabel: "أُضيف لفقد الرخصة" },
    ],
    conditionalNotes: [
      { text: "اعمل الكشف الطبي من جهة معتمدة قبل ما تنزل وحدة المرور، وإلا هترجع تاني.", tone: "warning", when: { questionId: "medical", value: "no" } },
    ],
    routeSteps: [
      "اعمل الكشف الطبي في الجهة المعتمدة.",
      "روح وحدة المرور التابعة.",
      "سلّم الأوراق واسحب النموذج.",
      "ادّي اختبارات النظري والعملي حسب نوع الرخصة.",
      "ادفع الرسوم واستلم موعد الرخصة.",
    ],
    feesNote: "الرسوم تختلف حسب نوع الرخصة ومدة الإصدار.",
    mistakes: [
      "الكشف الطبي من جهة غير معتمدة.",
      "صور شخصية غير مطابقة للمواصفات.",
      "الذهاب لوحدة غير تابعة.",
    ],
    scamWarning: "متدفعش لحد يقولك هيعديك في الاختبار. ده ممكن يعرضك للمسائلة.",
    readyChecklist: [
      "معاك البطاقة سارية؟",
      "عملت الكشف الطبي؟",
      "معاك الصور الشخصية؟",
      "عارف وحدة المرور التابعة؟",
    ],
  },

  {
    id: "contract-auth",
    name: "توثيق عقد",
    category: "شهر عقاري وتوثيق",
    description: "الأوراق والتوكيلات قبل ما تروح الشهر العقاري.",
    averageDuration: "١–٤ ساعات حسب الزحام",
    congestionLevel: "متوسط",
    bestTime: "٩:٠٠ ص – ١١:٠٠ ص",
    lastUpdated: "تمت المراجعة هذا الشهر",
    trustLevel: "قيد المراجعة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "type", question: "نوع العقد؟", required: true, options: [
        { value: "rent", label: "إيجار" },
        { value: "sell", label: "بيع" },
        { value: "other", label: "آخر" },
      ]},
      { id: "parties", question: "كل الأطراف هيحضروا؟", required: true, options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لا، في طرف غايب" },
      ]},
      { id: "powerOfAttorney", question: "معاك توكيل رسمي للطرف الغايب؟", required: true, dependsOn: { questionId: "parties", value: "no" }, options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لا" },
      ]},
    ],
    prep: [
      "جهّز أصل العقد وعدد كافي من الصور.",
      "لو في طرف غايب، جهّز التوكيل الرسمي.",
      "بطاقات كل الأطراف سارية.",
    ],
    documents: [
      { name: "أصل العقد", badges: ["أصل", "مطلوب"], note: "بعدد نسخ كافي للأطراف." },
      { name: "بطاقات الأطراف", badges: ["أصل + صورة", "مطلوب"], note: "لازم تكون سارية." },
    ],
    conditionalDocs: [
      { name: "توكيل رسمي موثق", badges: ["أصل", "مطلوب"], note: "للطرف الغايب — لازم يكون موثق من الشهر العقاري.", when: { questionId: "parties", value: "no" }, conditionalLabel: "أُضيف لغياب طرف" },
      { name: "مستندات الملكية", badges: ["أصل + صورة"], note: "حسب نوع العقد.", when: { questionId: "type", value: ["sell", "other"] }, conditionalLabel: "أُضيف لنوع العقد" },
    ],
    conditionalNotes: [
      { text: "لو الطرف الغايب من غير توكيل، التوثيق غالبًا مش هيتم. اعمل التوكيل الأول.", tone: "warning", when: { questionId: "powerOfAttorney", value: "no" } },
    ],
    routeSteps: [
      "روح الشهر العقاري التابع.",
      "اسحب نموذج التوثيق.",
      "سلّم الأوراق ووقّع أمام الموثق.",
      "ادفع الرسوم واستلم النسخة الموثقة.",
    ],
    feesNote: "الرسوم بتختلف حسب نوع العقد وقيمته.",
    mistakes: [
      "غياب طرف بدون توكيل.",
      "بطاقة منتهية لأحد الأطراف.",
      "نقص في عدد نسخ العقد.",
    ],
    scamWarning: "أي توثيق لازم يتم داخل الشهر العقاري الرسمي.",
    readyChecklist: [
      "معاك أصل العقد؟",
      "كل الأطراف حاضرين أو في توكيل؟",
      "البطاقات سارية؟",
      "عارف الشهر العقاري التابع؟",
    ],
  },

  {
    id: "commercial-reg",
    name: "سجل تجاري",
    category: "تجارة وأعمال",
    description: "الخطوات قبل ما تفتح ملف تجاري وتسجل نشاطك.",
    averageDuration: "قد يحتاج أكثر من يوم وأكثر من جهة",
    congestionLevel: "متوسط",
    bestTime: "٩:٠٠ ص – ١١:٠٠ ص",
    lastUpdated: "تمت المراجعة هذا الشهر",
    trustLevel: "حسب المحافظة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "activity", question: "نوع النشاط؟", required: true, options: [
        { value: "trade", label: "تجاري" },
        { value: "service", label: "خدمي" },
        { value: "industry", label: "صناعي" },
      ]},
      { id: "place", question: "المقر مؤجر ولا تمليك؟", required: true, options: [
        { value: "rent", label: "إيجار" },
        { value: "own", label: "تمليك" },
      ]},
      { id: "tax", question: "فتحت ملف ضريبي؟", required: true, options: [
        { value: "yes", label: "نعم" },
        { value: "no", label: "لسه" },
      ]},
    ],
    prep: [
      "جهّز عقد المقر مثبت التاريخ.",
      "افتح ملف ضريبي قبل أو بالتوازي.",
      "حدد النشاط بدقة قبل ما تنزل.",
    ],
    documents: [
      { name: "بطاقة الرقم القومي", badges: ["أصل + صورة", "مطلوب"], note: "سارية." },
      { name: "عقد المقر", badges: ["أصل + صورة", "مطلوب"], note: "عقد الإيجار أو التمليك للمقر." },
    ],
    conditionalDocs: [
      { name: "عقد إيجار مثبت التاريخ", badges: ["أصل + صورة", "مطلوب"], note: "غالبًا مطلوب للإيجار.", when: { questionId: "place", value: "rent" }, conditionalLabel: "أُضيف للإيجار" },
      { name: "إثبات تمليك", badges: ["أصل + صورة", "مطلوب"], note: "عقد البيع أو الشهر العقاري.", when: { questionId: "place", value: "own" }, conditionalLabel: "أُضيف للتمليك" },
      { name: "بطاقة ضريبية", badges: ["أصل + صورة"], note: "لو فتحت الملف الضريبي.", when: { questionId: "tax", value: "yes" } },
    ],
    conditionalNotes: [
      { text: "افتح الملف الضريبي قبل أو مع التسجيل التجاري عشان متعملش مشوارين.", tone: "warning", when: { questionId: "tax", value: "no" } },
    ],
    routeSteps: [
      "افتح ملف ضريبي في مأمورية الضرائب.",
      "روح الغرفة التجارية التابعة.",
      "سلّم الأوراق وحدد النشاط.",
      "ادفع الرسوم واستلم السجل.",
    ],
    feesNote: "الرسوم تختلف حسب رأس المال ونوع النشاط.",
    mistakes: [
      "عقد غير مثبت التاريخ.",
      "نشاط غير محدد بدقة.",
      "نسيان فتح الملف الضريبي.",
    ],
    scamWarning: "متعتمدش على وسطاء غير رسميين. تواصل مع الغرفة التجارية مباشرة.",
    readyChecklist: [
      "حددت النشاط بدقة؟",
      "معاك عقد المقر مثبت التاريخ؟",
      "فتحت الملف الضريبي؟",
      "عارف الغرفة التابعة لك؟",
    ],
  },

  {
    id: "fish-w-tashbeeh",
    name: "فيش وتشبيه",
    category: "أحوال مدنية",
    description: "الأوراق المطلوبة والخطوات الكاملة لاستخراج صحيفة الحالة الجنائية (الفيش) بالتفصيل في مصر.",
    averageDuration: "١–٢ ساعات",
    congestionLevel: "مرتفع",
    bestTime: "٨:٠٠ ص – ١٠:٠٠ ص",
    lastUpdated: "مراجعة حديثة هذا الشهر",
    trustLevel: "مراجعة حديثة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "purpose", question: "الفيش موجه لأي جهة؟", required: true, options: [
        { value: "gov", label: "جهة حكومية داخلية" },
        { value: "employer", label: "شركة خاصة / عمل" },
        { value: "travel", label: "السفر أو الخارج" },
      ]},
      { id: "online", question: "هل تريد التقديم أونلاين؟", helper: "متاح لو بصماتك مسجلة بالداخل مسبقًا.", required: true, options: [
        { value: "yes", label: "نعم، أونلاين" },
        { value: "no", label: "لا، هروح في القسم بنفسي" },
      ]}
    ],
    prep: [
      "احرص على مطابقة عنوان إقامتك الحالي للعنوان المسجل ببطاقتك.",
      "صوّر بطاقة الرقم القومي صورتين احتياطيًا.",
    ],
    documents: [
      { name: "بطاقة الرقم القومي", badges: ["أصل + صورة", "مطلوب"], note: "يجب أن تكون سارية، أو شهادة ميلاد لمن هم أقل من ١٦ عامًا." },
    ],
    conditionalDocs: [
      { name: "جواز السفر", badges: ["أصل + صورة"], note: "مطلوب ببعض الحالات لو كان لغرض السفر.", when: { questionId: "purpose", value: "travel" }, conditionalLabel: "أُضيف لغرض السفر" }
    ],
    conditionalNotes: [
      { text: "لو بصماتك مش مسجلة قبل كدا، التقديم الإلكتروني مش هيتم ولازم تروح بنفسك تعمل البصمة الرقمية.", tone: "info", when: { questionId: "online", value: "yes" } }
    ],
    routeSteps: [
      "توجه إلى قسم أو مركز الشرطة التابع له عنوانك بالبطاقة.",
      "اشترِ استمارة الفيش والتشبيه واملأ بياناتك بدقة.",
      "انتظر دورك للتصوير وتسجيل البصمة العشرية إلكترونيًا.",
      "استلم الفيش والتشبيه في اليوم التالي أو حسب الموعد المتاح بالقسم.",
    ],
    feesNote: "الرسوم تبلغ ٥٠ جنيهًا للفيش العادي، و٧٠ جنيهًا للفيش المميز أو المستعجل.",
    mistakes: [
      "الذهاب لقسم شرطة بمحافظة أو منطقة أخرى غير المسجلة ببطاقتك.",
      "البطاقة الشخصية منتهية."
    ],
    scamWarning: "الخدمة مميكنة بالكامل، لا تبصم إلا داخل شباك الموظف وادفع بوصل رسمي.",
    readyChecklist: [
      "معاك أصل البطاقة وهو ساري؟",
      "معاك صورتين للبطاقة؟",
      "حددت الجهة الموجه إليها الفيش؟",
      "عرفت القسم التابع لمحل إقامتك؟"
    ]
  },

  {
    id: "birth-cert",
    name: "استخراج شهادة ميلاد",
    category: "أحوال مدنية",
    description: "خطوات استخراج شهادة ميلاد مميكنة (كمبيوتر) لأول مرة أو تكرار للأقارب.",
    averageDuration: "١–٢ ساعات",
    congestionLevel: "متوسط",
    bestTime: "٩:٠٠ ص – ١١:٠٠ ص",
    lastUpdated: "محدث حديثًا",
    trustLevel: "مراجعة حديثة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "times", question: "هل دي أول مرة تستخرجها كمبيوتر؟", required: true, options: [
        { value: "first", label: "نعم، أول مرة كمبيوتر" },
        { value: "repeat", label: "لا، تكرار لشهادة كمبيوتر قديمة" },
      ]},
      { id: "relation", question: "ما هي درجة القرابة لصاحب الشهادة؟", required: true, options: [
        { value: "self", label: "أنا صاحب الشأن أو الأب/الأم/الأخ/الزوج" },
        { value: "relative", label: "قريب درجة ثانية (عم/خال)" },
        { value: "other", label: "وكيل بتوكيل رسمي" },
      ]}
    ],
    prep: [
      "لو تكرار، تتيح الدولة استخراجها من الماكينات الذكية بالسجلات الكبرى وهي أسرع بكثير.",
      "تأكد من معرفة اسم الأم الثلاثي بدقة بالغة."
    ],
    documents: [
      { name: "بطاقة الرقم القومي لمقدم الطلب", badges: ["أصل + صورة", "مطلوب"], note: "لإثبات الشخصية واستكمال النموذج." }
    ],
    conditionalDocs: [
      { name: "شهادة ميلاد ورقية قديمة", badges: ["أصل"], note: "مطلوبة لتسهيل البحث بقاعدة البيانات الرقمية.", when: { questionId: "times", value: "first" }, conditionalLabel: "أُضيف لو أول مرة كمبيوتر" },
      { name: "توكيل رسمي موثق", badges: ["أصل", "مطلوب"], note: "لإثبات الصلاحية القانونية في الاستخراج بالنيابة.", when: { questionId: "relation", value: "other" }, conditionalLabel: "أُضيف لغير الأقارب مباشرة" }
    ],
    conditionalNotes: [
      { text: "الأقارب من الدرجة الثانية قد يطلب منهم إثبات صلة قرابة إضافي أو شهادة ميلاد الأب لتوضيح النسب.", tone: "info", when: { questionId: "relation", value: "relative" } }
    ],
    routeSteps: [
      "توجه لأقرب مكتب سجل مدني تابع لك.",
      "اسحب نموذج طلب شهادة ميلاد واملأه بخط واضح.",
      "سلّم النموذج والأوراق للموظف المختص.",
      "ادفع الرسوم بالخزينة واستلم شهادة الميلاد المميكنة فورًا.",
    ],
    feesNote: "لأول مرة كمبيوتر تبلغ الرسوم حوالي ٣٩ جنيهًا، وتكرار الاستخراج يبلغ ٢٥ جنيهًا.",
    mistakes: [
      "كتابة اسم الأم أو الأب بخلاف المسجل الكترونيًا بالدولة.",
      "محاولة الاستخراج لشخص لا تربطك به علاقة قرابة مباشرة بدون توكيل."
    ],
    scamWarning: "ماكينات السجل المدني الذكية تتيح طباعة الشهادة بنفسك في دقيقة دون طوابير.",
    readyChecklist: [
      "معاك بطاقة سارية لإثبات هويتك؟",
      "عارف اسم الأم تلاتي بدقة؟",
      "معاك أصل وصورة التوكيل لو محتاج؟",
      "حددت أقرب سجل مدني؟"
    ]
  },

  {
    id: "insurance-number",
    name: "استخراج رقم تأميني",
    category: "شغل وتأمينات",
    description: "اعرف الخطوات في مكتب التأمينات قبل الحصول على الرقم التأميني للتوظيف والمكافآت.",
    averageDuration: "١ ساعة",
    congestionLevel: "متوسط",
    bestTime: "٨:٣٠ ص – ١٠:٣٠ ص",
    lastUpdated: "محدث هذا الشهر",
    trustLevel: "مراجعة حديثة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "birthCert", question: "هل معاك شهادة ميلاد مميكنة (حديثة)؟", required: true, options: [
        { value: "yes", label: "نعم معايا" },
        { value: "no", label: "لا (أملك شهادة قديمة)" },
      ]}
    ],
    prep: [
      "برنت الرقم التأميني تطلبه الشركات عادة كمسوغ للتعيين وهو مجاني بالكامل."
    ],
    documents: [
      { name: "بطاقة الرقم القومي", badges: ["أصل + صورة", "مطلوب"], note: "سارية." },
      { name: "شهادة الميلاد المميكنة (الكمبيوتر)", badges: ["أصل + صورة", "مطلوب"], note: "الأساس الذي يتم الاستعلام عبره." }
    ],
    conditionalDocs: [],
    conditionalNotes: [
      { text: "لو شهادة الميلاد مش مميكنة (كمبيوتر)، مكتب التأمينات هيرفض الاستعلام ولازم تطلع شهادة ميلاد كمبيوتر الأول.", tone: "warning", when: { questionId: "birthCert", value: "no" } }
    ],
    routeSteps: [
      "توجه إلى مكتب التأمينات الاجتماعية الأقرب لمحل إقامتك.",
      "اذهب لشباك الاستعلام عن الرقم التأميني.",
      "سلّم شهادة الميلاد وصورة البطاقة للموظف.",
      "يقوم الموظف بطباعة البرنت التأميني مختومًا بختم المكتب رسميًا وتستلمه بالحال.",
    ],
    feesNote: "استخراج برنت الرقم التأميني مجاني تمامًا، ولا يتم تحصيل أي رسوم حكومية عليه.",
    mistakes: [
      "إحضار شهادة ميلاد ورقية قديمة غير كمبيوتر مسببة تعذر النظام الرئيسي.",
      "الذهاب لمكتب تأمينات اجتماعية غير تابع لمنطقتك السكنية."
    ],
    scamWarning: "البرنت مجاني، أي عرض لتسهيله بمقابل مادي هو استغلال محض من الوسطاء.",
    readyChecklist: [
      "معاك أصل شهادة الميلاد الكمبيوتر؟",
      "معاك صورة البطاقة الشخصية؟",
      "عرفت مكتب التأمينات التابع لمنطقتك؟"
    ]
  },

  {
    id: "passport-renew",
    name: "تجديد جواز سفر",
    category: "أحوال مدنية",
    description: "الأوراق والمستندات الكاملة لتجديد جواز السفر المصري والموقف من التجنيد والمؤهلات.",
    averageDuration: "٣–٥ أيام للاستلام",
    congestionLevel: "مرتفع",
    bestTime: "٨:٠٠ ص – ١٠:٠٠ ص",
    lastUpdated: "محدث بالكامل",
    trustLevel: "مراجعة حديثة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "gender", question: "النوع؟", required: true, options: [
        { value: "m", label: "ذكر" },
        { value: "f", label: "أنثى" },
      ]},
      { id: "armyCode", question: "ما هو موقفك من التجنيد للذكور؟", required: true, dependsOn: { questionId: "gender", value: "m" }, options: [
        { value: "done", label: "أديت الخدمة ولدي الأصل" },
        { value: "exempt", label: "إعفاء نهائي" },
        { value: "postpone", label: "تأجيل ساري للدراسة أو السفر" },
        { value: "none", label: "ليس لدي إثبات تجنيد رسمي باليد" }
      ]},
      { id: "edu", question: "هل المؤهل الدراسي مثبت في البطاقة الشخصية؟", required: true, options: [
        { value: "yes", label: "نعم (مثبت بالبطاقة)" },
        { value: "no", label: "لا (غير مثبت أو طالب)" },
      ]}
    ],
    prep: [
      "التقط ٤ صور شخصية حديثة بخلفية بيضاء تمامًا مقاس ٤*٦ قبل ما تروح المصلحة.",
      "تأكد إن بطاقتك سارية وصورة وجهك واضحة."
    ],
    documents: [
      { name: "بطاقة الرقم القومي", badges: ["أصل + صورة", "مطلوب"], note: "يجب أن تكون سارية الصلاحية." },
      { name: "جواز السفر القديم", badges: ["أصل", "مطلوب"], note: "يجب تسليمه لإلغائه مع الاحتفاظ بالتأشيرات." },
      { name: "٤ صور شخصية ٤×٦ بخلفية بيضاء", badges: ["أصل", "مطلوب"], note: "صور حديثة واضحة ومطابقة للمظهر الحالي." }
    ],
    conditionalDocs: [
      { name: "مستند الموقف من التجنيد للذكور", badges: ["أصل + صورة", "مطلوب"], note: "شهادة الجيش أو الإعفاء أو إذن السفر.", when: { questionId: "gender", value: "m" }, conditionalLabel: "أُضيف للذكور" },
      { name: "أصل شهادة المؤهل الدراسي", badges: ["أصل + صورة"], note: "لو المؤهل غير مدون بالبطاقة لتوثيقه بالجواز.", when: { questionId: "edu", value: "no" }, conditionalLabel: "أُضيف لعدم إثبات المؤهل" }
    ],
    conditionalNotes: [
      { text: "إذا لم يكن موقفك التجنيد ساريًا أو غير موجود بيدك، الجوازات هترفض الطلب تمامًا.", tone: "warning", when: { questionId: "armyCode", value: "none" } }
    ],
    routeSteps: [
      "توجه لمصلحة الجوازات والهجرة التابع لها مقر سكنك بالبطاقة.",
      "احصل على استمارة جواز سفر (نموذج ٢٩ جوازات) مجانًا واملأ البيانات.",
      "قدّم الاستمارة والمستندات للموظف لتقدير الرسوم والمراجعة.",
      "ادفع الرسوم المقررة بالخزينة وخذ إيصال السداد.",
      "عد في موعد الاستلام (عادة بعد ٣-٥ أيام عمل) لاستلام الجواز الجديد مع القديم الملغي.",
    ],
    feesNote: "التكلفة تبلغ حوالي ١٠١٠ جنيهات للجواز العادي، والجواز المستعجل يضاف عليه رسوم خدمة إضافية.",
    mistakes: [
      "إحضار صور شخصية بخلفيات ملونة أو ذات مقاس مختلف عن ٤×٦.",
      "البطاقة الشخصية منتهية."
    ],
    scamWarning: "أوراق الجوازات تراجع بدقة وإلكترونيًا داخل المصلحة، لا تدفع مبالغ لأي جهات مجهولة خارج المقر.",
    readyChecklist: [
      "معاك البطاقة سارية؟",
      "التقطت الصور الـ ٤ بالمقاس والخلفية البيضاء؟",
      "معاك جواز السفر القديم؟",
      "معاك إثبات التجنيد (لو ذكر)؟"
    ]
  },

  {
    id: "power-of-attorney",
    name: "توكيل عام / خاص",
    category: "شهر عقاري وتوثيق",
    description: "الأوراق المطلوبة والخطوات لعمل توكيل رسمي عام في القضايا أو توكيل خاص بالتصرف القانوني في مصر.",
    averageDuration: "١–٣ ساعات",
    congestionLevel: "متوسط",
    bestTime: "٩:٠٠ ص – ١١:٠٠ ص",
    lastUpdated: "محدث ومراجع بالتفصيل",
    trustLevel: "مراجعة حديثة",
    questions: [
      { id: "gov", question: "إنت من أي محافظة؟", options: govOptions, required: true },
      { id: "type", question: "ما هو نوع التوكيل؟", required: true, options: [
        { value: "general", label: "توكيل عام شامل (قضايا / بنوك / وتصرفات)" },
        { value: "special", label: "توكيل خاص لموضوع أو إجراء محدد" },
      ]},
      { id: "app", question: "هل حجزت دور مسبق عبر تطبيق الهاتف؟", required: true, options: [
        { value: "yes", label: "نعم، حجزت عبر (أرغب في عمل توكيل / مصر الرقمية)" },
        { value: "no", label: "لا، سأذهب للحصول على دور بالقسم مباشرًا" },
      ]}
    ],
    prep: [
      "يشترط الأهلية الكاملة وحضور الموكل شخصيًا وبطاقته سارية.",
      "الوكيل لا يشترط حضوره، ولكن يجب معرفة اسمه بالكامل ورقمه القومي وعنوانه بدقة."
    ],
    documents: [
      { name: "بطاقة الرقم القومي للموكل", badges: ["أصل + صورة", "مطلوب"], note: "سارية وبصورتها واضحة تمامًا." },
      { name: "اسم وبيانات الوكيل", badges: ["مطلوب"], note: "الاسم بالكامل كما بالبطاقة والزيادة بالرقم القومي." }
    ],
    conditionalDocs: [
      { name: "إرسال حجز الهاتف الإلكتروني", badges: ["صورة"], note: "للدخول عبر شباك الحجز المسبق مباشرة.", when: { questionId: "app", value: "yes" }, conditionalLabel: "أُضيف لحاجزي التطبيق" }
    ],
    conditionalNotes: [
      { text: "التوكيل العام الشامل يعد مستندًا شديد الأهمية والخطورة. لا تقم بعمل توكيل عام لأي شخص إلا لو كنت تثق به ثقة مطلقة.", tone: "warning" },
      { text: "قم بتحميل تطبيق (أرغب في عمل توكيل) لتقليل زمن الانتظار لأقل من نصف ساعة داخل الفرع.", tone: "info", when: { questionId: "app", value: "no" } }
    ],
    routeSteps: [
      "توجه لفرع توثيق الشهر العقاري (الفرع المختار أو التابع لمنطقتك).",
      "اطلب نموذج التوكيل المناسب واكتب بيانات الموكل والوكيل والبنود.",
      "سلّم الأوراق والمراجعة مع الموثق المختص.",
      "ادفع الرسوم المطلوبة بخزينة المكتب وخذ الإيصال والملصق المالي.",
      "وقّع بالدفتر وبصم بالسبابة واستلم التوكيل مختومًا بالنسر رسميًا بالحال.",
    ],
    feesNote: "رسوم التوكيل الخاص ٣١ جنيهًا، ورسوم التوكيل العام للقضايا تبلغ حوالي ٤١ جنيهًا، مع زيادة جنيهات قليلة للنسخ الإضافية.",
    mistakes: [
      "غياب الموكل وحضور الوكيل فقط (التوكيل يصدره الموكل وليس الوكيل).",
      "خطأ في كتابة الرقم القومي للوكيل مما يبطل التوثيق الاستخدام.",
      "البطاقة الشخصية للموكل منتهية."
    ],
    scamWarning: "أي توكيل يتم توثيقه خارج مقر الشهر العقاري ودون دفع الرسوم رسميًا يعتبر باطلاً ويعرضك للنصب.",
    readyChecklist: [
      "معاك أصل بطاقة الموكل سارية؟",
      "معاك الاسم رباعي والبيانات الكاملة للوكيل؟",
      "حددت البنود والصلاحيات بدقة؟",
      "حملت تطبيق أرغب في عمل توكيل وحجزت إذا أمكن؟"
    ]
  },

  // ===== Coming soon services =====
  ...(["family-record"].map((id) => {
    const map: Record<string, { name: string; category: string; description: string }> = {
      "family-record": { name: "قيد عائلي", category: "أحوال مدنية", description: "بنراجع وثائق التوثيق قبل ما نعرض خطة كاملة ومحدثة." },
    };
    const m = map[id];
    return {
      id,
      name: m.name,
      category: m.category,
      description: m.description,
      comingSoon: true,
      averageDuration: "—",
      congestionLevel: "متوسط" as const,
      bestTime: "—",
      lastUpdated: "قيد الإعداد والتوثيق",
      trustLevel: "قيد المراجعة" as const,
      questions: [],
      prep: [],
      documents: [],
      routeSteps: [],
      feesNote: "—",
      mistakes: [],
      scamWarning: "",
      readyChecklist: [],
    } satisfies Service;
  })),
];

export const getService = (id: string) => services.find((s) => s.id === id);

// ============= Conditional helpers =============

function matchValue(actual: string | undefined, expected: string | string[]): boolean {
  if (actual === undefined || actual === "") return false;
  if (Array.isArray(expected)) return expected.includes(actual);
  return actual === expected;
}

export function isQuestionVisible(q: IntakeQuestion, answers: Record<string, string>): boolean {
  if (!q.dependsOn) return true;
  return matchValue(answers[q.dependsOn.questionId], q.dependsOn.value);
}

export function visibleQuestions(service: Service, answers: Record<string, string>): IntakeQuestion[] {
  return service.questions.filter((q) => isQuestionVisible(q, answers));
}

// ============= Build computed trip plan =============

export interface ComputedDoc extends ServiceDoc {
  conditional?: boolean;
  conditionalLabel?: string;
}

export interface ComputedNote {
  text: string;
  tone: "info" | "warning";
}

export interface TripPlan {
  service: Service;
  documents: ComputedDoc[];
  notes: ComputedNote[];
  governorateLabel?: string;
  missingAnswers: string[];
  criticalWarnings: string[];
  readinessBaseItems: number;
  todayDecision?: {
    status: "ready" | "almost" | "wait" | "rejected";
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  shareText: string;
  printSections?: {
    title: string;
    items: string[];
  }[];
  seoSummary?: string;
}

export function buildTripPlan(service: Service, answers: Record<string, string>, checkedItems: Record<string, boolean> = {}): TripPlan {
  const documents: ComputedDoc[] = service.documents.map((d) => ({ ...d }));

  for (const cd of service.conditionalDocs ?? []) {
    if (!cd.when || matchValue(answers[cd.when.questionId], cd.when.value)) {
      documents.push({ ...cd, conditional: !!cd.when, conditionalLabel: cd.conditionalLabel });
    }
  }

  const notes: ComputedNote[] = [];
  for (const n of service.conditionalNotes ?? []) {
    if (!n.when || matchValue(answers[n.when.questionId], n.when.value)) {
      notes.push({ text: n.text, tone: n.tone ?? "info" });
    }
  }

  const visible = visibleQuestions(service, answers);
  const missingAnswers = visible
    .filter((q) => q.required && !answers[q.id])
    .map((q) => q.question);

  const govQ = service.questions.find((q) => q.id === "gov");
  const governorateLabel = govQ?.options.find((o) => o.value === answers.gov)?.label;

  // 1. Critical Answer-Based Warnings
  const criticalWarnings: string[] = [];
  
  if (service.id === "renew-id") {
    if (answers.reason === "change" && answers.change === "address" && answers.addressProof === "no") {
      criticalWarnings.push("من غير إثبات محل إقامة غالبًا هترجع تاني من السجل المدني.");
    }
    if (answers.reason === "change" && answers.change === "job" && answers.jobProof === "no") {
      criticalWarnings.push("من غير إثبات الوظيفة، الطلب غالبًا هيترفض.");
    }
  }
  
  if (service.id === "driving-license") {
    if (answers.medical === "no") {
      criticalWarnings.push("اعمل الكشف الطبي الأول قبل ما تروح وحدة المرور.");
    }
  }

  if (service.id === "contract-auth") {
    if (answers.parties === "no" && answers.powerOfAttorney === "no") {
      criticalWarnings.push("لو الطرف الغايب من غير توكيل، التوثيق غالبًا مش هيتم.");
    }
  }

  if (service.id === "commercial-reg") {
    if (answers.tax === "no") {
      criticalWarnings.push("غالبًا هتحتاج الملف الضريبي قبل أو أثناء التسجيل.");
    }
  }

  if (service.id === "passport-renew") {
    if (answers.gender === "m" && answers.armyCode === "none") {
      criticalWarnings.push("إذا لم يكن موقفك التجنيدي مسجلاً أو بيدك، الطلب سيرفض تمامًا.");
    }
  }

  // 2. Count Readiness Checklist + Docs
  const totalChecks = documents.length + (service.readyChecklist?.length ?? 0);
  
  // Find which ones are checked
  let doneChecks = 0;
  // Account for document checks
  documents.forEach((_, idx) => {
    if (checkedItems[`doc-${idx}`]) doneChecks++;
  });
  // Account for readyChecklist items (stored with key like r0, r1)
  service.readyChecklist?.forEach((_, idx) => {
    if (checkedItems[`r${idx}`]) doneChecks++;
  });

  const readinessValue = totalChecks === 0 ? 0 : Math.round((doneChecks / totalChecks) * 100);

  // 3. Evaluate Decision
  let todayDecision: TripPlan["todayDecision"];

  if (criticalWarnings.length > 0) {
    todayDecision = {
      status: "rejected",
      title: "غالبًا هترجع تاني لو نزلت دلوقتي",
      description: criticalWarnings[0],
      bgColor: "bg-danger-soft/90",
      textColor: "text-danger-foreground border-danger",
      borderColor: "border-danger/40"
    };
  } else {
    // Check if any REQUIRED documents are unchecked
    const missingRequiredDocs = documents.some((doc, idx) => {
      const isRequired = doc.badges.includes("مطلوب");
      const isChecked = checkedItems[`doc-${idx}`];
      return isRequired && !isChecked;
    });

    if (missingRequiredDocs || readinessValue < 40) {
      todayDecision = {
        status: "wait",
        title: "استنى وجهّز الناقص",
        description: "لسه في أوراق أساسية مطلوبة أو غير جاهزة محتاج تراجعها وتعلّم عليها عشان مشوارك ينجح.",
        bgColor: "bg-warning-soft/95",
        textColor: "text-warning-foreground border-warning",
        borderColor: "border-warning/40"
      };
    } else if (readinessValue < 85) {
      todayDecision = {
        status: "almost",
        title: "قريب تكون جاهز",
        description: "أوراقك شبه كاملة والناقص حاجات بسيطة. جهّز آخر علامات عشان تنزل وأنت مطمن.",
        bgColor: "bg-primary-soft/90",
        textColor: "text-primary border-primary",
        borderColor: "border-primary/30"
      };
    } else {
      todayDecision = {
        status: "ready",
        title: "جاهز تنزل النهارده",
        description: "جاهزيتك عالية ومستنداتك مكتملة بالشروط الحالية! توكل على الله ومجهودك مش هيضيع.",
        bgColor: "bg-success-soft/90",
        textColor: "text-success border-success",
        borderColor: "border-success/30"
      };
    }
  }

  // 4. Print Friendly Sections
  const printSections = [
    { title: "المستندات والأوراق المطلوبة", items: documents.map(d => `${d.name} (${d.badges.join(", ")}) — ${d.note}`) },
    { title: "التحضير وخطوات المشوار الحكومي", items: service.routeSteps },
    { title: "الرسوم ومستوى الهدر المالي", items: [service.feesNote, "تنبيه: متدفعش مبالغ إضافية خارج الشباك."] },
    { title: "أخطاء شائعة تجنبها", items: service.mistakes }
  ];

  // 5. SEO summary description
  const seoSummary = `أسهل دليل لإجراء ${service.name} في ${governorateLabel || "مصر"}. جهّز ${documents.length} مستند وتجنب ${service.mistakes.length} خطأ شائع يوقف مشوارك.`;

  // 6. Viral WhatsApp Share Text Builder
  const crucialNotes = notes.length > 0 ? `\nخد بالك:\n- ${notes[0].text}` : "";
  const alertText = criticalWarnings.length > 0 ? `\n⚠️ تنبيه هام:\n- ${criticalWarnings[0]}` : "";
  
  // What is missing summary
  const uncheckedDocs = documents
    .filter((_, idx) => !checkedItems[`doc-${idx}`])
    .slice(0, 3)
    .map(d => d.name);
  const whatIsMissingStr = uncheckedDocs.length > 0 ? `\n\n📌 يفضل أراجع:\n- ${uncheckedDocs.join("\n- ")}` : "";

  const shareText = `خطة مشواري من سِكّة ✅

الخدمة: ${service.name}
المحافظة: ${governorateLabel || "القاهرة"}
الوقت المتوقع: ${service.averageDuration}
أفضل وقت للمرور: ${service.bestTime}
معدل الجاهزية الحالي: ${readinessValue}%

أهم الأوراق المطلوبة:
- ${documents.slice(0, 3).map(d => d.name).join("\n- ")}${whatIsMissingStr}${crucialNotes}${alertText}

سِكّة — طريقك الصح قبل أي مشوار حكومي 🗺️`;

  return {
    service,
    documents,
    notes,
    governorateLabel,
    missingAnswers,
    criticalWarnings,
    readinessBaseItems: totalChecks,
    todayDecision,
    shareText,
    printSections,
    seoSummary
  };
}

export function answerLabel(service: Service, questionId: string, value: string | undefined): string | undefined {
  if (!value) return undefined;
  const q = service.questions.find((x) => x.id === questionId);
  return q?.options.find((o) => o.value === value)?.label;
}
