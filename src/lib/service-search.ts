/**
 * Smart Arabic text normalization and local search layer for Sekka
 */

import { type Service } from "./services-data";

export function normalizeArabic(text: string): string {
  if (!text) return "";
  let norm = text.toLowerCase();
  
  // Remove Tashkeel (Arabic diacritics)
  norm = norm.replace(/[\u064B-\u0652]/g, "");
  
  // Normalize Alif variations (أ, إ, آ => ا)
  norm = norm.replace(/[أإآ]/g, "ا");
  
  // Normalize Teh Marbuta and Heh at the end of words or generally (ة => ه)
  norm = norm.replace(/ة/g, "ه");
  
  // Normalize Yea and Alef Maksura (ى => ي)
  norm = norm.replace(/ى/g, "iy"); // Normalize both ى and y to common forms or just standardise
  norm = norm.replace(/[يى]/g, "ي");
  
  // Normalize extra spaces
  norm = norm.replace(/\s+/g, " ").trim();
  
  return norm;
}

// Map of synonyms to Service IDs
const synonymMatches: Record<string, string[]> = {
  "كعب": ["kaab-amal"],
  "كعب عمل": ["kaab-amal"],
  "مكتب العمل": ["kaab-amal"],
  "بطاقه": ["renew-id"],
  "شخصيه": ["renew-id"],
  "رقم قومي": ["renew-id"],
  "قومي": ["renew-id"],
  "منتهيه": ["renew-id"],
  "رخصه": ["driving-license"],
  "قياده": ["driving-license"],
  "مرور": ["driving-license"],
  "رخصه عربيه": ["driving-license"],
  "عربيه": ["driving-license"],
  "توثيق": ["contract-auth"],
  "عقد": ["contract-auth"],
  "شهر عقاري": ["contract-auth"],
  "توكيل": ["contract-auth", "passport-renew"], // can also map to passport-renew or similar
  "سجل": ["commercial-reg"],
  "سجل تجاري": ["commercial-reg"],
  "نشاط": ["commercial-reg"],
  "شركه": ["commercial-reg"],
  "فيش": ["fish-w-tashbeeh"],
  "صحيفه جنائيه": ["fish-w-tashbeeh"],
  "جنائي": ["fish-w-tashbeeh"],
  "ميلاد": ["birth-cert"],
  "شهاده ميلاد": ["birth-cert"],
  "قيد": ["family-record"],
  "عائلي": ["family-record"],
  "تاميني": ["insurance-number"],
  "رقم تاميني": ["insurance-number"],
  "تامينات": ["insurance-number"],
  "جواز": ["passport-renew"],
  "سفر": ["passport-renew"],
  "باسبور": ["passport-renew"],
};

export function searchServices(query: string, allServices: Service[]): { service: Service; score: number }[] {
  const cleanQ = normalizeArabic(query);
  if (!cleanQ) {
    return allServices.map(s => ({ service: s, score: 1 }));
  }

  const results = allServices.map((service) => {
    let score = 0;
    const cleanName = normalizeArabic(service.name);
    const cleanDesc = normalizeArabic(service.description);
    const cleanCat = normalizeArabic(service.category);

    // Exact Match on Name
    if (cleanName === cleanQ) {
      score += 150;
    }
    // Starts with Query
    else if (cleanName.startsWith(cleanQ)) {
      score += 100;
    }
    // Contains Query
    else if (cleanName.includes(cleanQ)) {
      score += 70;
    }

    // Synonym Score matching
    for (const [synonym, targetIds] of Object.entries(synonymMatches)) {
      const cleanSyn = normalizeArabic(synonym);
      if (cleanQ.includes(cleanSyn) || cleanSyn.includes(cleanQ)) {
        if (targetIds.includes(service.id)) {
          score += 120; // High relevance match for mapped synonyms!
        }
      }
    }

    // Description match
    if (cleanDesc.includes(cleanQ)) {
      score += 40;
    }

    // Category match
    if (cleanCat.includes(cleanQ)) {
      score += 20;
    }

    // Deep checks on documents names
    const docMatches = service.documents.some(doc => normalizeArabic(doc.name).includes(cleanQ));
    if (docMatches) {
      score += 30;
    }

    // Word-by-word intersection score to make search flexible
    const queryWords = cleanQ.split(" ").filter(w => w.length > 1);
    let wordMatches = 0;
    for (const word of queryWords) {
      if (cleanName.includes(word)) wordMatches += 25;
      else if (cleanDesc.includes(word)) wordMatches += 10;
    }
    score += wordMatches;

    return { service, score };
  });

  // Filter out zero-score items and sort descending
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
