/**
 * Office & Location guidance dataset for Sekka government trip planner
 */

export interface GovernmentOffice {
  id: string;
  serviceCategory: string;
  serviceId?: string; // Optional specific service ID binding
  governorate: string; // cairo, giza, alex, sharqiya, daqahliya, other
  name: string;
  area: string;
  notes: string;
  workingHoursNote: string;
  cautionNote: string;
}

export const officesData: GovernmentOffice[] = [
  // كعب العمل (مكاتب العمل)
  {
    id: "kaab-cairo-1",
    serviceCategory: "شغل وتأمينات",
    serviceId: "kaab-amal",
    governorate: "cairo",
    name: "مكتب عمل النزهة ومصر الجديدة",
    area: "السبع عمارات، مصر الجديدة، القاهرة",
    notes: "يقع بجوار مدرسة طبري هليوبوليس. يخدم قاطني مصر الجديدة والنزهة.",
    workingHoursNote: "٨:٣٠ ص – ٢:٠٠ م (يفضل الحضور مبكرًا)",
    cautionNote: "اتأكد من ختم شهادة المؤهل قبل ما تروح لو كنت خريج جامعة خاصة."
  },
  {
    id: "kaab-giza-1",
    serviceCategory: "شغل وتأمينات",
    serviceId: "kaab-amal",
    governorate: "giza",
    name: "مكتب عمل الدقي والعجوزة",
    area: "شارع التحرير، الدقي، الجيزة",
    notes: "قريب من محطة مترو الدقي. يخدم سكان الدقي والعجوزة والمهندسين.",
    workingHoursNote: "٨:٣٠ ص – ١:٣٠ م",
    cautionNote: "لا يوجد تصوير داخل المكتب، اتأكد من تصوير كل الأوراق برا."
  },
  // السجل المدني (تجديد بطاقة، شهادة ميلاد، فيش، جواز سفر)
  {
    id: "civil-cairo-abbasiya",
    serviceCategory: "أحوال مدنية",
    governorate: "cairo",
    name: "مقر قطاع الأحوال المدنية بالعباسية",
    area: "العباسية، القاهرة",
    notes: "المقر الرئيسي في القاهرة. تتوفر فيه خدمات فورية ومستعجلة لجميع المحافظات.",
    workingHoursNote: "٨:٠٠ ص – ٨:٠٠ م (فترتين صباحية ومسائية)",
    cautionNote: "الزحام شديد في فترة الظهيرة، الفترة المسائية بعد ٥:٠٠ م تكون أهدأ."
  },
  {
    id: "civil-cairo-smart",
    serviceCategory: "أحوال مدنية",
    governorate: "cairo",
    name: "مركز الأحوال المدنية النموذجي (سيتي ستارز)",
    area: "مول سيتي ستارز، مدينة نصر، القاهرة",
    notes: "مكتب نموذجي مكيّف وسريع ومتاح فيه الماكينات الذكية لاستخراج شهادات الميلاد فورًا.",
    workingHoursNote: "١٠:٠٠ ص – ٩:٠٠ م (يعمل طوال اليوم والمناسبات)",
    cautionNote: "الرسوم أعلى قليلاً من السجل العادي لكن الإجراءات أسرع بكثير."
  },
  {
    id: "civil-giza-smart",
    serviceCategory: "أحوال مدنية",
    governorate: "giza",
    name: "سجل مدني الجيزة النموذجي (مول العرب)",
    area: "مول العرب، مدينة السادس من أكتوبر، الجيزة",
    notes: "يقدم خدمات السجل المدني الممتازة والمستعجلة وسحب الاستمارات.",
    workingHoursNote: "١٠:٠٠ ص – ٩:٠٠ م",
    cautionNote: "رسوم الخدمة الحكومية في المولات تزيد بمقدار باقة الخدمة المتميزة."
  },
  // المرور
  {
    id: "traffic-cairo-1",
    serviceCategory: "مرور",
    governorate: "cairo",
    name: "وحدة مرور النزهة",
    area: "مصر الجديدة، القاهرة",
    notes: "تخدم سكان النزهة ومصر الجديدة. يفضل حجز الكشف الطبي مسبقًا.",
    workingHoursNote: "٨:٠٠ ص – ٢:٠٠ م",
    cautionNote: "اختبار القيادة يبدأ في تمام الساعة ٩:٣٠ ص، الحضور المتأخر يضيع الدور."
  },
  {
    id: "traffic-giza-1",
    serviceCategory: "مرور",
    governorate: "giza",
    name: "وحدة مرور الدقي",
    area: "بين السرايات، الدقي، الجيزة",
    notes: "تخدم سكان الدقي والعجوزة والمهندسين وجزء من الجيزة.",
    workingHoursNote: "٨:٠٠ ص – ٢:٠٠ م",
    cautionNote: "اتأكد من سداد المخالفات والحصول على شهادة براءة الذمة قبل الحضور إن كنت تجدد."
  },
  // الشهر العقاري
  {
    id: "shahr-cairo-1",
    serviceCategory: "شهر عقاري وتوثيق",
    governorate: "cairo",
    name: "مكتب توثيق ضواحي الجيزة ومصر الجديدة",
    area: "مصر الجديدة، القاهرة",
    notes: "يتميز بتقديم توثيقات مجمعة وسريعة.",
    workingHoursNote: "٩:٠٠ ص – ٣:٠٠ م",
    cautionNote: "يفضل الحجز عبر تطبيق (أرغب في عمل توكيل) ليدخل العميل مباشرة بدون طابور."
  }
];

export function getOfficeGuidance(category: string, governorate: string, serviceId?: string): {
  office?: GovernmentOffice;
  guidanceText: string;
} {
  // Try to find specific office matching criteria
  let office = officesData.find(
    (o) =>
      o.governorate === governorate &&
      (serviceId ? o.serviceId === serviceId : o.serviceCategory === category)
  );

  // Fallback to general category match in the governorate if specific serviceId office is missing
  if (!office && governorate !== "other") {
    office = officesData.find(
      (o) => o.governorate === governorate && o.serviceCategory === category
    );
  }

  const governorateArabic: Record<string, string> = {
    cairo: "لقاهرة",
    giza: "لجيزة",
    alex: "لإسكندرية",
    sharqiya: "لشرقية",
    daqahliya: "لدقهلية",
    other: "لمحافظتك"
  };

  const govName = governorateArabic[governorate] || "لمحافظتك";

  const fallbackText = `يرجى التوجه إلى المكتب الحكومي التابع لمحل الإقامة في ا${govName}. العنوان الدقيق والرسوم التفصيلية قد تختلف قليلاً حسب منطقتك الإدارية. يفضل دائمًا سؤال موظف الاستعلامات بالداخل فور وصولك.`;

  return {
    office,
    guidanceText: fallbackText,
  };
}
