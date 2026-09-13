"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useStudio } from "@/context/StudioContext";
import { useOrderModal } from "@/context/OrderModalContext";

export interface SareeColorway {
  id: string;
  name: { en: string; bn: string };
  hex: string;
  image: string;
  price: { en: string; bn: string };
}

export interface OriginRegion {
  id: string;
  category: "bangladesh" | "indian";
  name: { en: string; bn: string };
  location: { en: string; bn: string };
  weave: { en: string; bn: string };
  description: { en: string; bn: string };
  primaryImage: string;
  colorways: SareeColorway[];
}

export const ORIGIN_REGIONS: OriginRegion[] = [
  // 🇧🇩 BANGLADESH HERITAGE SAREES
  {
    id: "jamdani",
    category: "bangladesh",
    name: { en: "Dhakai Jamdani", bn: "ঢাকাই জামদানি" },
    location: {
      en: "Narayanganj, Shitalakshya River",
      bn: "নারায়ণগঞ্জ, শীতলক্ষ্যা পাড়",
    },
    weave: {
      en: "UNESCO Intangible Heritage & GI Certified",
      bn: "ইউনেস্কো স্বীকৃত জিআই ঐতিহ্যবাহী তাঁত",
    },
    description: {
      en: "Hand-spun translucent cotton-silk with supplementary geometric butidar motifs woven by master generational karigars.",
      bn: "ঐতিহাসিক শীতলক্ষ্যার বাতাসে বোনা স্নিগ্ধ সুতো ও সূক্ষ্ম জ্যামিতিক নকশায় মাস্টার তাঁতিদের হাতে বোনা অনন্য শিল্পকর্ম।",
    },
    primaryImage: "/images/colorways/jamdani_white.jpg",
    colorways: [
      {
        id: "white",
        name: { en: "Shweto White & Gold", bn: "শুভ্র শ্বেত ও সোনালী" },
        hex: "#F5F0E8",
        image: "/images/colorways/jamdani_white.jpg",
        price: { en: "৳ 9,500", bn: "৳ ৯,৫০০" },
      },
      {
        id: "red",
        name: { en: "Crimson Red Jamdani", bn: "লাল ঢাকাই জামদানি" },
        hex: "#8B1E28",
        image: "/images/colorways/jamdani_red.jpg",
        price: { en: "৳ 9,800", bn: "৳ ৯,৮০০" },
      },
      {
        id: "green",
        name: { en: "Emerald Green Jamdani", bn: "পান্না সবুজ জামদানি" },
        hex: "#1F4E3B",
        image: "/images/colorways/jamdani_green.jpg",
        price: { en: "৳ 9,200", bn: "৳ ৯,২০০" },
      },
      {
        id: "yellow",
        name: { en: "Haldi Saffron Jamdani", bn: "হলুদ জাফরান জামদানি" },
        hex: "#D49B28",
        image: "/images/colorways/jamdani_yellow.jpg",
        price: { en: "৳ 8,800", bn: "৳ ৮,৮০০" },
      },
      {
        id: "blue",
        name: { en: "Meghdoot Blue Jamdani", bn: "মেঘদূত নীল জামদানি" },
        hex: "#1B3B6F",
        image: "/images/colorways/jamdani_blue.jpg",
        price: { en: "৳ 9,400", bn: "৳ ৯,৪০০" },
      },
      {
        id: "pink",
        name: { en: "Gulabi Rose Jamdani", bn: "গোলাপি নূর জামদানি" },
        hex: "#C95B7E",
        image: "/images/colorways/jamdani_pink.jpg",
        price: { en: "৳ 9,600", bn: "৳ ৯,৬০০" },
      },
      {
        id: "purple",
        name: { en: "Royal Jamuni Jamdani", bn: "রয়েল জামুনি জামদানি" },
        hex: "#5B2C6F",
        image: "/images/colorways/jamdani_purple.jpg",
        price: { en: "৳ 9,900", bn: "৳ ৯,৯০০" },
      },
    ],
  },
  {
    id: "rajshahi",
    category: "bangladesh",
    name: { en: "Rajshahi Mulberry Silk", bn: "রাজশাহী রেশম সিল্ক" },
    location: { en: "Rajshahi, Bangladesh", bn: "রাজশাহী, বাংলাদেশ" },
    weave: {
      en: "Pure Mulberry & Hand-Reeled Silk",
      bn: "খাঁটি রেশম তুত সিল্ক ও মটকা বুনন",
    },
    description: {
      en: "Known as the Silk City of Bengal, producing lightweight luxury mulberry drapes with natural luster and regal fall.",
      bn: "বাংলার ঐতিহাসিক রেশম নগরী রাজশাহীর খাঁটি তুত সিল্ক, যা অত্যন্ত মোলায়েম, জমকালো এবং রাজকীয়ভাবে মানানসই।",
    },
    primaryImage: "/images/colorways/rajshahi_blue.jpg",
    colorways: [
      {
        id: "blue",
        name: { en: "Midnight Sapphire Silk", bn: "মিডনাইট নীল রেশম সিল্ক" },
        hex: "#1B3B6F",
        image: "/images/colorways/rajshahi_blue.jpg",
        price: { en: "৳ 8,400", bn: "৳ ৮,৪০০" },
      },
      {
        id: "red",
        name: { en: "Bridal Red Rajshahi", bn: "লাল রাজশাহী সিল্ক" },
        hex: "#8B1E28",
        image: "/images/colorways/rajshahi_red.jpg",
        price: { en: "৳ 8,600", bn: "৳ ৮,৬০০" },
      },
      {
        id: "green",
        name: { en: "Peacock Emerald Rajshahi", bn: "ময়ূরকণ্ঠী সবুজ সিল্ক" },
        hex: "#1F4E3B",
        image: "/images/colorways/rajshahi_green.jpg",
        price: { en: "৳ 8,200", bn: "৳ ৮,২০০" },
      },
      {
        id: "yellow",
        name: { en: "Golden Mustard Silk", bn: "সোনালী হলুদ সিল্ক" },
        hex: "#D49B28",
        image: "/images/colorways/rajshahi_yellow.jpg",
        price: { en: "৳ 7,900", bn: "৳ ৭,৯০০" },
      },
      {
        id: "pink",
        name: { en: "Damascus Rose Silk", bn: "গোলাপি রেশম সিল্ক" },
        hex: "#C95B7E",
        image: "/images/colorways/rajshahi_pink.jpg",
        price: { en: "৳ 8,300", bn: "৳ ৮,৩০০" },
      },
      {
        id: "purple",
        name: { en: "Royal Jamuni Silk", bn: "জামুনি বেগুনি সিল্ক" },
        hex: "#5B2C6F",
        image: "/images/colorways/rajshahi_purple.jpg",
        price: { en: "৳ 8,500", bn: "৳ ৮,৫০০" },
      },
    ],
  },
  {
    id: "mirpur-katan",
    category: "bangladesh",
    name: { en: "Mirpur Bridal Katan", bn: "মিরপুর ব্রাইডাল কাতান" },
    location: {
      en: "Benarasi Polli, Mirpur, Dhaka",
      bn: "বেনারসি পল্লী, মিরপুর, ঢাকা",
    },
    weave: {
      en: "Bridal Zari & Pure Kadwa Brocade",
      bn: "খাঁটি জরি ও ব্রাইডাল কাতান ব্রোকেড",
    },
    description: {
      en: "The undisputed centerpiece of Bengali bridal trousseau, woven with hand-twisted silk and lustrous gold metallic zari.",
      bn: "বাঙালি কনের বিয়ের মূল আকর্ষণ — খাঁটি সিল্কের জমিনে ঘন জরির কারুকাজ ও রাজকীয় পাড়ের অনন্য বুনন।",
    },
    primaryImage: "/images/colorways/mirpur_red.jpg",
    colorways: [
      {
        id: "red",
        name: { en: "Maharani Bridal Red", bn: "মহারানী বিয়ের লাল কাতান" },
        hex: "#8B1E28",
        image: "/images/colorways/mirpur_red.jpg",
        price: { en: "৳ 12,500", bn: "৳ ১২,৫০০" },
      },
      {
        id: "green",
        name: { en: "Emerald Brocade Katan", bn: "পান্না সবুজ ব্রোকেড কাতান" },
        hex: "#1F4E3B",
        image: "/images/colorways/mirpur_green.jpg",
        price: { en: "৳ 11,800", bn: "৳ ১১,৮০০" },
      },
      {
        id: "yellow",
        name: { en: "Haldi Shondhya Katan", bn: "হলুদ সন্ধ্যা ব্রাইডাল কাতান" },
        hex: "#D49B28",
        image: "/images/colorways/mirpur_yellow.jpg",
        price: { en: "৳ 10,900", bn: "৳ ১০,৯০০" },
      },
      {
        id: "blue",
        name: { en: "Royal Sapphire Katan", bn: "রয়েল ব্লু কাতান" },
        hex: "#1B3B6F",
        image: "/images/colorways/mirpur_blue.jpg",
        price: { en: "৳ 12,200", bn: "৳ ১২,২০০" },
      },
      {
        id: "pink",
        name: { en: "Rani Magenta Katan", bn: "রানী ম্যাজেন্টা গোলাপি কাতান" },
        hex: "#C95B7E",
        image: "/images/colorways/mirpur_pink.jpg",
        price: { en: "৳ 11,500", bn: "৳ ১১,৫০০" },
      },
      {
        id: "purple",
        name: { en: "Deep Jamuni Katan", bn: "গাঢ় জামুনি জরি কাতান" },
        hex: "#5B2C6F",
        image: "/images/colorways/mirpur_purple.jpg",
        price: { en: "৳ 12,800", bn: "৳ ১২,৮০০" },
      },
    ],
  },
  {
    id: "tangail",
    category: "bangladesh",
    name: { en: "Tangail Silk Taant", bn: "টাঙ্গাইল তাঁত সিল্ক" },
    location: { en: "Tangail, Bangladesh", bn: "টাঙ্গাইল, বাংলাদেশ" },
    weave: {
      en: "Fine Cotton-Silk Handloom Weave",
      bn: "হ্যান্ডলুম সূক্ষ্ম কটন-সিল্ক তাঁত",
    },
    description: {
      en: "Celebrated for centuries for its featherweight comfort, ornate floral borders, and soft fluid drape.",
      bn: "হালকা আরামদায়ক বুনন, মনোমুগ্ধকর ফুল-লতার পাড় ও অনন্য আভিজাত্যের ঐতিহ্যবাহী টাঙ্গাইল তাঁত।",
    },
    primaryImage: "/images/colorways/tangail_yellow.jpg",
    colorways: [
      {
        id: "yellow",
        name: { en: "Basanti Haldi Taant", bn: "বাসন্তী হলুদ টাঙ্গাইল তাঁত" },
        hex: "#D49B28",
        image: "/images/colorways/tangail_yellow.jpg",
        price: { en: "৳ 4,500", bn: "৳ ৪,৫০০" },
      },
      {
        id: "red",
        name: { en: "Crimson Border Taant", bn: "রক্তলাল পাড় টাঙ্গাইল তাঁত" },
        hex: "#8B1E28",
        image: "/images/colorways/tangail_red.jpg",
        price: { en: "৳ 4,800", bn: "৳ ৪,৮০০" },
      },
      {
        id: "green",
        name: { en: "Pata Shobuj Taant", bn: "পাতাসবুজ স্নিগ্ধ তাঁত" },
        hex: "#1F4E3B",
        image: "/images/colorways/tangail_green.jpg",
        price: { en: "৳ 4,200", bn: "৳ ৪,২০০" },
      },
      {
        id: "blue",
        name: { en: "Aakashi Blue Taant", bn: "আকাশি নীল তাঁত" },
        hex: "#1B3B6F",
        image: "/images/colorways/tangail_blue.jpg",
        price: { en: "৳ 4,400", bn: "৳ ৪,৪০০" },
      },
      {
        id: "pink",
        name: { en: "Golapi Noor Taant", bn: "গোলাপি আভা তাঁত" },
        hex: "#C95B7E",
        image: "/images/colorways/tangail_pink.jpg",
        price: { en: "৳ 4,600", bn: "৳ ৪,৬০০" },
      },
      {
        id: "purple",
        name: { en: "Baiguni Sheer Taant", bn: "বেগুনি জমিন তাঁত" },
        hex: "#5B2C6F",
        image: "/images/colorways/tangail_purple.jpg",
        price: { en: "৳ 4,700", bn: "৳ ৪,৭০০" },
      },
    ],
  },

  // 🇮🇳 SUBCONTINENT & INDIAN HERITAGE SAREES
  {
    id: "banaras",
    category: "indian",
    name: { en: "Kashi Banarasi Silk", bn: "কাশি বেনারসি সিল্ক" },
    location: { en: "Varanasi Atelier", bn: "বারাণসী স্টুডিও" },
    weave: {
      en: "Kadwa Pure Silk & 24k Gold Zari",
      bn: "খাঁটি কাড়োয়া সিল্ক ও ২৪ ক্যারেট গোল্ড জরি",
    },
    description: {
      en: "Woven on ancient jacquard looms with hand-twisted mulberry silk and pure gold filigree.",
      bn: "ঐতিহাসিক জ্যাকার্ড তাঁতে খাঁটি রেশম ও স্বর্ণের তারের কারুকাজে বোনা রাজকীয় বেনারসি।",
    },
    primaryImage: "/images/colorways/banaras_red.jpg",
    colorways: [
      {
        id: "red",
        name: { en: "Imperial Red Kadwa", bn: "ইম্পেরিয়াল লাল কাড়োয়া" },
        hex: "#8B1E28",
        image: "/images/colorways/banaras_red.jpg",
        price: { en: "৳ 14,500", bn: "৳ ১৪,৫০০" },
      },
      {
        id: "green",
        name: { en: "Emerald Brocade Kadwa", bn: "সবুজ ব্রোকেড কাড়োয়া" },
        hex: "#1F4E3B",
        image: "/images/colorways/banaras_green.jpg",
        price: { en: "৳ 13,800", bn: "৳ ১৩,৮০০" },
      },
      {
        id: "yellow",
        name: { en: "Saffron Gold Kadwa", bn: "জাফরান গোল্ড কাড়োয়া" },
        hex: "#D49B28",
        image: "/images/colorways/banaras_yellow.jpg",
        price: { en: "৳ 12,900", bn: "৳ ১২,৯০০" },
      },
      {
        id: "blue",
        name: { en: "Midnight Kashi Silk", bn: "মিডনাইট কাশি সিল্ক" },
        hex: "#1B3B6F",
        image: "/images/colorways/banaras_blue.jpg",
        price: { en: "৳ 14,200", bn: "৳ ১৪,২০০" },
      },
      {
        id: "pink",
        name: { en: "Gulabi Zardozi Silk", bn: "গোলাপি জারদৌসি সিল্ক" },
        hex: "#C95B7E",
        image: "/images/colorways/banaras_pink.jpg",
        price: { en: "৳ 13,500", bn: "৳ ১৩,৫০০" },
      },
      {
        id: "purple",
        name: { en: "Royal Jamuni Kadwa", bn: "রয়েল জামুনি কাড়োয়া" },
        hex: "#5B2C6F",
        image: "/images/colorways/banaras_purple.jpg",
        price: { en: "৳ 14,800", bn: "৳ ১৪,৮০০" },
      },
    ],
  },
  {
    id: "kanchipuram",
    category: "indian",
    name: { en: "Kanchipuram Temple Twill", bn: "কাঞ্জিভরম টেম্পল টুইল" },
    location: { en: "Tamil Nadu Master Weavers", bn: "তামিলনাড়ু মাস্টার তাঁতি" },
    weave: {
      en: "Korvai Interlocked Temple Borders",
      bn: "করভাই মন্দির নকশার খাঁটি জারি বুনন",
    },
    description: {
      en: "Interlocked warp and weft creating vibrant jewel tones and sacred temple architectural motifs.",
      bn: "পবিত্র মন্দির স্থাপত্যের অনুপ্রেরণায় বোনা গাঢ় রঙের জমিন ও দীর্ঘস্থায়ী ঐতিহ্যের প্রতীক।",
    },
    primaryImage: "/images/colorways/kanchipuram_green.jpg",
    colorways: [
      {
        id: "green",
        name: { en: "Peacock Emerald Korvai", bn: "ময়ূরকণ্ঠী সবুজ করভাই" },
        hex: "#1F4E3B",
        image: "/images/colorways/kanchipuram_green.jpg",
        price: { en: "৳ 16,500", bn: "৳ ১৬,৫০০" },
      },
      {
        id: "red",
        name: { en: "Temple Red Kanjivaram", bn: "টেম্পল লাল কাঞ্জিভরম" },
        hex: "#8B1E28",
        image: "/images/colorways/kanchipuram_red.jpg",
        price: { en: "৳ 17,200", bn: "৳ ১৭,২০০" },
      },
      {
        id: "yellow",
        name: { en: "Haldi Amber Kanjivaram", bn: "হলুদ আম্বর কাঞ্জিভরম" },
        hex: "#D49B28",
        image: "/images/colorways/kanchipuram_yellow.jpg",
        price: { en: "৳ 15,500", bn: "৳ ১৫,৫০০" },
      },
      {
        id: "blue",
        name: { en: "Sapphire Indigo Korvai", bn: "নীলমণি নীল করভাই" },
        hex: "#1B3B6F",
        image: "/images/colorways/kanchipuram_blue.jpg",
        price: { en: "৳ 15,900", bn: "৳ ১৫,৯০০" },
      },
      {
        id: "pink",
        name: { en: "Lotus Rani Pink", bn: "পদ্ম রানী গোলাপি" },
        hex: "#C95B7E",
        image: "/images/colorways/kanchipuram_pink.jpg",
        price: { en: "৳ 16,200", bn: "৳ ১৬,২০০" },
      },
      {
        id: "purple",
        name: { en: "Jamuni Temple Zari", bn: "জামুনি মন্দির জারি সিল্ক" },
        hex: "#5B2C6F",
        image: "/images/colorways/kanchipuram_purple.jpg",
        price: { en: "৳ 16,800", bn: "৳ ১৬,৮০০" },
      },
    ],
  },
  {
    id: "chanderi",
    category: "indian",
    name: { en: "Chanderi Sheer Tissue", bn: "চান্দেরি শিয়ার টিস্যু" },
    location: { en: "Madhya Pradesh", bn: "মধ্যপ্রদেশ" },
    weave: {
      en: "Featherweight Sheer Tissue",
      bn: "অতি-হালকা স্বচ্ছ সিল্ক টিস্যু",
    },
    description: {
      en: "Delicate transparency woven from finest cotton-silk blends with miniature floral butis.",
      bn: "স্বচ্ছ স্নিগ্ধ কাপড়ে সূক্ষ্ম জরি বুটির সমাহার, পার্টি ও সন্ধ্যার অনুষ্ঠানের জন্য অনবদ্য।",
    },
    primaryImage: "/images/colorways/chanderi_yellow.jpg",
    colorways: [
      {
        id: "yellow",
        name: { en: "Golden Amber Tissue", bn: "সোনালী আম্বর টিস্যু" },
        hex: "#D49B28",
        image: "/images/colorways/chanderi_yellow.jpg",
        price: { en: "৳ 7,500", bn: "৳ ৭,৫০০" },
      },
      {
        id: "red",
        name: { en: "Ruby Red Tissue", bn: "রুবি লাল টিস্যু" },
        hex: "#8B1E28",
        image: "/images/colorways/chanderi_red.jpg",
        price: { en: "৳ 7,900", bn: "৳ ৭,৯০০" },
      },
      {
        id: "green",
        name: { en: "Emerald Sheer Chanderi", bn: "পান্না সবুজ চান্দেরি" },
        hex: "#1F4E3B",
        image: "/images/colorways/chanderi_green.jpg",
        price: { en: "৳ 7,200", bn: "৳ ৭,২০০" },
      },
      {
        id: "blue",
        name: { en: "Sapphire Mist Tissue", bn: "নীল কুয়াশা টিস্যু" },
        hex: "#1B3B6F",
        image: "/images/colorways/chanderi_blue.jpg",
        price: { en: "৳ 7,400", bn: "৳ ৭,৪০০" },
      },
      {
        id: "pink",
        name: { en: "Damascus Rose Sheer", bn: "গোলাপ শিয়ার টিস্যু" },
        hex: "#C95B7E",
        image: "/images/colorways/chanderi_pink.jpg",
        price: { en: "৳ 7,800", bn: "৳ ৭,৮০০" },
      },
      {
        id: "purple",
        name: { en: "Royal Jamuni Tissue", bn: "রয়েল জামুনি টিস্যু" },
        hex: "#5B2C6F",
        image: "/images/colorways/chanderi_purple.jpg",
        price: { en: "৳ 8,100", bn: "৳ ৮,১০০" },
      },
    ],
  },
];

export default function SareesByOrigin() {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const { openStudio } = useStudio();
  const { openOrderModal } = useOrderModal();
  const originData = content?.regionalSarees;
  const allRegions = originData?.regions || ORIGIN_REGIONS;

  const [activeCategory, setActiveCategory] = useState<"bangladesh" | "indian">("bangladesh");
  const filteredRegions = allRegions.filter((r) => r.category === activeCategory);
  const [selectedRegion, setSelectedRegion] = useState<OriginRegion>(filteredRegions[0] || allRegions[0]);
  const [selectedColor, setSelectedColor] = useState<SareeColorway>(
    (filteredRegions[0] || allRegions[0])?.colorways[0]
  );

  const handleWhatsAppOrder = (region: OriginRegion, color: SareeColorway) => {
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const regionName = region.name[language];
    const colorName = color.name[language];
    const price = color.price[language];
    const weave = region.weave[language];
    const text =
      language === "bn"
        ? `আসসালামু আলাইকুম! আমি আভরণী থেকে "${regionName}" (${colorName} - ${weave}) শাড়িটি সম্পর্কে জানতে ও অর্ডার করতে চাই। মূল্য: ${price}।`
        : `Hello! I would like to inquire about and place an order for "${regionName}" in ${colorName} (${weave}) priced at ${price} from Avoroni.`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleQuickOrder = (region: OriginRegion, color: SareeColorway) => {
    openOrderModal({
      id: `${region.id}-${color.id}`,
      name: `${region.name[language]} (${color.name[language]})`,
      weave: region.weave[language],
      color: color.name[language],
      price: color.price[language],
      image: color.image,
    });
  };

  const handleTryInMirror = (region: OriginRegion, color: SareeColorway) => {
    openStudio({
      id: `${region.id}-${color.id}`,
      name: {
        en: `${region.name.en} (${color.name.en})`,
        bn: `${region.name.bn} (${color.name.bn})`,
      },
      category: "saree",
      image: color.image,
      price: color.price,
      defaultScale: 1.0,
    });
  };

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseImageRef = useRef<HTMLDivElement>(null);

  // Sync state when allRegions updates from CMS
  useEffect(() => {
    if (!allRegions || allRegions.length === 0) return;
    const currentReg = allRegions.find((r) => r.id === selectedRegion?.id) || allRegions.filter((r) => r.category === activeCategory)[0] || allRegions[0];
    setSelectedRegion(currentReg);
    if (currentReg) {
      const currentColor = currentReg.colorways.find((c) => c.id === selectedColor?.id) || currentReg.colorways[0];
      setSelectedColor(currentColor);
    }
  }, [allRegions, activeCategory]);

  // When category changes, reset selected region & color
  const handleCategoryChange = (cat: "bangladesh" | "indian") => {
    setActiveCategory(cat);
    const regions = allRegions.filter((r) => r.category === cat);
    if (regions.length > 0) {
      setSelectedRegion(regions[0]);
      setSelectedColor(regions[0].colorways[0]);
    }
  };

  const handleSelectRegion = (region: OriginRegion) => {
    setSelectedRegion(region);
    setSelectedColor(region.colorways[0]);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 82%",
          },
        }
      );

      // Showcase image clip-path reveal
      gsap.fromTo(
        showcaseImageRef.current,
        { clipPath: "inset(14% 0 14% 0)", opacity: 0.8 },
        {
          clipPath: "inset(0% 0 0% 0)",
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: showcaseImageRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="categories"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Sarees by Origin"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14 sm:gap-20">
        {/* Section Header: THE COLLECTION / SAREES BY ORIGIN */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center gap-3.5"
        >
          <span className="inline-block px-3.5 py-1 bg-[#6D1F2A]/10 border border-[#6D1F2A]/30 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-medium">
            {getLocalized(originData?.pill, language) || t("origin_pill")}
          </span>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1514] tracking-tight leading-[0.95] uppercase">
            {getLocalized(originData?.heading, language) || t("origin_heading")}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#1A1514]/70 font-light max-w-md leading-relaxed">
            {getLocalized(originData?.subtitle, language) || t("origin_subtitle")}
          </p>

          {/* Category Tabs: Bangladesh Heritage vs Indian Royal Weaves */}
          <div className="flex items-center p-1 bg-[#EDE3D5] rounded-full border border-[#1A1514]/10 mt-4">
            <button
              onClick={() => handleCategoryChange("bangladesh")}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === "bangladesh"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] shadow-sm font-semibold"
                  : "text-[#1A1514]/70 hover:text-[#1A1514]"
              }`}
            >
              🇧🇩 {language === "bn" ? "দেশীয় ঐতিহ্য (বাংলাদেশ)" : "Bengal Heritage (Bangladesh)"}
            </button>
            <button
              onClick={() => handleCategoryChange("indian")}
              className={`px-5 py-2 rounded-full text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === "indian"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] shadow-sm font-semibold"
                  : "text-[#1A1514]/70 hover:text-[#1A1514]"
              }`}
            >
              🇮🇳 {language === "bn" ? "ভারতীয় ঐতিহ্যবাহী শাড়ি" : "Subcontinent & Indian Weaves"}
            </button>
          </div>
        </div>

        {/* Dynamic Split Layout: Showcase on Left, Region Cards + 6 Colors on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (5 cols): Active Region Showcase with Selected Colorway */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28">
            <div
              ref={showcaseImageRef}
              className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl bg-[#EDE3D5] shadow-sm"
              style={{ clipPath: "inset(14% 0 14% 0)" }}
            >
              <Image
                key={`${selectedRegion.id}-${selectedColor.id}`}
                src={`${selectedColor.image}?v=20260912_all_real_v4`}
                alt={`${selectedRegion.name[language]} in ${selectedColor.name[language]}`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[center_top] transition-all duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1514]/65 via-transparent to-transparent pointer-events-none" />

              {/* Price & Color Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#1A1514]/80 backdrop-blur-md rounded-full text-[#F5F0E8] text-xs font-sans font-semibold tracking-wider">
                {selectedColor.price[language]}
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#F5F0E8] text-[9.5px] tracking-[0.2em] uppercase font-sans">
                <span>
                  {selectedRegion.name[language]} &bull; {selectedColor.name[language]}
                </span>
                <span className="text-[#B89A62]">Avoroni Atelier</span>
              </div>
            </div>

            {/* 6 Color Swatches for the Active Regional Saree */}
            <div className="bg-[#EDE3D5]/50 p-4 sm:p-5 rounded-2xl border border-[#1A1514]/10 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] tracking-[0.15em] uppercase font-sans text-[#1A1514]/75">
                <span className="font-semibold text-[#6D1F2A]">
                  {language === "bn" ? "উপলব্ধ রঙসমূহ" : "Available Colorways"} ({selectedRegion.colorways.length}):
                </span>
                <span className="font-medium text-[#1A1514]">{selectedColor.name[language]}</span>
              </div>

              {/* Color Capsule Selector Row */}
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedRegion.colorways.map((c) => {
                  const isActive = selectedColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer text-xs ${
                        isActive
                          ? "bg-[#1A1514] text-[#F5F0E8] border-[#1A1514] shadow-sm scale-105"
                          : "bg-[#F5F0E8] text-[#1A1514]/80 border-[#1A1514]/15 hover:border-[#6D1F2A]"
                      }`}
                      title={c.name[language]}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-sans text-[11px] font-medium">
                        {c.name[language]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* High-Converting Action Bar for the Active Regional Saree & Selected Color */}
              <div className="pt-3 border-t border-[#1A1514]/10 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTryInMirror(selectedRegion, selectedColor)}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-[#FAF5ED] text-[10.5px] font-sans tracking-[0.14em] uppercase font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  title={language === "bn" ? "ভার্চুয়াল ট্রায়াল রুমে দেখুন" : "Try in Virtual Mirror"}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5D2A4] animate-ping" />
                  <span>✨ {language === "bn" ? "ভার্চুয়াল ট্রায়াল" : "Virtual Fitting"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickOrder(selectedRegion, selectedColor)}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#1A1514] to-[#302624] hover:brightness-125 text-[#FAF5ED] text-[10.5px] font-sans tracking-[0.14em] uppercase font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border border-[#C5A869]/40"
                  title={language === "bn" ? "ক্যাশ অন ডেলিভারি কুইক অর্ডার" : "Quick Order COD"}
                >
                  <span>⚡</span>
                  <span>{language === "bn" ? "ক্যাশ অন ডেলিভারি" : "1-Click COD"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppOrder(selectedRegion, selectedColor)}
                  className="w-full sm:w-auto py-2.5 px-3.5 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#FAF5ED] text-[10.5px] font-sans tracking-wider uppercase font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border border-white/10"
                  title={language === "bn" ? "হোয়াটসঅ্যাপে অর্ডার" : "Order via WhatsApp"}
                >
                  <span>💬</span>
                  <span className="inline">{language === "bn" ? "অর্ডার" : "WhatsApp"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Regional Saree Cards with 6 Color Dots each */}
          <div className="origin-cards-list lg:col-span-7 flex flex-col gap-6">
            {filteredRegions.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <div
                  key={region.id}
                  onClick={() => handleSelectRegion(region)}
                  className={`origin-card group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-7 rounded-2xl border transition-all duration-400 gap-6 cursor-pointer ${
                    isSelected
                      ? "bg-[#EDE3D5] border-[#6D1F2A]/40 shadow-sm ring-1 ring-[#6D1F2A]/20"
                      : "bg-[#EDE3D5]/40 hover:bg-[#EDE3D5]/80 border-transparent"
                  }`}
                >
                  <div className="flex flex-col gap-2 max-w-md">
                    <div className="flex items-center gap-2.5">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#6D1F2A] font-semibold">
                        {region.location[language]}
                      </span>
                      <span className="text-[#1A1514]/20">&bull;</span>
                      <span className="text-[9px] font-sans text-[#1A1514]/60">
                        {region.weave[language]}
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1514] group-hover:text-[#6D1F2A] transition-colors">
                      {region.name[language]}
                    </h3>

                    <p className="font-sans text-xs text-[#1A1514]/75 font-light leading-relaxed">
                      {region.description[language]}
                    </p>

                    {/* 6 Color Preview Dots for each region */}
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[9px] font-sans text-[#1A1514]/50 tracking-wide uppercase mr-1">
                        {language === "bn" ? "রঙের অপশন:" : "Colorways:"}
                      </span>
                      {region.colorways.map((cw) => (
                        <span
                          key={cw.id}
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: cw.hex }}
                          title={cw.name[language]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                    <Image
                      src={region.primaryImage}
                      alt={region.name[language]}
                      fill
                      sizes="112px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
