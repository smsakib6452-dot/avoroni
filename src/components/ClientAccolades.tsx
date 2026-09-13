"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Testimonial {
  id: string;
  name: { en: string; bn: string };
  location: { en: string; bn: string };
  saree: { en: string; bn: string };
  quote: { en: string; bn: string };
  date: { en: string; bn: string };
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "samira-gulshan",
    name: { en: "Mrs. Samira Rahman", bn: "মিসেস সামিরা রহমান" },
    location: { en: "Gulshan-2, Dhaka", bn: "গুলশান-২, ঢাকা" },
    saree: { en: "Dhakai Rose Jamdani", bn: "ঢাকাই রোজ জামদানি" },
    quote: {
      en: "“The 84-count Shitalakshya sheer felt as delicate as morning mist. Wearing an authentic handloom Jamdani with pre-stitched fall and pico saved me countless trips to tailors during wedding rush. Truly peerless.”",
      bn: "“৮৪-কাউন্ট সুতোর ঢাকাই জামদানিটি দেখতে যেমন স্নিগ্ধ, পরতেও অসাধারণ আরামদায়ক। বিয়ের এত ব্যস্ততার মাঝে ফল ও পিকো রেডি-টু-ওয়্যার থাকায় দর্জির ঝামেলা ছাড়াই ড্র্যাপ করতে পেরেছি। আভরণীর কারিগরদের আন্তরিক কৃতজ্ঞতা।”"
    },
    date: { en: "November 2025 • Bridal Holud", bn: "নভেম্বর ২০২৫ • ব্রাইডাল গায়ে হলুদ" }
  },
  {
    id: "tasnim-london",
    name: { en: "Dr. Tasnim Chowdhury", bn: "ডা. তাসনিম চৌধুরী" },
    location: { en: "Kensington, London (UK)", bn: "কেনসিংটন, লন্ডন (যুক্তরাজ্য)" },
    saree: { en: "Maharani Red Kadwa Katan", bn: "মহারানী লাল কাড়োয়া কাতান" },
    quote: {
      en: "“Ordered from London for my wedding reception. Delivered via DHL in pristine condition within 4 days. The weight of pure silk and hand-beaten gold zari turned heads at the Dorchester. A sovereign heirloom.”",
      bn: "“লন্ডন থেকে রিসেপশনের জন্য অর্ডার করেছিলাম। মাত্র ৪ দিনে নিখুঁত ভেলভেট বক্সে নিরাপদে পৌঁছেছে। খাঁটি সিল্ক আর ঘন সোনার জরির কারুকাজ দেখে প্রত্যেকে মুগ্ধ হয়েছে। এটি একটি চিরন্তন পারিবারিক সম্পদ।”"
    },
    date: { en: "December 2025 • Reception", bn: "ডিসেম্বর ২০২৫ • রাজকীয় রিসেপশন" }
  },
  {
    id: "farzana-ctg",
    name: { en: "Farzana Akhter", bn: "ফারজানা আক্তার" },
    location: { en: "Nasirabad, Chittagong", bn: "নাসিরাবাদ, চট্টগ্রাম" },
    saree: { en: "Rajshahi Mulberry Emerald", bn: "রাজশাহী পান্না সিল্ক ও কুন্দন সেট" },
    quote: {
      en: "“Their Banani atelier video call consultation was effortless. The stylist held up the emerald silk in natural sunlight and paired it with a royal choker. Zero color mismatch, pure luxury.”",
      bn: "“বনানী স্টুডিওর স্টাইলিস্টের সাথে লাইভ ভিডিও কলে প্রাকৃতিক আলোতে শাড়িটি দেখেছিলাম। শাড়ির সাথে মানানসই কুন্দন গয়না ম্যাচ করে দিয়েছেন। ছবির চেয়ে বাস্তবে বুনন আরও মনোমুগ্ধকর।”"
    },
    date: { en: "January 2026 • Royal Wedding", bn: "জানুয়ারি ২০২৬ • রাজকীয় বিবাহ" }
  },
];

export default function ClientAccolades() {
  const { language, t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="accolades"
      className="relative py-28 sm:py-36 bg-[#181312] text-[#F5F0E8] overflow-hidden border-t border-[#C5A869]/25 select-none"
      aria-label="Patrons and Bridal Acclaim"
    >
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#6D1F2A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#C5A869]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 flex flex-col items-center gap-3.5">
          <span className="inline-block px-3.5 py-1 bg-[#6D1F2A]/40 border border-[#C5A869]/40 rounded-full text-[9.5px] sm:text-[10px] tracking-[0.25em] uppercase text-[#E5D2A4] font-sans font-medium">
            {t("accolades_pill")}
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[#FAF5ED] tracking-tight leading-[1.05]">
            {t("accolades_heading_1")} <br />
            <span className="italic font-normal text-[#C5A869]">
              {t("accolades_heading_2")}
            </span>
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#EDE3D5]/70 font-light max-w-lg leading-relaxed">
            {t("accolades_subtitle")}
          </p>
        </div>

        {/* 3 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl border transition-all duration-500 cursor-pointer ${
                activeIdx === idx
                  ? "bg-[#221A19] border-[#C5A869] shadow-[0_8px_32px_rgba(197,168,105,0.15)] scale-[1.02]"
                  : "bg-[#1E1716]/60 hover:bg-[#1E1716] border-white/10 hover:border-[#C5A869]/50"
              }`}
            >
              {/* Top Row: Stars & Verified Badge */}
              <div className="flex items-center justify-between gap-2 pb-6 border-b border-white/10">
                <div className="flex items-center gap-1 text-[#C5A869] text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#6D1F2A]/50 border border-[#C5A869]/30 text-[#E5D2A4] font-sans font-medium">
                  {t("accolades_verified")}
                </span>
              </div>

              {/* Quote */}
              <p className="font-serif text-base sm:text-lg text-[#FAF5ED]/95 font-light italic leading-relaxed my-6">
                {item.quote[language]}
              </p>

              {/* Patron Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base text-[#FAF5ED] font-medium">
                    {item.name[language]}
                  </h4>
                  <span className="text-[10px] text-[#C5A869] font-sans">
                    {item.location[language]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#EDE3D5]/60 font-sans pt-0.5">
                  <span className="font-medium text-[#EDE3D5]/80">{item.saree[language]}</span>
                  <span>{item.date[language]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Stat Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#E5D2A4] font-light">4.9 / 5.0</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#EDE3D5]/60">
              {language === "bn" ? "ভেরিফাইড কাস্টমার রেটিং" : "Verified Patron Rating"}
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-white/10" />

          <div className="flex flex-col gap-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#E5D2A4] font-light">1,200+</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#EDE3D5]/60">
              {language === "bn" ? "বোনা ব্রাইডাল ও হেরিটেজ শাড়ি" : "Handloom Drapes Delivered"}
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-white/10" />

          <div className="flex flex-col gap-1">
            <span className="font-serif text-3xl sm:text-4xl text-[#E5D2A4] font-light">100%</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#EDE3D5]/60">
              {language === "bn" ? "খাঁটি তাঁত ও জিআই সনদপ্রাপ্ত" : "GI & Handloom Certified"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
