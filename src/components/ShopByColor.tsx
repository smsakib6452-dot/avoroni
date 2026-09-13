"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useStudio } from "@/context/StudioContext";
import { useOrderModal } from "@/context/OrderModalContext";
import { ORIGIN_REGIONS } from "@/components/SareesByOrigin";

interface ColorCapsule {
  id: string;
  name: { en: string; bn: string };
  count: { en: string; bn: string };
  colorHex: string;
  image: string;
  title: { en: string; bn: string };
  weave: { en: string; bn: string };
  description: { en: string; bn: string };
  price: { en: string; bn: string };
}

interface ColorSareeItem {
  id: string;
  name: { en: string; bn: string };
  regionName: { en: string; bn: string };
  location: { en: string; bn: string };
  weave: { en: string; bn: string };
  price: { en: string; bn: string };
  image: string;
}

const COLOR_CAPSULES: ColorCapsule[] = [
  {
    id: "red",
    name: { en: "Red", bn: "লাল" },
    count: { en: "14", bn: "১৪" },
    colorHex: "#8B1E28",
    image: "/images/colorways/mirpur_red.jpg",
    title: {
      en: "Imperial Mirpur Red Katan",
      bn: "ইম্পেরিয়াল মিরপুর লাল কাতান",
    },
    weave: {
      en: "Pure Kadwa Silk & 24k Gold Zari",
      bn: "খাঁটি কাড়োয়া সিল্ক ও ২৪ ক্যারেট গোল্ড জরি",
    },
    description: {
      en: "Steeped in Bengali bridal tradition, woven with pure crimson silk and master handloom zari filigree.",
      bn: "বাঙালি বিয়ের চিরন্তন লাল শাড়ি, খাঁটি রেশম ও নিপুণ কারিগরের হাতে বোনা স্বর্ণ জরির রাজকীয় রূপ।",
    },
    price: { en: "৳ 12,500", bn: "৳ ১২,৫০০" },
  },
  {
    id: "green",
    name: { en: "Green", bn: "সবুজ" },
    count: { en: "8", bn: "৮" },
    colorHex: "#1F4E3B",
    image: "/images/colorways/jamdani_green.jpg",
    title: {
      en: "Emerald Green Dhakai Jamdani",
      bn: "পান্না সবুজ ঢাকাই জামদানি",
    },
    weave: {
      en: "Hand-Spun Cotton-Silk with Temple Buti",
      bn: "হাতে বোনা কটন-সিল্ক ও সবুজ জামদানি বুটি",
    },
    description: {
      en: "Deep jewel emerald representing nature and auspicious prosperity, draped with subtle antique gold motifs.",
      bn: "গাঢ় পান্না সবুজ রঙে সজীবতা ও ঐতিহ্যের ছোঁয়া, সূক্ষ্ম জরি পাড়ে জামদানির অনন্য প্রকাশ।",
    },
    price: { en: "৳ 9,200", bn: "৳ ৯,২০০" },
  },
  {
    id: "yellow",
    name: { en: "Yellow", bn: "হলুদ" },
    count: { en: "11", bn: "১১" },
    colorHex: "#D49B28",
    image: "/images/colorways/tangail_yellow.jpg",
    title: {
      en: "Haldi Basanti Tangail Silk",
      bn: "হলুদ বাসন্তী টাঙ্গাইল সিল্ক",
    },
    weave: {
      en: "Fine Cotton-Silk Handloom Weave",
      bn: "সূক্ষ্ম কটন-সিল্ক ঐতিহ্যবাহী তাঁত",
    },
    description: {
      en: "A ceremonial yellow radiant as Gaye Holud marigolds, handcrafted with miniature golden lotus motifs.",
      bn: "গায়ে হলুদের অনুষ্ঠানের জন্য উজ্জ্বল হলুদ শেড, পদ্ম ও জ্যামিতিক বুটির সূক্ষ্ম কারুকাজ।",
    },
    price: { en: "৳ 4,500", bn: "৳ ৪,৫০০" },
  },
  {
    id: "blue",
    name: { en: "Blue", bn: "নীল" },
    count: { en: "6", bn: "৬" },
    colorHex: "#1B3B6F",
    image: "/images/colorways/rajshahi_blue.jpg",
    title: {
      en: "Midnight Sapphire Rajshahi Silk",
      bn: "মিডনাইট নীল রাজশাহী রেশম সিল্ক",
    },
    weave: {
      en: "Pure Mulberry Hand-Reeled Silk",
      bn: "খাঁটি রেশম তুত সিল্ক ও জরির পাড়",
    },
    description: {
      en: "Evoking monsoon rain evenings over rivers, woven in lustrous midnight indigo threads.",
      bn: "বর্ষার মেঘলা সন্ধ্যার মতো স্নিগ্ধ নীল আভা, মসৃণ ফিনিশ ও আরামদায়ক রাজকীয় বুনন।",
    },
    price: { en: "৳ 8,400", bn: "৳ ৮,৪০০" },
  },
  {
    id: "pink",
    name: { en: "Pink", bn: "গোলাপি" },
    count: { en: "12", bn: "১২" },
    colorHex: "#C95B7E",
    image: "/images/colorways/jamdani_pink.jpg",
    title: {
      en: "Gulabi Noor Sheer Jamdani",
      bn: "গোলাবি নূর শিয়ার জামদানি",
    },
    weave: {
      en: "Shitalakshya Rose Floral Weave",
      bn: "শীতলক্ষ্যা পাড়ের স্নিগ্ধ গোলাপ জামদানি",
    },
    description: {
      en: "Delicate rose transparency accented with hand-beaten gold zardozi and romantic floral sprigs.",
      bn: "কোমল গোলাপের পাপড়ির মতো মোলায়েম ও রোমান্টিক রূপ, হালকা জরি আর বুটির অপরূপ মেলবন্ধন।",
    },
    price: { en: "৳ 9,600", bn: "৳ ৯,৬০০" },
  },
  {
    id: "purple",
    name: { en: "Purple", bn: "বেগুনি" },
    count: { en: "7", bn: "৭" },
    colorHex: "#5B2C6F",
    image: "/images/colorways/mirpur_purple.jpg",
    title: {
      en: "Royal Jamuni Katan Brocade",
      bn: "রয়েল জামুনি কাতান ব্রোকেড",
    },
    weave: {
      en: "Heavy Wedding Zari Border",
      bn: "ভারী বিয়ের জরি পাড় ও আঁচল",
    },
    description: {
      en: "Majestic royal purple with antique gold borders, inspired by palatial archives.",
      bn: "জমকালো রাজকীয় বেগুনি রঙে অ্যান্টিক গোল্ড পাড়, আভিজাত্য ও ঐতিহ্যের সেরা পরিচয়।",
    },
    price: { en: "৳ 12,800", bn: "৳ ১২,৮০০" },
  },
];

export default function ShopByColor() {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const { openStudio } = useStudio();
  const { openOrderModal } = useOrderModal();
  const colorData = content?.colorCapsules;
  const capsules = (colorData?.capsules as ColorCapsule[]) || COLOR_CAPSULES;

  const [activeColor, setActiveColor] = useState<ColorCapsule>(capsules[0] || COLOR_CAPSULES[0]);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showFullImageModal, setShowFullImageModal] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const capsuleRowRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!capsules || capsules.length === 0) return;
    const current = capsules.find((c) => c.id === activeColor?.id) || capsules[0];
    if (current) setActiveColor(current);
  }, [capsules]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header entrance
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

      // Capsules stagger
      gsap.fromTo(
        ".color-capsule-btn",
        { opacity: 0, y: 25, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: capsuleRowRef.current,
            start: "top 80%",
          },
        }
      );

      // Image frame reveal
      gsap.fromTo(
        imageFrameRef.current,
        { clipPath: "inset(12% 0 12% 0)", opacity: 0.8 },
        {
          clipPath: "inset(0% 0 0% 0)",
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageFrameRef.current,
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Gather all sarees belonging to the active color from regional database
  const allRegions = (content?.regionalSarees?.regions && content.regionalSarees.regions.length > 0)
    ? content.regionalSarees.regions
    : ORIGIN_REGIONS;
  const colorCatalog: ColorSareeItem[] = [];

  allRegions.forEach((reg) => {
    if (!reg?.colorways || !Array.isArray(reg.colorways)) return;
    const matchingCw = reg.colorways.find((cw) => cw?.id === activeColor.id);
    if (matchingCw) {
      colorCatalog.push({
        id: `${reg.id}-${matchingCw.id}`,
        name: matchingCw.name,
        regionName: reg.name,
        location: reg.location,
        weave: reg.weave,
        price: matchingCw.price,
        image: matchingCw.image,
      });
    }
  });

  const handleWhatsAppOrder = (title: string, weave: string, price: string) => {
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const text = language === "bn"
      ? `আসসালামু আলাইকুম! আমি "${title}" (${weave}) শাড়িটি সম্পর্কে জানতে ও অর্ডার করতে আগ্রহী। মূল্য: ${price}।`
      : `Hello! I would like to inquire about and place an order for "${title}" (${weave}) priced at ${price} from Avoroni.`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section
      id="shop-by-color"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-24 sm:py-32 md:py-40 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Shop By Color"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center gap-3"
        >
          {/* Pill: EXPLORE EVERY SHADE */}
          <span className="inline-block px-3.5 py-1 bg-[#6D1F2A]/10 border border-[#6D1F2A]/30 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-medium">
            {getLocalized(colorData?.pill, language) || t("color_pill")}
          </span>

          {/* Heading: SHOP BY COLOR */}
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1514] tracking-tight leading-[0.95] uppercase">
            {getLocalized(colorData?.heading, language) || t("color_heading")}
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm text-[#1A1514]/70 font-light max-w-md leading-relaxed">
            {getLocalized(colorData?.subtitle, language) || t("color_subtitle")}
          </p>
        </div>

        {/* Capsule Swatches */}
        <div
          ref={capsuleRowRef}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto"
          role="radiogroup"
          aria-label="Select Color Category"
        >
          {capsules.map((item) => {
            const isActive = activeColor.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveColor(item)}
                onMouseEnter={() => setActiveColor(item)}
                className={`color-capsule-btn group flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-300 cursor-pointer min-h-[44px] ${
                  isActive
                    ? "bg-[#1A1514] text-[#F5F0E8] border-[#1A1514] shadow-md scale-105"
                    : "bg-[#EDE3D5]/70 text-[#1A1514]/80 border-[#1A1514]/15 hover:border-[#1A1514]/40 hover:bg-[#EDE3D5]"
                }`}
                role="radio"
                aria-checked={isActive}
                aria-label={`${item.name[language]} (${item.count[language]})`}
              >
                {/* Dot */}
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.colorHex }}
                />
                <span className="font-sans text-xs sm:text-[13px] font-medium tracking-wide">
                  {item.name[language]}
                </span>
                <span
                  className={`text-[11px] font-sans transition-colors ${
                    isActive ? "text-[#F5F0E8]/70" : "text-[#1A1514]/50"
                  }`}
                >
                  ({item.count[language]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Split Layout: True Portrait Ratio (3:4 Full Drape) + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-2">
          {/* Left Column: Full-Length Model Drape (3:4 Ratio perfectly displays the entire saree) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center">
            <div
              ref={imageFrameRef}
              onClick={() => setShowFullImageModal(true)}
              className="group relative w-full aspect-[3/4] min-h-[440px] sm:min-h-[540px] max-h-[620px] overflow-hidden rounded-3xl bg-[#EDE3D5] shadow-lg border border-[#C5A869]/30 cursor-pointer shrink-0"
            >
              {capsules.map((item) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                    activeColor.id === item.id
                      ? "opacity-100 z-10 scale-100"
                      : "opacity-0 z-0 pointer-events-none scale-103"
                  }`}
                >
                  <Image
                    src={`${item.image}?v=20260912_all_real_v4`}
                    alt={item.title[language]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority={item.id === "red"}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1514]/75 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Badge */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[#F5F0E8] text-[9.5px] tracking-[0.22em] uppercase font-sans">
                    <span>
                      {item.name[language]} &bull; {colorCatalog.length > 0 ? colorCatalog.length : item.count[language]}{" "}
                      {language === "bn" ? "টি শাড়ি" : "Drapes"}
                    </span>
                    <span className="text-[#C5A869]">Avoroni Atelier</span>
                  </div>

                  {/* Click to Zoom Pill */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[9.5px] font-sans uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 border border-white/20">
                    <span>🔍</span>
                    <span>{language === "bn" ? "সম্পূর্ণ ছবি" : "Full View"}</span>
                  </div>
                </div>
              ))}
            </div>

            <span className="text-[10px] text-[#1A1514]/50 font-sans tracking-widest uppercase mt-2.5">
              {language === "bn" ? "✦ পূর্ণ শাড়ির রূপ দেখতে ছবিতে ক্লিক করুন" : "✦ Click on drape to view full high-res portrait"}
            </span>
          </div>

          {/* Right Column: Details, Price, 1-Click Orders & Catalog Trigger */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-5 justify-center">
            {/* Weave Badge with Dynamic Color Dot */}
            <div className="flex items-center gap-3">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                style={{ backgroundColor: activeColor.colorHex }}
              />
              <span className="font-sans text-[10.5px] tracking-[0.2em] uppercase text-[#6D1F2A] font-semibold">
                {activeColor.weave[language]}
              </span>
            </div>

            {/* Saree Heading */}
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1514] leading-[1.1]">
              {activeColor.title[language]}
            </h3>

            {/* Price & In-Stock Status */}
            {activeColor.price && (
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl text-[#8C6B38] font-semibold">
                  {activeColor.price[language]}
                </span>
                <span className="text-[10px] font-sans tracking-widest uppercase text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full font-medium">
                  {language === "bn" ? "ইন স্টক • প্রস্তুত শাড়ি" : "In Stock • Ready to Drape"}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="font-sans text-xs sm:text-sm text-[#1A1514]/75 font-light leading-relaxed max-w-xl">
              {activeColor.description[language]}
            </p>

            {/* High-Converting Direct Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Try in Virtual Mirror */}
              <button
                type="button"
                onClick={() =>
                  openStudio({
                    id: activeColor.id,
                    name: activeColor.title,
                    category: "saree",
                    image: activeColor.image,
                    price: activeColor.price,
                    defaultScale: 1.0,
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-[#FAF5ED] text-[10.5px] sm:text-[11px] font-sans tracking-[0.18em] uppercase font-semibold transition-all shadow-md hover:scale-[1.02] cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#C5A869] animate-ping" />
                <span>✨ {language === "bn" ? "ভার্চুয়াল ট্রায়াল" : "Try in Virtual Mirror"}</span>
              </button>

              {/* Quick Order COD */}
              <button
                type="button"
                onClick={() =>
                  openOrderModal({
                    id: activeColor.id,
                    name: activeColor.title[language],
                    weave: activeColor.weave[language],
                    color: activeColor.name[language],
                    price: activeColor.price[language],
                    image: activeColor.image,
                  })
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#1A1514] to-[#302624] hover:brightness-125 text-[#FAF5ED] text-[10.5px] sm:text-[11px] font-sans tracking-[0.18em] uppercase font-semibold transition-all shadow-md hover:scale-[1.02] cursor-pointer border border-[#C5A869]/40"
              >
                <span>⚡</span>
                <span>{language === "bn" ? "ক্যাশ অন ডেলিভারি" : "1-Click COD"}</span>
              </button>

              {/* Order via WhatsApp */}
              <button
                type="button"
                onClick={() =>
                  handleWhatsAppOrder(
                    activeColor.title[language],
                    activeColor.weave[language],
                    activeColor.price[language]
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#FAF5ED] text-[10.5px] sm:text-[11px] font-sans tracking-[0.18em] uppercase font-medium transition-colors shadow-sm cursor-pointer border border-[#C5A869]/30"
              >
                <span>💬</span>
                <span>{t("order_via_whatsapp")}</span>
              </button>
            </div>

            {/* Interactive Functional CTA: VIEW ALL [COLOR] SAREES (Opens Catalog Modal) */}
            <div className="pt-3 border-t border-[#1A1514]/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCatalogModal(true)}
                className="group inline-flex items-center gap-2.5 text-xs font-sans tracking-[0.18em] uppercase text-[#6D1F2A] hover:text-[#46151D] font-semibold cursor-pointer transition-colors"
              >
                <span className="border-b border-[#6D1F2A] group-hover:border-[#46151D] pb-0.5">
                  {language === "bn"
                    ? `সবগুলো ${activeColor.name.bn} শাড়ি দেখুন (${colorCatalog.length}টি শাড়ি)`
                    : `View All ${activeColor.name.en} Sarees (${colorCatalog.length} Drapes)`}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">
                  &rarr;
                </span>
              </button>

              <span className="text-[10px] text-[#1A1514]/50 font-sans tracking-wider uppercase hidden sm:inline-block">
                {language === "bn" ? "তাঁত ও বুনন গ্যালারি" : "Atelier Color Archive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: COMPLETE COLOR CATALOG GALLERY (ALL SAREES IN HUE)  */}
      {/* ============================================================ */}
      {showCatalogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
          onClick={() => setShowCatalogModal(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A869]/40 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#1A1514] text-[#FAF5ED] border-b border-[#C5A869]/30">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: activeColor.colorHex }}
                />
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[#FAF5ED]">
                    {language === "bn"
                      ? `${activeColor.name.bn} রঙের সকল শাড়ি সম্ভার`
                      : `${activeColor.name.en} Saree Atelier Collection`}
                  </h3>
                  <p className="text-[10.5px] font-sans text-[#C5A869] tracking-wider uppercase">
                    {colorCatalog.length} {language === "bn" ? "টি রাজকীয় তাঁতের শাড়ি" : "Heritage Handloom Drapes"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Saree Cards Grid */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-[#FAF7F2]">
              {colorCatalog.map((saree) => {
                const sareeName = getLocalized(saree.name, language) || saree.name?.[language] || saree.name?.en || "";
                const region = getLocalized(saree.regionName, language) || saree.regionName?.[language] || saree.regionName?.en || "";
                const loc = getLocalized(saree.location, language) || saree.location?.[language] || saree.location?.en || "";
                const weaveName = getLocalized(saree.weave, language) || saree.weave?.[language] || saree.weave?.en || "";
                const priceVal = getLocalized(saree.price, language) || saree.price?.[language] || saree.price?.en || "";

                return (
                  <div
                    key={saree.id}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#C5A869]/30 hover:border-[#C5A869] shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Portrait Saree Image (Compact & Proportional) */}
                    <div className="relative w-full h-48 sm:h-52 md:h-56 bg-[#EDE3D5] overflow-hidden shrink-0">
                      <Image
                        src={saree.image}
                        alt={sareeName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-[#1A1514]/90 backdrop-blur-md rounded-full text-[#FAF5ED] text-[10px] font-sans font-medium border border-[#C5A869]/40 shadow-sm">
                        {priceVal}
                      </div>
                    </div>

                    {/* Compact Cute Details Block */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5 bg-white">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[9px] tracking-wider uppercase font-sans text-[#6D1F2A] font-semibold truncate">
                          <span>{region}</span>
                          {loc && (
                            <>
                              <span>&bull;</span>
                              <span className="text-[#1A1514]/60 font-normal">{loc}</span>
                            </>
                          )}
                        </div>
                        <h4 className="font-serif text-[15px] sm:text-base font-medium text-[#1A1514] truncate group-hover:text-[#6D1F2A] transition-colors leading-tight">
                          {sareeName}
                        </h4>
                        <p className="text-[11px] font-sans text-[#1A1514]/65 truncate font-light">
                          {weaveName}
                        </p>
                      </div>

                      {/* Cute Compact Action Buttons */}
                      <div className="pt-2 border-t border-[#1A1514]/10 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            openStudio({
                              id: saree.id,
                              name: saree.name,
                              category: "saree",
                              image: saree.image,
                              price: saree.price,
                              defaultScale: 1.0,
                            });
                            setShowCatalogModal(false);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-white text-[9.5px] font-sans tracking-wider uppercase font-medium transition-all flex items-center justify-center gap-1 shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer"
                          title={language === "bn" ? "ভার্চুয়াল ট্রায়াল রুম" : "Try On In Mirror"}
                        >
                          <span>✨</span>
                          <span>{language === "bn" ? "ট্রায়াল" : "Try"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            openOrderModal({
                              id: saree.id,
                              name: sareeName,
                              weave: weaveName,
                              color: activeColor.name[language],
                              price: priceVal,
                              image: saree.image,
                            });
                            setShowCatalogModal(false);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-full bg-gradient-to-r from-[#1A1514] to-[#302624] hover:brightness-125 text-[#FAF5ED] text-[9.5px] font-sans tracking-wider uppercase font-semibold transition-all flex items-center justify-center gap-1 border border-[#C5A869]/30 shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer"
                          title={language === "bn" ? "ক্যাশ অন ডেলিভারি" : "Quick Order COD"}
                        >
                          <span>⚡</span>
                          <span>{language === "bn" ? "অর্ডার" : "COD"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleWhatsAppOrder(sareeName, weaveName, priceVal)}
                          className="w-7 h-7 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#FAF5ED] text-xs font-sans transition-all flex items-center justify-center border border-[#C5A869]/30 shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer"
                          title={language === "bn" ? "হোয়াটসঅ্যাপে অর্ডার" : "Order via WhatsApp"}
                        >
                          💬
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: FULL LIGHTBOX RESOLUTION VIEWER FOR FEATURED DRAPE  */}
      {/* ============================================================ */}
      {showFullImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn select-none"
          onClick={() => setShowFullImageModal(false)}
        >
          <div
            className="relative max-w-2xl max-h-[95vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowFullImageModal(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-base transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="relative w-[85vw] max-w-xl aspect-[3/4] rounded-2xl overflow-hidden border border-[#C5A869]/50 shadow-2xl bg-[#1A1514]">
              <Image
                src={`${activeColor.image}?v=20260912_all_real_v4`}
                alt={activeColor.title[language]}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="mt-3 text-center text-[#FAF5ED]">
              <h4 className="font-serif text-xl font-light">{activeColor.title[language]}</h4>
              <p className="font-sans text-xs text-[#C5A869] mt-0.5">{activeColor.weave[language]} &bull; {activeColor.price[language]}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
