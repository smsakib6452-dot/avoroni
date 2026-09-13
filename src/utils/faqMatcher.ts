import { PRODUCT_FAQS, FAQItem } from "@/data/productFaqs";

// Canonical keyword synsets for Bengali, English, and Banglish phonetic variations
const SYNONYM_MAP: Record<string, string[]> = {
  price: [
    "price",
    "cost",
    "rate",
    "dam",
    "koto",
    "taka",
    "how much",
    "দাম",
    "টাকা",
    "মূল্য",
    "রেট",
    "কত",
  ],
  wash: [
    "wash",
    "care",
    "clean",
    "cleaning",
    "dry clean",
    "detergent",
    "maintain",
    "iron",
    "storage",
    "dhoa",
    "dhute",
    "saf",
    "ধোয়া",
    "ওয়াশ",
    "যত্ন",
    "ইস্ত্রি",
    "পরিষ্কার",
    "সংরক্ষণ",
  ],
  blouse: [
    "blouse",
    "blouse piece",
    "running blouse",
    "unstitched",
    "length",
    "meter",
    "meters",
    "bohor",
    "ব্লাউজ",
    "ব্লাউজ পিস",
    "বহর",
    "মিটার",
    "কাপড়",
  ],
  delivery: [
    "delivery",
    "shipping",
    "ship",
    "courier",
    "charge",
    "postage",
    "time",
    "pathano",
    "kobe pabo",
    "পৌঁছাবে",
    "কুরিয়ার",
    "শিপিং",
    "ডেলিভারি",
    "চার্জ",
    "কত দিন",
  ],
  studio: [
    "studio",
    "atelier",
    "store",
    "shop",
    "banani",
    "address",
    "location",
    "where",
    "visit",
    "appointment",
    "thikana",
    "dokan",
    "কই",
    "কোথায়",
    "ঠিকানা",
    "স্টুডিও",
    "দোকান",
    "বনানী",
    "লোকেশন",
  ],
  authentic: [
    "authentic",
    "real",
    "original",
    "genuine",
    "fake",
    "certificate",
    "gi",
    "silk mark",
    "asol",
    "khanti",
    "nakol",
    "আসল",
    "খাঁটি",
    "নকল",
    "সার্টিফিকেট",
    "গ্যারান্টি",
  ],
  wedding: [
    "wedding",
    "bridal",
    "marriage",
    "reception",
    "trousseau",
    "biye",
    "kone",
    "bou",
    "বিয়ে",
    "বিয়ের",
    "কনে",
    "বউ",
    "ব্রাইডাল",
    "রিসিপশন",
  ],
  jamdani: ["jamdani", "dhakai", "jamdanir", "জামদানি", "ঢাকাই"],
  rajshahi: ["rajshahi", "mulberry", "resham", "reshom", "silk", "রাজশাহী", "রেশম", "সিল্ক"],
  mirpur: ["mirpur", "katan", "mirpur katan", "মিরপুর", "কাতান"],
  tangail: ["tangail", "taant", "tant", "টাঙ্গাইল", "তাঁত"],
  banarasi: ["banarasi", "benarasi", "kashi", "varanasi", "বেনারসি", "কাশি"],
  kanchipuram: ["kanchipuram", "kanjivaram", "temple", "কাঞ্জিভরম", "কাঞ্চিপুরম"],
  chanderi: ["chanderi", "tissue", "sheer", "চান্দেরি", "টিস্যু"],
};

export interface MatchResult {
  match: FAQItem | null;
  confidence: number;
  suggestions: FAQItem[];
}

/**
 * Clean & tokenize a text string for fuzzy semantic matching
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

/**
 * Calculate relevance score between user query tokens and an FAQ item
 */
function calculateScore(queryTokens: string[], faq: FAQItem): number {
  let score = 0;
  const combinedTokens = queryTokens;

  // 1. Check exact matches in question
  const qEnTokens = tokenize(faq.question.en);
  const qBnTokens = tokenize(faq.question.bn);

  for (const token of combinedTokens) {
    if (qEnTokens.includes(token)) score += 3;
    if (qBnTokens.includes(token)) score += 3.5;

    // Check keyword list
    for (const kw of faq.keywords) {
      const kwTokens = tokenize(kw);
      if (kwTokens.includes(token)) {
        score += 2.5;
      } else if (kw.includes(token) && token.length > 2) {
        score += 1.5;
      }
    }

    // Check category match
    if (faq.category.toLowerCase().includes(token)) {
      score += 2;
    }
  }

  // 2. Expand query using Synonym Map
  for (const [concept, syns] of Object.entries(SYNONYM_MAP)) {
    const queryHasConcept = combinedTokens.some(
      (t) => syns.includes(t) || syns.some((s) => s.includes(t) && t.length > 2)
    );

    if (queryHasConcept) {
      // Check if this FAQ relates to this concept
      const faqRelates =
        faq.category.includes(concept) ||
        faq.keywords.some((k) =>
          syns.some((s) => k.toLowerCase().includes(s.toLowerCase()))
        ) ||
        syns.some(
          (s) =>
            faq.question.en.toLowerCase().includes(s) ||
            faq.question.bn.toLowerCase().includes(s)
        );

      if (faqRelates) {
        score += 3.5;
      }
    }
  }

  return score;
}

/**
 * Find best FAQ match for an incoming user query
 */
export function findBestFAQ(query: string): MatchResult {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return {
      match: null,
      confidence: 0,
      suggestions: PRODUCT_FAQS.slice(0, 3),
    };
  }

  // Calculate scores for all FAQs
  const scored = PRODUCT_FAQS.map((faq) => ({
    faq,
    score: calculateScore(tokens, faq),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const threshold = 3.0; // Minimum confidence to accept as direct answer

  if (best && best.score >= threshold) {
    // Generate related suggestions
    const suggestions: FAQItem[] = [];

    // Add follow-up questions explicitly defined
    if (best.faq.followUpQuestions && best.faq.followUpQuestions.length > 0) {
      for (const fId of best.faq.followUpQuestions) {
        const found = PRODUCT_FAQS.find((item) => item.id === fId);
        if (found && !suggestions.some((s) => s.id === found.id)) {
          suggestions.push(found);
        }
      }
    }

    // Fill with top scored items if suggestions < 3
    for (const item of scored) {
      if (
        item.faq.id !== best.faq.id &&
        !suggestions.some((s) => s.id === item.faq.id) &&
        suggestions.length < 3
      ) {
        suggestions.push(item.faq);
      }
    }

    return {
      match: best.faq,
      confidence: best.score,
      suggestions,
    };
  }

  // No strong match - return top 3 general/popular recommendations
  return {
    match: null,
    confidence: best ? best.score : 0,
    suggestions: [
      PRODUCT_FAQS.find((f) => f.id === "jamdani-overview")!,
      PRODUCT_FAQS.find((f) => f.id === "mirpur-overview")!,
      PRODUCT_FAQS.find((f) => f.id === "saree-care-general")!,
    ].filter(Boolean),
  };
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQItem | undefined {
  return PRODUCT_FAQS.find((f) => f.id === id);
}
