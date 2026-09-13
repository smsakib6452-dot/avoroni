"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useStudio } from "@/context/StudioContext";
import { useOrderModal } from "@/context/OrderModalContext";

interface BestSellerItem {
  id: string;
  name: { en: string; bn: string };
  weave: { en: string; bn: string };
  price: { en: string; bn: string };
  image: string;
  rating: { en: string; bn: string };
  scarcity?: { en: string; bn: string };
  provenance?: { en: string; bn: string };
}

const BEST_SELLERS: BestSellerItem[] = [
  {
    id: "red-kadwa",
    name: { en: "Maharani Red Katan", bn: "মহারানী লাল কাতান" },
    weave: { en: "Pure Silk Bridal Kadwa", bn: "খাঁটি সিল্ক ব্রাইডাল কাড়োয়া" },
    price: { en: "৳ 4,800", bn: "৳ ৪,৮০০" },
    image: "/images/hero_culture.jpg",
    rating: { en: "4.9 (128)", bn: "৪.৯ (১২৮)" },
    scarcity: { en: "Heritage Archive • 1 Piece Available", bn: "স্টুডিও আর্কাইভ • মাত্র ১টি শাড়ি উপলব্ধ" },
    provenance: {
      en: "The quintessential Bengali wedding drape woven on antique wooden pit looms with hand-twisted mulberry silk and pure gold zari floral butis.",
      bn: "ঐতিহাসিক পিট-লুমে বোনা খাঁটি তুত সিল্ক ও স্বর্ণ জরির ফুল নকশায় সাজানো বাঙালি কনের চিরন্তন লাল শাড়ি।"
    }
  },
  {
    id: "gulabi-noor",
    name: { en: "Gulabi Noor Jamdani", bn: "গোলাবি নূর জামদানি" },
    weave: { en: "Dhakai Rose Floral Sheer", bn: "ঢাকাই গোলাপ ফ্লোরাল শিয়ার" },
    price: { en: "৳ 5,200", bn: "৳ ৫,২০০" },
    image: "/images/swatch_rose.jpg",
    rating: { en: "4.8 (94)", bn: "৪.৮ (৯৪)" },
    scarcity: { en: "Single Loom Masterpiece", bn: "একক তাঁতের অনন্য শিল্পকর্ম" },
    provenance: {
      en: "Shitalakshya riverbank handloom sheer woven with 84-count delicate cotton-silk yarn and romantic rose floral jaal.",
      bn: "শীতলক্ষ্যা পাড়ের নিপুণ কারিগরের হাতে বোনা সূক্ষ্ম কটন-সিল্ক এবং কোমল গোলাপের জালিকাজ।"
    }
  },
  {
    id: "emerald-temple",
    name: { en: "Mayuri Emerald Silk", bn: "ময়ূরী পান্না সিল্ক" },
    weave: { en: "Rajshahi Mulberry Gold Zari", bn: "রাজশাহী তুত সিল্ক গোল্ড জরি" },
    price: { en: "৳ 6,400", bn: "৳ ৬,৪০০" },
    image: "/images/editorial_portrait.jpg",
    rating: { en: "5.0 (156)", bn: "৫.০ (১৫৬)" },
    scarcity: { en: "Most Loved Royal Drape", bn: "সর্বাধিক সমাদৃত রাজকীয় শাড়ি" },
    provenance: {
      en: "Rich peacock emerald Rajshahi silk known for its natural shimmer, breathability, and heavy temple border motifs.",
      bn: "রাজশাহীর খাঁটি রেশম সিল্কের মনোমুগ্ধকর পান্না সবুজ জমিন ও প্রাচীন মন্দির নকশার সোনালী পাড়।"
    }
  },
  {
    id: "swarna-surya",
    name: { en: "Swarna Surya Tissue", bn: "স্বর্ণ সূর্য তস্যু" },
    weave: { en: "Handloom Chanderi Amber Silk", bn: "হ্যান্ডলুম আম্বর সিল্ক" },
    price: { en: "৳ 3,900", bn: "৳ ৩,৯০০" },
    image: "/images/swatch_orange.jpg",
    rating: { en: "4.9 (112)", bn: "৪.৯ (১১২)" },
    scarcity: { en: "Festive Gaye Holud Edit", bn: "গায়ে হলুদ স্পেশাল এডিশন" },
    provenance: {
      en: "Radiant sunset amber hues blended with lightweight zari tissue, perfect for morning ceremonies and festivities.",
      bn: "সূর্যালোকের মতো উজ্জ্বল সোনালী আম্বর রঙের টিস্যু সিল্ক, হালকা আরামদায়ক ও উৎসবের জন্য আদর্শ।"
    }
  },
];

export default function BestSellers() {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const { openStudio } = useStudio();
  const { openOrderModal } = useOrderModal();
  const bestData = content?.bestSellers;
  const items = bestData?.items || BEST_SELLERS;

  const [selectedItem, setSelectedItem] = useState<BestSellerItem | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // 4 arched cards entrance
      gsap.fromTo(
        ".bestseller-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.12,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleWhatsAppOrder = (item: BestSellerItem) => {
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const name = item.name[language];
    const price = item.price[language];
    const weave = item.weave[language];
    const text = language === "bn"
      ? `আসসালামু আলাইকুম! আমি আভরণী থেকে "${name}" (${weave}) শাড়িটি সম্পর্কে জানতে ও অর্ডার করতে চাই। মূল্য: ${price}।`
      : `Hello! I would like to inquire about and place an order for "${name}" (${weave}) priced at ${price} from Avoroni.`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section
      id="best-seller"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Best Sellers"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16 sm:gap-24">
        {/* Header Matching Reference Video */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-3">
            {/* Pill: THE MOST LOVED */}
            <span className="self-start inline-block px-3.5 py-1 bg-[#6D1F2A]/10 border border-[#6D1F2A]/30 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-medium">
              {getLocalized(bestData?.pill, language) || t("bestseller_pill")}
            </span>

            {/* Headline: Best Sellers */}
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1514] tracking-tight leading-[0.95]">
              {getLocalized(bestData?.heading, language) || t("bestseller_heading")}
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm text-[#1A1514]/70 font-light max-w-lg leading-relaxed">
              {getLocalized(bestData?.subtitle, language) || t("bestseller_subtitle")}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            {/* Button: EXPLORE ALL */}
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#6D1F2A] text-[#F5F0E8] rounded-full text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#46151D] hover:shadow-lg"
            >
              <span>{getLocalized(bestData?.cta, language) || t("bestseller_cta")}</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Footnote */}
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#1A1514]/50 font-sans">
              {getLocalized(bestData?.footnote, language) || t("bestseller_footnote")}
            </span>
          </div>
        </div>

        {/* 4 Arched Cards Grid with BDT ৳ Prices, Scarcity Badges & 1-Click Order */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="bestseller-card group relative flex flex-col gap-4 bg-[#EDE3D5]/40 hover:bg-[#EDE3D5] p-3 sm:p-4 rounded-3xl transition-all duration-400 border border-transparent hover:border-[#C5A869]/40 shadow-xs hover:shadow-xl"
            >
              {/* Arched Window Image with Quick View Trigger */}
              <div
                onClick={() => setSelectedItem(item)}
                className="relative w-full aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl bg-[#EDE3D5] cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.name[language]}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-[center_top] transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Scarcity / Provenance Tag */}
                {item.scarcity && (
                  <div className="absolute bottom-3.5 left-3 right-3 text-center pointer-events-none">
                    <span className="inline-block px-3 py-1 bg-[#1A1514]/85 backdrop-blur-md rounded-full text-[#FAF5ED] text-[8.5px] font-sans tracking-widest uppercase border border-[#C5A869]/30">
                      {item.scarcity[language]}
                    </span>
                  </div>
                )}

                {/* Quick View Hover Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25 backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-full bg-[#FAF5ED] text-[#1A1514] text-[10.5px] tracking-[0.2em] uppercase font-sans font-medium shadow-md border border-[#C5A869]">
                    {t("view_details")}
                  </span>
                </div>
              </div>

              {/* Card Metadata */}
              <div className="flex flex-col gap-1 px-1">
                {/* Weave & Star Rating (Single Line Guarantee) */}
                <div className="flex items-center justify-between text-[9.5px] tracking-[0.16em] uppercase font-sans text-[#6D1F2A] font-semibold gap-2">
                  <span className="truncate">{item.weave[language]}</span>
                  <span className="text-[#1A1514]/65 font-medium whitespace-nowrap shrink-0 flex items-center gap-1">
                    <span className="text-[#8C6B38]">★</span> {item.rating[language]}
                  </span>
                </div>

                {/* Title & Prominent BDT Price */}
                <div className="flex items-baseline justify-between gap-2 pt-0.5">
                  <h3
                    onClick={() => setSelectedItem(item)}
                    className="font-serif text-xl sm:text-[22px] font-light text-[#1A1514] group-hover:text-[#6D1F2A] transition-colors leading-snug cursor-pointer truncate"
                    title={item.name[language]}
                  >
                    {item.name[language]}
                  </h3>
                  <span className="font-serif text-lg sm:text-xl font-semibold text-[#8C6B38] whitespace-nowrap shrink-0">
                    {item.price[language]}
                  </span>
                </div>

                {/* Direct Action Bar */}
                <div className="pt-2.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      openOrderModal({
                        id: item.id,
                        name: item.name[language],
                        weave: item.weave[language],
                        price: item.price[language],
                        image: item.image,
                      })
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-[#FAF5ED] text-[9.5px] font-sans tracking-wider uppercase font-semibold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                    title={t("quick_order")}
                  >
                    <span>⚡</span>
                    <span>{language === "bn" ? "অর্ডার" : "Quick Order"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppOrder(item)}
                    className="w-8 h-8 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#FAF5ED] flex items-center justify-center text-xs transition-colors shrink-0 shadow-xs cursor-pointer border border-[#C5A869]/30"
                    title={t("order_via_whatsapp")}
                  >
                    💬
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="w-8 h-8 rounded-full border border-[#1A1514]/20 hover:border-[#6D1F2A] hover:bg-[#6D1F2A]/10 text-[#1A1514] flex items-center justify-center text-xs transition-colors shrink-0 cursor-pointer"
                    title={t("view_details")}
                  >
                    ↗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Saree Quick View Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A869]/40 grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Saree Image */}
            <div className="relative aspect-[4/5] md:aspect-auto md:h-full w-full bg-[#EDE3D5]">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name[language]}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-semibold block mb-1">
                  {selectedItem.weave[language]}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1514] font-normal mb-1">
                  {selectedItem.name[language]}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#8C6B38] text-xs font-semibold">★ {selectedItem.rating[language]}</span>
                  <span className="text-[#1A1514]/30">&bull;</span>
                  <span className="text-[10px] text-emerald-800 font-sans tracking-wider font-medium">
                    {selectedItem.scarcity ? selectedItem.scarcity[language] : t("only_one_left")}
                  </span>
                </div>
                <div className="font-serif text-2xl text-[#8C6B38] font-semibold mb-4">
                  {selectedItem.price[language]}
                </div>

                <div className="space-y-3 py-4 border-y border-[#C5A869]/20 text-xs sm:text-sm text-[#1A1514]/80 font-sans">
                  <div>
                    <span className="font-medium text-[#1A1514] block mb-0.5">
                      {language === "bn" ? "তাঁতের ঐতিহ্য ও বুনন বৈশিষ্ট্য:" : "Generational Weave Story:"}
                    </span>
                    <p className="font-light leading-relaxed">
                      {selectedItem.provenance
                        ? selectedItem.provenance[language]
                        : selectedItem.weave[language]}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-[#1A1514] block mb-0.5">
                      {language === "bn" ? "আভরণী মেসন নিশ্চয়তা:" : "Maison Assurances:"}
                    </span>
                    <p className="font-light leading-relaxed text-[#1A1514]/75">
                      {language === "bn"
                        ? "✨ ফ্রি ফল ও পিকো ফিনিশিং অন্তর্ভুক্ত। সারাদেশে ক্যাশ-অন-ডেলিভারি এবং বনানী স্টুডিও প্রিভিউ।"
                        : "✨ Complimentary Fall & Pico hemming included. Nationwide Cash on Delivery & live video preview."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    openStudio({
                      id: selectedItem.id,
                      name: selectedItem.name,
                      category: "saree",
                      image: selectedItem.image,
                      price: selectedItem.price,
                      defaultScale: 1.0,
                    });
                    setSelectedItem(null);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-[#FAF5ED] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg border border-[#C5A869]/40 cursor-pointer hover:scale-[1.02]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C5A869] animate-ping" />
                  <span>✨ {language === "bn" ? "ভার্চুয়াল মিররে ট্রাই করুন" : "Try On In Virtual Mirror"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openOrderModal({
                      id: selectedItem.id,
                      name: selectedItem.name[language],
                      weave: selectedItem.weave[language],
                      price: selectedItem.price[language],
                      image: selectedItem.image,
                    });
                    setSelectedItem(null);
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#1A1514] to-[#302624] hover:brightness-125 text-[#FAF5ED] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg border border-[#C5A869]/40 cursor-pointer hover:scale-[1.02]"
                >
                  <span>⚡</span>
                  <span>{language === "bn" ? "ক্যাশ অন ডেলিভারিতে অর্ডার করুন" : "Order Cash on Delivery"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleWhatsAppOrder(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="w-full py-3 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#FAF5ED] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer border border-[#C5A869]/20"
                >
                  <span>💬</span>
                  <span>{t("order_via_whatsapp")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
