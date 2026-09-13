export interface ProductReference {
  id: string;
  name: { en: string; bn: string };
  weave: { en: string; bn: string };
  price: { en: string; bn: string };
  image: string;
  sectionId: string;
}

export interface FAQItem {
  id: string;
  category:
    | "jamdani"
    | "rajshahi"
    | "mirpur_katan"
    | "tangail"
    | "banarasi"
    | "kanchipuram"
    | "chanderi"
    | "care"
    | "blouse"
    | "delivery"
    | "orders"
    | "studio"
    | "authenticity"
    | "general";
  keywords: string[];
  question: { en: string; bn: string };
  answer: { en: string; bn: string };
  product?: ProductReference;
  followUpQuestions?: string[]; // IDs of related FAQs
}

export const PRODUCT_FAQS: FAQItem[] = [
  // ==========================================
  // 01: DHAKAI JAMDANI
  // ==========================================
  {
    id: "jamdani-overview",
    category: "jamdani",
    keywords: [
      "jamdani",
      "dhakai",
      "dhaka",
      "unesco",
      "gi",
      "narayanganj",
      "shitalakshya",
      "weave",
      "fabric",
      "জামদানি",
      "ঢাকাই",
      "ঐতিহ্য",
      "শীতলক্ষ্যা",
    ],
    question: {
      en: "What makes Avoroni Dhakai Jamdani authentic and unique?",
      bn: "আভরণী ঢাকাই জামদানির বিশেষত্ব ও আসল হওয়ার কারণ কী?",
    },
    answer: {
      en: "Our Dhakai Jamdanis are certified UNESCO Intangible Cultural Heritage textiles, hand-woven along the Shitalakshya River in Narayanganj by master generational karigars. Woven on traditional pit-looms using 84-count fine cotton-silk with supplementary floral and geometric butidar motifs, each heirloom drape takes between 40 to 120 days to complete.",
      bn: "আমাদের ঢাকাই জামদানি ইউনেস্কো স্বীকৃত জিআই ঐতিহ্যবাহী তাঁত শিল্প। নারায়ণগঞ্জের শীতলক্ষ্যা নদী পাড়ে বংশপরম্পরায় দক্ষ তাঁতিরা ৮৪-কাউন্ট সুতো ও রেশমে খোদাইকৃত জ্যামিতিক নকশায় প্রতিটি শাড়ি বুনে থাকেন। একেকটি জামদানি তৈরিতে ৪০ থেকে ১২০ দিন সময় লাগে।",
    },
    product: {
      id: "jamdani",
      name: { en: "Dhakai Jamdani", bn: "ঢাকাই জামদানি" },
      weave: {
        en: "UNESCO Intangible Heritage 84-Count Weave",
        bn: "ইউনেস্কো স্বীকৃত ৮৪-কাউন্ট জামদানি",
      },
      price: { en: "৳ 8,800 – ৳ 9,900", bn: "৳ ৮,৮০০ – ৳ ৯,৯০০" },
      image: "/images/colorways/jamdani_white.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["jamdani-price", "jamdani-colors", "jamdani-care"],
  },
  {
    id: "jamdani-price",
    category: "jamdani",
    keywords: [
      "jamdani price",
      "jamdani dam",
      "jamdani cost",
      "how much jamdani",
      "jamdani koto",
      "দাম",
      "কত",
      "জামদানি দাম",
    ],
    question: {
      en: "What is the price range for Dhakai Jamdani sarees?",
      bn: "ঢাকাই জামদানি শাড়ির দাম কত?",
    },
    answer: {
      en: "Avoroni heirloom Dhakai Jamdani sarees range from ৳ 8,800 to ৳ 9,900 depending on the intricate count of motifs, thread fineness, and zari detailing. Exclusive bridal signature drapes are also available upon bespoke request.",
      bn: "আভরণীর ঢাকাই জামদানি শাড়ির দাম ৳ ৮,৮০০ থেকে ৳ ৯,৯০০ পর্যন্ত, যা সুতোর কাউন্ট, বুটির সূক্ষ্মতা ও জরির কারুকাজের ওপর নির্ভর করে। বিশেষ ব্রাইডাল জামদানি অর্ডারেও তৈরি করা হয়।",
    },
    product: {
      id: "jamdani",
      name: { en: "Dhakai Jamdani", bn: "ঢাকাই জামদানি" },
      weave: {
        en: "UNESCO Heritage Certified",
        bn: "ইউনেস্কো জিআই সার্টিফায়েড",
      },
      price: { en: "৳ 8,800 – ৳ 9,900", bn: "৳ ৮,৮০০ – ৳ ৯,৯০০" },
      image: "/images/colorways/jamdani_red.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["jamdani-colors", "delivery-time"],
  },
  {
    id: "jamdani-colors",
    category: "jamdani",
    keywords: [
      "jamdani colors",
      "shades of jamdani",
      "white jamdani",
      "red jamdani",
      "jamdani colorway",
      "রং",
      "কালার",
      "জামদানির রঙ",
    ],
    question: {
      en: "Which colorways are available in Dhakai Jamdani?",
      bn: "ঢাকাই জামদানিতে কী কী রঙ পাওয়া যায়?",
    },
    answer: {
      en: "We offer 7 signature heritage colorways: Shweto White & Gold (৳9,500), Crimson Red (৳9,800), Emerald Green (৳9,200), Haldi Saffron Yellow (৳8,800), Meghdoot Royal Blue (৳9,400), Gulabi Rose Pink (৳9,600), and Royal Jamuni Purple (৳9,900).",
      bn: "আমাদের জামদানিতে রয়েছে ৭টি সিগনেচার রঙ: শুভ্র শ্বেত ও সোনালী (৳৯,৫০০), লাল (৳৯,৮০০), পান্না সবুজ (৳৯,২০০), হলুদ জাফরান (৳৮,৮০০), মেঘদূত নীল (৳৯,৪০০), গোলাপী নূর (৳৯,৬০০), ও রয়েল জামুনি বেগুনি (৳৯,৯০০)।",
    },
    product: {
      id: "jamdani",
      name: { en: "Dhakai Jamdani Capsule", bn: "ঢাকাই জামদানি কালেকশন" },
      weave: {
        en: "7 Signature Heritage Colorways",
        bn: "৭টি ঐতিহ্যবাহী রঙের বৈচিত্র্য",
      },
      price: { en: "From ৳ 8,800", bn: "শুরু ৳ ৮,৮০০ থেকে" },
      image: "/images/colorways/jamdani_white.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["jamdani-care", "blouse-piece"],
  },

  // ==========================================
  // 02: RAJSHAHI MULBERRY SILK
  // ==========================================
  {
    id: "rajshahi-overview",
    category: "rajshahi",
    keywords: [
      "rajshahi",
      "silk",
      "mulberry",
      "resham",
      "reshom",
      "pure silk",
      "রাজশাহী",
      "রেশম",
      "সিল্ক",
      "তুত সিল্ক",
    ],
    question: {
      en: "Tell me about Rajshahi Mulberry Silk sarees.",
      bn: "রাজশাহী রেশম সিল্ক শাড়ির বিস্তারিত জানাবেন?",
    },
    answer: {
      en: "Sourced directly from the historic Silk City of Rajshahi, our sarees are crafted from 100% pure hand-reeled Bombyx mori mulberry silk. Known for their natural buttery sheen, lightweight fluid drape, and breathability, they are perfect for both formal gatherings and festive evenings.",
      bn: "বাংলার ঐতিহাসিক রেশম নগরী রাজশাহীর ১০০% খাঁটি তুত সিল্ক থেকে আমাদের শাড়ি প্রস্তুত করা হয়। এটি অত্যন্ত হালকা, ত্বকের জন্য আরামদায়ক এবং এতে রয়েছে স্বাভাবিক রেশমি উজ্জ্বলতা, যা যেকোনো উৎসব বা পার্টিতে আভিজাত্য এনে দেয়।",
    },
    product: {
      id: "rajshahi",
      name: { en: "Rajshahi Mulberry Silk", bn: "রাজশাহী রেশম সিল্ক" },
      weave: {
        en: "Pure Hand-Reeled Silk Twill",
        bn: "খাঁটি হাতে বোনা তুত সিল্ক",
      },
      price: { en: "৳ 7,900 – ৳ 8,600", bn: "৳ ৭,৯০০ – ৳ ৮,৬০০" },
      image: "/images/colorways/rajshahi_blue.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["rajshahi-price", "saree-care-general"],
  },
  {
    id: "rajshahi-price",
    category: "rajshahi",
    keywords: [
      "rajshahi price",
      "rajshahi silk dam",
      "silk price",
      "rajshahi koto",
      "রাজশাহী সিল্কের দাম",
    ],
    question: {
      en: "What is the price of Rajshahi Silk sarees?",
      bn: "রাজশাহী সিল্ক শাড়ির দাম কত?",
    },
    answer: {
      en: "Avoroni Rajshahi Mulberry Silk sarees are priced between ৳ 7,900 and ৳ 8,600. Available shades include Midnight Sapphire Blue, Bridal Red, Peacock Emerald, Golden Mustard, Damascus Rose Pink, and Jamuni Purple.",
      bn: "আভরণীর রাজশাহী রেশম সিল্ক শাড়ির মূল্য ৳ ৭,৯০০ থেকে ৳ ৮,৬০০। এতে মিডনাইট নীল, ব্রাইডাল লাল, ময়ূরকণ্ঠী সবুজ, সোনালী হলুদ, গোলাপি ও জামুনি রঙ পাওয়া যাচ্ছে।",
    },
    product: {
      id: "rajshahi",
      name: { en: "Midnight Sapphire Silk", bn: "মিডনাইট নীল রেশম সিল্ক" },
      weave: {
        en: "Handloom Mulberry Twill",
        bn: "হ্যান্ডলুম তুত রেশম সিল্ক",
      },
      price: { en: "৳ 8,400", bn: "৳ ৮,৪০০" },
      image: "/images/colorways/rajshahi_blue.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["blouse-piece", "delivery-time"],
  },

  // ==========================================
  // 03: MIRPUR BRIDAL KATAN
  // ==========================================
  {
    id: "mirpur-overview",
    category: "mirpur_katan",
    keywords: [
      "mirpur",
      "katan",
      "bridal",
      "benarasi",
      "polli",
      "wedding",
      "zari",
      "kadwa",
      "মিরপুর",
      "কাতান",
      "বেনারসি",
      "বিয়ের শাড়ি",
      "ব্রাইডাল",
    ],
    question: {
      en: "What is special about the Mirpur Bridal Katan collection?",
      bn: "মিরপুর ব্রাইডাল কাতান শাড়ির বিশেষত্ব কী?",
    },
    answer: {
      en: "Woven in the legendary Benarasi Polli of Mirpur, Dhaka, our Bridal Katans are the undisputed centerpiece of Bengali weddings. They feature heavy hand-twisted pure mulberry silk with opulent 24k gold metallic Kadwa zari brocade borders and a grand pallu designed to endure as family heirlooms.",
      bn: "মিরপুর বেনারসি পল্লীর খাঁটি সিল্কের জমিনে ঘন ব্রাইডাল জরির কারুকাজে বোনা এই কাতান বাঙালি কনের বিয়ের প্রধান আকর্ষণ। এতে রয়েছে ২৪ ক্যারেট সোনার তারের কাড়োয়া ব্রোকেড ও জমকালো আঁচল, যা বংশপরম্পরায় সংরক্ষণের মতো ঐতিহ্যবাহী।",
    },
    product: {
      id: "mirpur-katan",
      name: { en: "Mirpur Bridal Katan", bn: "মিরপুর ব্রাইডাল কাতান" },
      weave: {
        en: "Bridal Zari & Pure Kadwa Brocade",
        bn: "খাঁটি জরি ও ব্রাইডাল কাতান ব্রোকেড",
      },
      price: { en: "৳ 10,900 – ৳ 12,800", bn: "৳ ১০,৯০০ – ৳ ১২,৮০০" },
      image: "/images/colorways/mirpur_red.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["mirpur-colors", "studio-appointment"],
  },
  {
    id: "mirpur-colors",
    category: "mirpur_katan",
    keywords: [
      "bridal red katan",
      "mirpur colors",
      "wedding saree color",
      "maharani red",
      "বিয়ের লাল কাতান",
      "লাল শাড়ি",
    ],
    question: {
      en: "What colors are available in Mirpur Bridal Katan?",
      bn: "মিরপুর ব্রাইডাল কাতানে কী কী রঙ আছে?",
    },
    answer: {
      en: "Popular wedding shades include: Maharani Bridal Red (৳12,500), Emerald Brocade Green (৳11,800), Haldi Shondhya Yellow (৳10,900), Royal Sapphire Blue (৳12,200), Rani Magenta Pink (৳11,500), and Deep Jamuni Purple (৳12,800).",
      bn: "জনপ্রিয় বিয়ের রঙগুলো হলো: মহারানী বিয়ের লাল কাতান (৳১২,৫০০), পান্না সবুজ ব্রোকেড (৳১১,৮০০), হলুদ সন্ধ্যা কাতান (৳১০,৯০০), রয়েল ব্লু কাতান (৳১২,২০০), রানী ম্যাজেন্টা (৳১১,৫০০), এবং গাঢ় জামুনি (৳১২,৮০০)।",
    },
    product: {
      id: "mirpur-katan",
      name: { en: "Maharani Bridal Red", bn: "মহারানী বিয়ের লাল কাতান" },
      weave: {
        en: "Pure Kadwa Silk & Gold Zari",
        bn: "খাঁটি সিল্ক ও স্বর্ণ জরি",
      },
      price: { en: "৳ 12,500", bn: "৳ ১২,৫০০" },
      image: "/images/colorways/mirpur_red.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["blouse-piece", "studio-appointment"],
  },

  // ==========================================
  // 04: TANGAIL SILK TAANT
  // ==========================================
  {
    id: "tangail-overview",
    category: "tangail",
    keywords: [
      "tangail",
      "taant",
      "tant",
      "cotton",
      "handloom",
      "comfortable",
      "lightweight",
      "টাঙ্গাইল",
      "তাঁত",
      "সুতি",
      "আরামদায়ক",
    ],
    question: {
      en: "What makes Tangail Silk Taant sarees unique?",
      bn: "টাঙ্গাইল তাঁত সিল্ক শাড়ির বৈশিষ্ট্য কী?",
    },
    answer: {
      en: "Tangail Taant is celebrated across Bengal for its featherweight comfort and soft fluid drape. Handcrafted by master weavers in Tangail from blended fine cotton and silk threads, it features delicate floral borders, making it effortless to wear for all-day celebrations and summer occasions.",
      bn: "টাঙ্গাইলের ঐতিহ্যবাহী তাঁত শিল্প এর অতি-হালকা ওজন ও মসৃণ ড্রেপের জন্য সুপরিচিত। মিহি কটন ও সিল্ক সুতোর সংমিশ্রণে হাতে বোনা এই শাড়ির আকর্ষণীয় ফুল-লতার পাড় গরমের দিন বা সারাদিনের অনুষ্ঠানের জন্য অত্যন্ত আরামদায়ক।",
    },
    product: {
      id: "tangail",
      name: { en: "Tangail Silk Taant", bn: "টাঙ্গাইল তাঁত সিল্ক" },
      weave: {
        en: "Fine Cotton-Silk Handloom Weave",
        bn: "হ্যান্ডলুম সূক্ষ্ম কটন-সিল্ক তাঁত",
      },
      price: { en: "৳ 4,200 – ৳ 4,800", bn: "৳ ৪,২০০ – ৳ ৪,৮০০" },
      image: "/images/colorways/tangail_yellow.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["tangail-price", "delivery-time"],
  },
  {
    id: "tangail-price",
    category: "tangail",
    keywords: [
      "tangail price",
      "tant price",
      "taant dam",
      "tangail koto",
      "টাঙ্গাইল শাড়ির দাম",
    ],
    question: {
      en: "What is the price of Tangail Silk Taant sarees?",
      bn: "টাঙ্গাইল তাঁত শাড়ির দাম কত?",
    },
    answer: {
      en: "Avoroni Tangail Silk Taant sarees are priced between ৳ 4,200 and ৳ 4,800. Colors include Basanti Haldi Yellow (৳4,500), Crimson Border Red (৳4,800), Pata Shobuj Green (৳4,200), Aakashi Blue (৳4,400), and Golapi Noor Pink (৳4,600).",
      bn: "টাঙ্গাইল তাঁত শাড়ির দাম ৳ ৪,২০০ থেকে ৳ ৪,৮০০। এর মধ্যে রয়েছে বাসন্তী হলুদ (৳৪,৫০০), রক্তলাল পাড় (৳৪,৮০০), পাতাসবুজ (৳৪,২০০), আকাশি নীল (৳৪,৪০০), ও গোলাপি আভা (৳৪,৬০০)।",
    },
    product: {
      id: "tangail",
      name: { en: "Basanti Haldi Taant", bn: "বাসন্তী হলুদ টাঙ্গাইল তাঁত" },
      weave: {
        en: "Gaye Holud & Festive Handloom",
        bn: "গায়ে হলুদ ও উৎসবের তাঁত",
      },
      price: { en: "৳ 4,500", bn: "৳ ৪,৫০০" },
      image: "/images/colorways/tangail_yellow.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["blouse-piece", "orders-shipping"],
  },

  // ==========================================
  // 05: KASHI BANARASI SILK
  // ==========================================
  {
    id: "banarasi-overview",
    category: "banarasi",
    keywords: [
      "banarasi",
      "kashi",
      "varanasi",
      "kadwa",
      "24k",
      "gold",
      "বেনারসি",
      "কাশি",
      "বারাণসী",
      "কাড়োয়া",
      "স্বর্ণ জরি",
    ],
    question: {
      en: "Tell me about the Kashi Banarasi Silk collection.",
      bn: "কাশি বেনারসি সিল্ক কালেকশন সম্পর্কে বিস্তারিত জানাবেন?",
    },
    answer: {
      en: "Woven on ancient jacquard looms in Varanasi with hand-twisted mulberry silk and pure 24k gold filigree zari, our Kashi Banarasi drapes are royal masterpieces. Priced between ৳ 12,900 and ৳ 14,800, they are treasured for royal receptions and weddings.",
      bn: "ঐতিহাসিক বারাণসীর জ্যাকার্ড তাঁতে খাঁটি রেশম ও ২৪ ক্যারেট সোনার জরির তারে বোনা রাজকীয় কাশি বেনারসি। এর মূল্য ৳ ১২,৯০০ থেকে ৳ ১৪,৮০০, যা বিয়ের রিসেপশন বা বিশেষ উৎসবের জন্য অনন্য।",
    },
    product: {
      id: "banaras",
      name: { en: "Kashi Banarasi Silk", bn: "কাশি বেনারসি সিল্ক" },
      weave: {
        en: "Kadwa Pure Silk & 24k Gold Zari",
        bn: "খাঁটি কাড়োয়া সিল্ক ও ২৪ ক্যারেট গোল্ড জরি",
      },
      price: { en: "৳ 12,900 – ৳ 14,800", bn: "৳ ১২,৯০০ – ৳ ১৪,৮০০" },
      image: "/images/colorways/banaras_red.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["banarasi-colors", "studio-appointment"],
  },
  {
    id: "banarasi-colors",
    category: "banarasi",
    keywords: [
      "banarasi colors",
      "imperial red banarasi",
      "varanasi colors",
      "বেনারসি রঙ",
      "বেনারসি দাম",
    ],
    question: {
      en: "What colors are available in Kashi Banarasi?",
      bn: "কাশি বেনারসিতে কী কী রঙ রয়েছে?",
    },
    answer: {
      en: "Colorways include: Imperial Red Kadwa (৳14,500), Emerald Brocade (৳13,800), Saffron Gold Kadwa (৳12,900), Midnight Kashi Silk (৳14,200), Gulabi Zardozi Pink (৳13,500), and Royal Jamuni Kadwa (৳14,800).",
      bn: "রঙের তালিকায় রয়েছে: ইম্পেরিয়াল লাল কাড়োয়া (৳১৪,৫০০), সবুজ ব্রোকেড (৳১৩,৮০০), জাফরান গোল্ড (৳১২,৯০০), মিডনাইট নীল (৳১৪,২০০), গোলাপি জারদৌসি (৳১৩,৫০০), ও রয়েল জামুনি (৳১৪,৮০০)।",
    },
    product: {
      id: "banaras",
      name: { en: "Imperial Red Kadwa", bn: "ইম্পেরিয়াল লাল কাড়োয়া" },
      weave: {
        en: "Varanasi Pure Jacquard Silk",
        bn: "বারাণসী খাঁটি জ্যাকার্ড সিল্ক",
      },
      price: { en: "৳ 14,500", bn: "৳ ১৪,৫০০" },
      image: "/images/colorways/banaras_red.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["saree-care-general", "blouse-piece"],
  },

  // ==========================================
  // 06: KANCHIPURAM TEMPLE TWILL
  // ==========================================
  {
    id: "kanchipuram-overview",
    category: "kanchipuram",
    keywords: [
      "kanchipuram",
      "kanjivaram",
      "temple",
      "korvai",
      "tamil nadu",
      "কাঞ্জিভরম",
      "কাঞ্চিপুরম",
      "করভাই",
      "টেম্পল",
    ],
    question: {
      en: "What defines the Kanchipuram Temple Twill sarees?",
      bn: "কাঞ্জিভরম টেম্পল টুইল শাড়ির বৈশিষ্ট্য কী?",
    },
    answer: {
      en: "Crafted by master weavers in Tamil Nadu using the traditional Korvai interlocking technique, where body and borders are woven separately and locked together. Woven with heavy double-warp silk and temple gopuram motifs, prices range from ৳ 15,500 to ৳ 17,200.",
      bn: "তামিলনাড়ুর মাস্টার তাঁতিদের হাতে ঐতিহ্যবাহী 'করভাই' ইন্টারলকিং কৌশলে বোনা, যেখানে শাড়ির জমিন ও পাড় আলাদা বুনে জোড়া দেওয়া হয়। ভারী ডাবল-ওয়ার্প খাঁটি সিল্ক ও মন্দিরের নকশায় তৈরি এই শাড়ির মূল্য ৳ ১৫,৫০০ থেকে ৳ ১৭,২০০।",
    },
    product: {
      id: "kanchipuram",
      name: { en: "Kanchipuram Temple Twill", bn: "কাঞ্জিভরম টেম্পল টুইল" },
      weave: {
        en: "Korvai Interlocked Temple Borders",
        bn: "করভাই মন্দির নকশার খাঁটি জারি বুনন",
      },
      price: { en: "৳ 15,500 – ৳ 17,200", bn: "৳ ১৫,৫০০ – ৳ ১৭,২০০" },
      image: "/images/colorways/kanchipuram_green.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["kanchipuram-colors", "studio-appointment"],
  },
  {
    id: "kanchipuram-colors",
    category: "kanchipuram",
    keywords: [
      "kanchipuram colors",
      "kanjivaram green",
      "kanchipuram red",
      "কাঞ্জিভরম রঙ",
    ],
    question: {
      en: "What colors are available in Kanchipuram sarees?",
      bn: "কাঞ্জিভরম শাড়িতে কী কী রঙ পাওয়া যায়?",
    },
    answer: {
      en: "Shades include: Peacock Emerald Korvai (৳16,500), Temple Red Kanjivaram (৳17,200), Haldi Amber (৳15,500), Sapphire Indigo (৳15,900), Lotus Rani Pink (৳16,200), and Jamuni Temple Zari (৳16,800).",
      bn: "রঙের বৈচিত্র্য: ময়ূরকণ্ঠী সবুজ করভাই (৳১৬,৫০০), টেম্পল লাল (৳১৭,২০০), হলুদ আম্বর (৳১৫,৫০০), নীলমণি নীল (৳১৫,৯০০), পদ্ম রানী গোলাপি (৳১৬,২০০), ও জামুনি মন্দির জারি (৳১৬,৮০০)।",
    },
    product: {
      id: "kanchipuram",
      name: { en: "Peacock Emerald Korvai", bn: "ময়ূরকণ্ঠী সবুজ করভাই" },
      weave: {
        en: "Double Warp Kanchipuram Twill",
        bn: "ডাবল ওয়ার্প কাঞ্জিভরম সিল্ক",
      },
      price: { en: "৳ 16,500", bn: "৳ ১৬,৫০০" },
      image: "/images/colorways/kanchipuram_green.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["saree-care-general", "blouse-piece"],
  },

  // ==========================================
  // 07: CHANDERI SHEER TISSUE
  // ==========================================
  {
    id: "chanderi-overview",
    category: "chanderi",
    keywords: [
      "chanderi",
      "tissue",
      "sheer",
      "lightweight",
      "party",
      "evening",
      "madhya pradesh",
      "চান্দেরি",
      "টিস্যু",
      "স্বচ্ছ",
      "পার্টি শাড়ি",
    ],
    question: {
      en: "What are the highlights of the Chanderi Sheer Tissue sarees?",
      bn: "চান্দেরি শিয়ার টিস্যু শাড়ির বিশেষত্ব কী?",
    },
    answer: {
      en: "Woven in Madhya Pradesh from ultra-fine cotton-silk blends with spun metallic filaments, Chanderi tissue is celebrated for its airy translucency and delicate shimmer. Priced between ৳ 7,200 and ৳ 8,100, it's the ultimate choice for evening cocktail gatherings and festive dinners.",
      bn: "মধ্যপ্রদেশের ঐতিহ্যবাহী সূক্ষ্ম কটন-সিল্ক ও ধাতব তারের বুননে তৈরি এই চান্দেরি টিস্যু অত্যন্ত স্বচ্ছ ও স্নিগ্ধ চকচকে। এর মূল্য ৳ ৭,২০০ থেকে ৳ ৮,১০০, যা সান্ধ্যকালীন অনুষ্ঠান বা পার্টির জন্য নিখুঁত।",
    },
    product: {
      id: "chanderi",
      name: { en: "Chanderi Sheer Tissue", bn: "চান্দেরি শিয়ার টিস্যু" },
      weave: {
        en: "Featherweight Sheer Tissue with Micro Butis",
        bn: "অতি-হালকা স্বচ্ছ সিল্ক টিস্যু ও জরি বুটি",
      },
      price: { en: "৳ 7,200 – ৳ 8,100", bn: "৳ ৭,২০০ – ৳ ৮,১০০" },
      image: "/images/colorways/chanderi_yellow.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["chanderi-colors", "delivery-time"],
  },
  {
    id: "chanderi-colors",
    category: "chanderi",
    keywords: [
      "chanderi colors",
      "chanderi price",
      "amber tissue",
      "চান্দেরি রঙ",
      "চান্দেরি দাম",
    ],
    question: {
      en: "Which colors can I get in Chanderi Sheer Tissue?",
      bn: "চান্দেরি টিস্যু শাড়িতে কী কী রঙ পাওয়া যায়?",
    },
    answer: {
      en: "Available shades include: Golden Amber Tissue (৳7,500), Ruby Red (৳7,900), Emerald Sheer (৳7,200), Sapphire Mist Blue (৳7,400), Damascus Rose Pink (৳7,800), and Royal Jamuni (৳8,100).",
      bn: "পাওয়া যাচ্ছে: সোনালী আম্বর টিস্যু (৳৭,৫০০), রুবি লাল (৳৭,৯০০), পান্না সবুজ (৳৭,২০০), নীল কুয়াশা (৳৭,৪০০), গোলাপ শিয়ার (৳৭,৮০০), ও রয়েল জামুনি (৳৮,১০০)।",
    },
    product: {
      id: "chanderi",
      name: { en: "Golden Amber Tissue", bn: "সোনালী আম্বর টিস্যু" },
      weave: {
        en: "Cotton-Silk Blend with Zari",
        bn: "কটন-সিল্ক মিশ্রণ ও সূক্ষ্ম জরি",
      },
      price: { en: "৳ 7,500", bn: "৳ ৭,৫০০" },
      image: "/images/colorways/chanderi_yellow.jpg",
      sectionId: "origin",
    },
    followUpQuestions: ["saree-care-general", "blouse-piece"],
  },

  // ==========================================
  // 08: BLOUSE PIECE INCLUSION
  // ==========================================
  {
    id: "blouse-piece",
    category: "blouse",
    keywords: [
      "blouse",
      "blouse piece",
      "running blouse",
      "unstitched",
      "length",
      "meters",
      "bohor",
      "মিটার",
      "ব্লাউজ",
      "ব্লাউজ পিস",
      "লড়",
      "বহর",
    ],
    question: {
      en: "Do Avoroni sarees include a blouse piece? What is the total length?",
      bn: "শাড়ির সাথে কি ব্লাউজ পিস দেওয়া থাকে? শাড়ির দৈর্ঘ্য কত?",
    },
    answer: {
      en: "Yes, every single Avoroni saree includes an unstitched matching running blouse piece (0.8 meters / 32 inches). The full length is 6.3 meters (5.5 meters drape body + 0.8 meters blouse piece) with standard 45-47 inch width (বহর), ensuring ample fabric for custom tailored sleeve and neckline styles.",
      bn: "হ্যাঁ, আভরণীর প্রতিটি শাড়ির সাথেই ০.৮ মিটার (৩২ ইঞ্চি) আনস্টিচড ম্যাচিং রানিং ব্লাউজ পিস যুক্ত থাকে। শাড়ির মোট দৈর্ঘ্য ৬.৩ মিটার (৫.৫ মিটার ড্রেপ + ০.৮ মিটার ব্লাউজ পিস) এবং বহর ৪৫-৪৭ ইঞ্চি, যা যেকোনো ডিজাইনার ব্লাউজ তৈরির জন্য যথেষ্ট।",
    },
    followUpQuestions: ["saree-care-general", "studio-appointment"],
  },

  // ==========================================
  // 09: FABRIC CARE & MAINTENANCE
  // ==========================================
  {
    id: "saree-care-general",
    category: "care",
    keywords: [
      "wash",
      "care",
      "clean",
      "dry clean",
      "iron",
      "storage",
      "detergent",
      "maintain",
      "maintenance",
      "ধোয়া",
      "ওয়াশ",
      "ড্রাই ওয়াশ",
      "যত্ন",
      "ইস্ত্রি",
      "সংরক্ষণ",
    ],
    question: {
      en: "How should I wash and care for my luxury silk & Jamdani sarees?",
      bn: "খাঁটি সিল্ক ও জামদানি শাড়ির যত্ন ও ধোয়ার নিয়ম কী?",
    },
    answer: {
      en: "Heirloom sarees must be treated with delicate care:\n• Dry Clean Only: Never machine wash or soak handloom silks or Jamdani in household detergents.\n• Storage: Wrap in clean, unbleached muslin or cotton cloth. Avoid synthetic plastic covers which trap humidity.\n• Zari Care: Fold with the zari facing inside. Never spray perfume, deodorant, or hairspray directly onto metallic zari threads to prevent oxidation.\n• Aeration: Air out your sarees in mild shade every 3–4 months and change fold lines to prevent crease strain.",
      bn: "ঐতিহ্যবাহী শাড়ির যত্নে এই নিয়মগুলো মেনে চলুন:\n• শুধুমাত্র ড্রাই ওয়াশ: ওয়াশিং মেশিন বা ডিটারজেন্ট দিয়ে কখনোই ধোবেন না।\n• সংরক্ষণ: পরিষ্কার সুতি বা মসলিন কাপড়ে মুড়িয়ে রাখুন। প্লাস্টিকের ব্যাগে রাখবেন না।\n• জরির যত্ন: জরির অংশ ভেতরের দিকে ভাজ করুন। জরির ওপর সরাসরি পারফিউম স্প্রে করবেন না।\n• বাতাস লাগানো: ৩-৪ মাস পর পর হালকা ছায়ায় বাতাস লাগান এবং ভাঁজের দিক পরিবর্তন করুন।",
    },
    followUpQuestions: ["jamdani-overview", "mirpur-overview"],
  },

  // ==========================================
  // 10: DELIVERY, SHIPPING & PAYMENT
  // ==========================================
  {
    id: "delivery-time",
    category: "delivery",
    keywords: [
      "delivery",
      "shipping",
      "courier",
      "dhaka",
      "charge",
      "outside dhaka",
      "international",
      "fast",
      "how long",
      "ডেলিভারি",
      "শিপিং",
      "কুরিয়ার",
      "কত দিন",
      "সময়",
      "চার্জ",
    ],
    question: {
      en: "What are your delivery times and shipping rates?",
      bn: "ডেলিভারি হতে কত দিন সময় লাগে এবং ডেলিভারি চার্জ কত?",
    },
    answer: {
      en: "We offer prompt nationwide and worldwide delivery:\n• Inside Dhaka: Delivered within 24 to 48 hours (Free delivery on orders above ৳5,000; regular charge ৳80).\n• Outside Dhaka (All 64 districts): 2 to 3 business days via courier (Charge ৳150).\n• Worldwide International Shipping: 5 to 7 business days via DHL Express with complete international tracking.",
      bn: "আমাদের ডেলিভারি সময়সূচি:\n• ঢাকার ভেতরে: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে (৳৫,০০০-এর বেশি অর্ডারে ফ্রি ডেলিভারি, অন্যথায় ৳৮০)।\n• ঢাকার বাইরে (৬৪ জেলা): ২ থেকে ৩ কার্যদিবস কুরিয়ারের মাধ্যমে (চার্জ ৳১৫০)।\n• আন্তর্জাতিক ডেলিভারি: ৫ থেকে ৭ কার্যদিবসে DHL Express-এর মাধ্যমে বিশ্বব্যাপী ডেলিভারি দেওয়া হয়।",
    },
    followUpQuestions: ["payment-methods", "return-policy"],
  },
  {
    id: "payment-methods",
    category: "orders",
    keywords: [
      "payment",
      "bkash",
      "nagad",
      "card",
      "cod",
      "cash on delivery",
      "visa",
      "mastercard",
      "টাকা",
      "পেমেন্ট",
      "বিকাশ",
      "নগদ",
      "ক্যাশ অন ডেলিভারি",
    ],
    question: {
      en: "What payment methods do you accept?",
      bn: "কী কী মাধ্যমে পেমেন্ট করা যায়?",
    },
    answer: {
      en: "We accept all major secure payment channels:\n• Cash on Delivery (Inside Dhaka)\n• Mobile Banking: bKash, Nagad, Rocket\n• Credit/Debit Cards: Visa, MasterCard, American Express\n• Bank Wire Transfer & International Cards for overseas orders.",
      bn: "আমরা গ্রহণ করি:\n• ক্যাশ অন ডেলিভারি (ঢাকার ভেতরে)\n• মোবাইল ব্যাংকিং: বিকাশ, নগদ, রকেট\n• ক্রেডিট/ডেবিট কার্ড: ভিসা, মাস্টারকার্ড, অ্যামেক্স\n• আন্তর্জাতিক কার্ড ও ব্যাংক ট্রান্সফার (প্রবাসী গ্রাহকদের জন্য)।",
    },
    followUpQuestions: ["delivery-time", "return-policy"],
  },
  {
    id: "return-policy",
    category: "orders",
    keywords: [
      "return",
      "exchange",
      "refund",
      "policy",
      "damage",
      "change",
      "ফেরত",
      "রিটার্ন",
      "এক্সচেঞ্জ",
      "বদল",
    ],
    question: {
      en: "What is your exchange and return policy?",
      bn: "শাড়ি পছন্দ না হলে কি রিটার্ন বা এক্সচেঞ্জ করা যায়?",
    },
    answer: {
      en: "We offer a 7-Day Hassle-Free Exchange Policy. If you receive a damaged drape or wish to exchange the shade/weave, notify us within 7 days of receiving your package. Sarees must be unworn, in original fold, with security tags and signature Maison packaging intact.",
      bn: "আমাদের রয়েছে ৭ দিনের সহজ এক্সচেঞ্জ সুবিধা। শাড়িতে কোনো ত্রুটি থাকলে বা রঙ পরিবর্তন করতে চাইলে পার্সেল পাওয়ার ৭ দিনের মধ্যে আমাদের জানান। শাড়িটি অব্যবহৃত অবস্থায় আসল ভাঁজ, ট্যাগ ও মেসন বক্সসহ থাকতে হবে।",
    },
    followUpQuestions: ["studio-appointment", "contact-concierge"],
  },

  // ==========================================
  // 11: DHAKA STUDIO APPOINTMENT & CONTACT
  // ==========================================
  {
    id: "studio-appointment",
    category: "studio",
    keywords: [
      "studio",
      "atelier",
      "banani",
      "address",
      "visit",
      "location",
      "hours",
      "appointment",
      "map",
      "স্টুডিও",
      "বনানী",
      "ঠিকানা",
      "দেখা",
      "লোকেশন",
      "সময়",
    ],
    question: {
      en: "Where is your Dhaka Studio located and how can I visit?",
      bn: "আপনাদের ঢাকা স্টুডিও কোথায় এবং কীভাবে যেতে পারি?",
    },
    answer: {
      en: "Our flagship atelier is located at:\n📍 House 42, Road 11, Block D, Banani, Dhaka-1213.\n🕒 Opening Hours: Monday – Saturday, 10:00 AM – 8:00 PM BST (Closed on Sundays).\nWe welcome walk-ins, or you can book an exclusive bridal styling consultation with our resident drape curators by messaging us on WhatsApp.",
      bn: "আমাদের ফ্ল্যাগশিপ স্টুডিওর ঠিকানা:\n📍 বাড়ি ৪২, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩।\n🕒 সময়সূচি: সোমবার থেকে শনিবার, সকাল ১০টা – রাত ৮টা (রবিবার বন্ধ)।\nসরাসরি চলে আসতে পারেন অথবা ব্রাইডাল শাড়ি দেখার জন্য হোয়াটসঅ্যাপে বুকিং দিতে পারেন।",
    },
    followUpQuestions: ["contact-concierge", "mirpur-overview"],
  },
  {
    id: "authenticity-guarantee",
    category: "authenticity",
    keywords: [
      "authentic",
      "real",
      "original",
      "fake",
      "silk mark",
      "handloom board",
      "genuine",
      "আসল",
      "খাঁটি",
      "সার্টিফিকেট",
      "গ্যারান্টি",
    ],
    question: {
      en: "How can I be sure the sarees are 100% authentic handloom?",
      bn: "শাড়িগুলো যে ১০০% খাঁটি হাতে বোনা তাঁতের, তা কীভাবে নিশ্চিত হব?",
    },
    answer: {
      en: "Every Avoroni heirloom drape comes with our Certificate of Authenticity. Our Dhakai Jamdanis carry UNESCO Geographical Indication (GI) certification and we are registered under the Bangladesh Handloom Board. Our silks carry genuine Silk Mark verification ensuring pure natural filament fiber with zero polyester blends.",
      bn: "আভরণীর প্রতিটি শাড়ির সাথে মেসনের অথেনটিসিটি সার্টিফিকেট প্রদান করা হয়। আমাদের ঢাকাই জামদানি ইউনেস্কো জিআই সার্টিফায়েড এবং বাংলাদেশ তাঁত বোর্ডে নিবন্ধিত। সিল্ক শাড়িতে রয়েছে সিল্ক মার্ক নিশ্চয়তা, যা শতভাগ খাঁটি রেশমের প্রমাণ।",
    },
    followUpQuestions: ["jamdani-overview", "rajshahi-overview"],
  },
  {
    id: "contact-concierge",
    category: "general",
    keywords: [
      "contact",
      "phone",
      "call",
      "whatsapp",
      "human",
      "agent",
      "stylist",
      "যোগাযোগ",
      "ফোন",
      "হোয়াটসঅ্যাপ",
      "কথা",
    ],
    question: {
      en: "How do I speak with a human textile stylist or concierge?",
      bn: "ব্যক্তিগত স্টাইলিস্ট বা প্রতিনিধির সাথে কীভাবে সরাসরি কথা বলব?",
    },
    answer: {
      en: "You can speak directly with our Dhaka atelier concierge:\n📞 Direct Phone / WhatsApp: +880 1712-345678\n✉️ Email: contact@avoroni.com\nWe are active Mon–Sat, 10am–8pm BST and typically reply within 15 minutes on WhatsApp.",
      bn: "আমাদের ঢাকা স্টুডিওর সাথে সরাসরি কথা বলুন:\n📞 ফোন / হোয়াটসঅ্যাপ: +৮৮০ ১৭১২-৩৪৫৬৭৮\n✉️ ইমেইল: contact@avoroni.com\nসোম-শনি সকাল ১০টা থেকে রাত ৮টা পর্যন্ত হোয়াটসঅ্যাপে দ্রুত সাড়া দেওয়া হয়।",
    },
    followUpQuestions: ["studio-appointment", "delivery-time"],
  },
];

export const POPULAR_TOPIC_PILLS = [
  { id: "jamdani-overview", label: { en: "🌸 Dhakai Jamdani", bn: "🌸 ঢাকাই জামদানি" } },
  { id: "mirpur-overview", label: { en: "👑 Bridal Katan", bn: "👑 বিয়ের কাতান" } },
  { id: "rajshahi-overview", label: { en: "✨ Rajshahi Silk", bn: "✨ রাজশাহী সিল্ক" } },
  { id: "saree-care-general", label: { en: "🧼 Washing & Care", bn: "🧼 শাড়ির যত্ন" } },
  { id: "blouse-piece", label: { en: "👗 Blouse Piece", bn: "👗 ব্লাউজ পিস" } },
  { id: "delivery-time", label: { en: "🚚 Delivery & Time", bn: "🚚 ডেলিভারি ও সময়" } },
  { id: "studio-appointment", label: { en: "📍 Banani Studio", bn: "📍 বনানী স্টুডিও" } },
  { id: "authenticity-guarantee", label: { en: "🏛️ GI & Silk Mark", bn: "🏛️ আসল শাড়ির গ্যারান্টি" } },
];
