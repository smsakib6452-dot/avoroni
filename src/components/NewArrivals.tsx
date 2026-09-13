"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useStudio } from "@/context/StudioContext";
import { useOrderModal } from "@/context/OrderModalContext";

interface ArrivalCard {
  id: string;
  name: { en: string; bn: string };
  weave: { en: string; bn: string };
  price: { en: string; bn: string };
  image: string;
  provenance?: { en: string; bn: string };
}

const DEFAULT_NEW_ARRIVALS_ITEMS: ArrivalCard[] = [
  {
    id: "green-floral",
    name: { en: "Gulbahar Organza", bn: "গুলবাহার অর্গানজা" },
    weave: { en: "Hand-Painted Floral Sheer", bn: "হাতে আঁকা ফ্লোরাল শিয়ার" },
    price: { en: "৳ 4,200", bn: "৳ ৪,২০০" },
    image: "/images/sarees_origin_model.jpg",
    provenance: {
      en: "Featherweight hand-painted sheer organza adorned with miniature gulbahar sprigs and zari border.",
      bn: "অতি-হালকা অর্গানজা কাপড়ে হাতে আঁকা ফুলের মেলা ও সূক্ষ্ম জরির পাড়, উৎসবের সন্ধ্যায় মোহনীয় সাজের জন্য।"
    }
  },
  {
    id: "rose-silk",
    name: { en: "Dhakai Rose Jamdani", bn: "ঢাকাই রোজ জামদানি" },
    weave: { en: "Shitalakshya 84-Count Weave", bn: "শীতলক্ষ্যা ৮৪-কাউন্ট সুতো" },
    price: { en: "৳ 6,800", bn: "৳ ৬,৮০০" },
    image: "/images/swatch_rose.jpg",
    provenance: {
      en: "Woven along the banks of Shitalakshya with 84-count pure cotton-silk yarn and traditional rose motifs.",
      bn: "ঐতিহাসিক শীতলক্ষ্যার তাঁতে বোনা ৮৪-কাউন্ট সুতোর নিখুঁত জামদানি, মিষ্টি গোলাপ রঙে স্নিগ্ধ আভিজাত্য।"
    }
  },
  {
    id: "emerald-twill",
    name: { en: "Rajshahi Mulberry Silk", bn: "রাজশাহী রেশম সিল্ক" },
    weave: { en: "Pure Hand-Reeled Silk Twill", bn: "খাঁটি হাতে বোনা তুত সিল্ক" },
    price: { en: "৳ 8,400", bn: "৳ ৮,৪০০" },
    image: "/images/editorial_portrait.jpg",
    provenance: {
      en: "100% pure Mulberry silk reeled in Rajshahi sericulture looms, with fluid royal fall and antique gold pallu.",
      bn: "রাজশাহীর খাঁটি রেশম তুত সিল্ক, অত্যন্ত মসৃণ রাজকীয় ফল এবং অ্যান্টিক গোল্ড জরির আঁচল।"
    }
  },
  {
    id: "sunset-orange",
    name: { en: "Mirpur Surya Katan", bn: "মিরপুর সূর্য কাতান" },
    weave: { en: "Burnt Amber Zari Brocade", bn: "আম্বর জরির রাজকীয় ব্রোকেড" },
    price: { en: "৳ 5,600", bn: "৳ ৫,৬০০" },
    image: "/images/swatch_orange.jpg",
    provenance: {
      en: "Mirpur Benarasi Polli kadwa brocade with intricate burnt amber zari weaving, an ode to monsoon sunsets.",
      bn: "মিরপুর বেনারসি পল্লীর খাঁটি কাড়োয়া ব্রোকেড, সূর্যাস্তের মনোরম রঙে ঘন জরির জমকালো কারুকাজ।"
    }
  },
];

export default function NewArrivals() {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const { openStudio } = useStudio();
  const { openOrderModal } = useOrderModal();
  const arrivalsData = content?.newArrivals;
  const items = arrivalsData?.items || DEFAULT_NEW_ARRIVALS_ITEMS;

  const [selectedItem, setSelectedItem] = useState<ArrivalCard | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Left text column fade-in
      gsap.fromTo(
        textColRef.current,
        { opacity: 0, x: -35 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textColRef.current,
            start: "top 80%",
          },
        }
      );

      // Carousel cards staggered entrance
      gsap.fromTo(
        ".arrival-card-box",
        { clipPath: "inset(14% 0 14% 0)", scale: 1.08, opacity: 0.8 },
        {
          clipPath: "inset(0% 0 0% 0)",
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleWhatsAppOrder = (item: ArrivalCard) => {
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
      id="new-arrivals"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="New Arrivals"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column */}
        <div ref={textColRef} className="lg:col-span-5 flex flex-col gap-6">
          {/* Pill: NEW ARRIVALS */}
          <div className="flex items-center gap-2">
            <span className="inline-block px-3.5 py-1 bg-[#6D1F2A]/10 border border-[#6D1F2A]/30 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-medium">
              {getLocalized(arrivalsData?.pill, language) || t("new_arrivals_pill")}
            </span>
          </div>

          {/* Headline: Fresh Weaves, Timeless Grace */}
          <h2 className="font-serif text-5xl sm:text-6xl font-light text-[#1A1514] tracking-tight leading-[1.05]">
            {getLocalized(arrivalsData?.heading_1, language) || t("new_arrivals_heading_1")} <br />
            <span className="italic font-normal text-[#6D1F2A]">
              {getLocalized(arrivalsData?.heading_2, language) || t("new_arrivals_heading_2")}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm text-[#1A1514]/70 font-light leading-relaxed max-w-sm">
            {getLocalized(arrivalsData?.subtitle, language) || t("new_arrivals_subtitle")}
          </p>

          {/* Button: DISCOVER NEW ARRIVALS */}
          <div className="pt-2">
            <a
              href="#best-seller"
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#6D1F2A] text-[#F5F0E8] rounded-full text-[10px] sm:text-[11px] font-sans tracking-[0.22em] uppercase transition-all duration-300 hover:bg-[#46151D] hover:shadow-lg focus:outline-none"
            >
              <span>{getLocalized(arrivalsData?.cta, language) || t("new_arrivals_cta")}</span>
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
          </div>

          {/* Footnote */}
          <div className="pt-4 border-t border-[#1A1514]/10 flex items-center gap-3 text-[9.5px] tracking-[0.25em] uppercase text-[#1A1514]/50 font-sans">
            <span>{getLocalized(arrivalsData?.footnote, language) || t("new_arrivals_footnote")}</span>
          </div>
        </div>

        {/* Right Column: Saree Showcase on Models with BDT ৳ Prices & Instant Ordering */}
        <div
          ref={carouselRef}
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7"
        >
          {items.map((item) => (
            <article
              key={item.id}
              className="arrival-card-box group relative flex flex-col gap-3.5 p-3 rounded-2xl bg-[#EDE3D5]/40 hover:bg-[#EDE3D5]/90 border border-transparent hover:border-[#C5A869]/40 transition-all duration-400 select-none shadow-xs hover:shadow-lg"
            >
              {/* Portrait Photography with Quick View Trigger */}
              <div
                onClick={() => setSelectedItem(item)}
                className="relative w-full aspect-[3/4] overflow-hidden bg-[#EDE3D5] rounded-xl cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.name[language]}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-[center_top] transition-transform duration-700 ease-out group-hover:scale-106"
                />

                {/* Price Pill Tag */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-[#1A1514]/80 backdrop-blur-md rounded-full text-[#F5F0E8] text-[10px] tracking-wider font-sans font-medium border border-white/10 shadow-sm">
                  {item.price[language]}
                </div>

                {/* Atelier Provenance Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#6D1F2A]/85 backdrop-blur-md rounded-full text-[#FAF5ED] text-[8.5px] tracking-widest uppercase font-sans font-medium border border-[#C5A869]/30">
                  {language === "bn" ? "আভরণী তাঁত" : "Heirloom Weave"}
                </div>

                {/* Quick View Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/25 backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-full bg-[#FAF5ED] text-[#1A1514] text-[10.5px] tracking-[0.2em] uppercase font-sans font-medium shadow-md border border-[#C5A869]">
                    {t("view_details")}
                  </span>
                </div>
              </div>

              {/* Card Meta & 1-Click Order Trigger */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[11px] text-[#6D1F2A] font-semibold tracking-wide">
                    {item.weave[language]}
                  </p>
                  <span className="text-[9px] tracking-wider uppercase text-emerald-700 font-sans font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {language === "bn" ? "স্টকে আছে" : "In Atelier"}
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedItem(item)}
                  className="font-serif text-xl sm:text-2xl font-light text-[#1A1514] group-hover:text-[#6D1F2A] transition-colors cursor-pointer"
                >
                  {item.name[language]}
                </h3>

                {/* Direct Action Bar on Card */}
                <div className="pt-2 flex items-center gap-1.5">
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
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1514] font-normal mb-2">
                  {selectedItem.name[language]}
                </h3>
                <div className="font-serif text-2xl text-[#8C6B38] font-semibold mb-4">
                  {selectedItem.price[language]}
                </div>

                <div className="space-y-3 py-4 border-y border-[#C5A869]/20 text-xs sm:text-sm text-[#1A1514]/80 font-sans">
                  <div>
                    <span className="font-medium text-[#1A1514] block mb-0.5">
                      {language === "bn" ? "তাঁত ও বুনন শিল্প:" : "Artisanship & Weave Story:"}
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
