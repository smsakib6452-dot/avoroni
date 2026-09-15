"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useStudio } from "@/context/StudioContext";
import { useOrderModal } from "@/context/OrderModalContext";
import { LifestyleCategory, LifestyleProduct } from "@/data/defaultContent";

interface CardProps {
  product: LifestyleProduct;
  category: LifestyleCategory;
  language: "en" | "bn";
  getLocalized: (textObj?: any, lang?: "en" | "bn") => string;
  onSelect: () => void;
  onOrder: () => void;
  onQuickOrder: () => void;
}

function LifestyleProductCard({
  product,
  category,
  language,
  getLocalized,
  onSelect,
  onOrder,
  onQuickOrder,
}: CardProps) {
  const hasModel = !!product.modelImage;
  const [viewMode, setViewMode] = useState<"solo" | "model">("solo");
  const [imgSrc, setImgSrc] = useState(product.image || "/images/editorial_detail.jpg");
  const [modelImgSrc, setModelImgSrc] = useState(product.modelImage || "");
  const prodName = getLocalized(product.name, language);
  const prodCraft = getLocalized(product.craft, language);
  const prodPrice = getLocalized(product.price, language);
  const prodTag = getLocalized(product.tag, language);
  const catName = getLocalized(category.name, language);

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#B89A62]/25 hover:border-[#B89A62] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
      {/* Image Container */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE9DF] cursor-pointer"
        onClick={onSelect}
      >
        {/* Solo Ornament Image */}
        <Image
          src={imgSrc}
          alt={`${prodName} - Solo`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
            hasModel && viewMode === "model" ? "opacity-0" : "opacity-100"
          }`}
          onError={() => setImgSrc("/images/editorial_detail.jpg")}
        />

        {/* Worn by Model Image (if available) */}
        {hasModel && (
          <Image
            src={modelImgSrc}
            alt={`${prodName} - Worn by Model`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              viewMode === "model" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            onError={() => setModelImgSrc(imgSrc)}
          />
        )}

        {/* Dark gradient vignette at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges & Dual-View Switcher */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 pointer-events-none">
            {prodTag && (
              <span className="px-2.5 py-1 text-[9.5px] font-sans tracking-widest uppercase bg-[#1A1514]/85 backdrop-blur-md text-[#F5F0E8] border border-[#B89A62]/40 rounded-full font-medium">
                {prodTag}
              </span>
            )}
          </div>

          {/* Interactive Dual-View Toggle Pill (Solo Ornament vs Worn by Model) */}
          {hasModel ? (
            <div
              className="flex items-center bg-[#1A1514]/90 backdrop-blur-md rounded-full p-0.5 border border-[#B89A62]/40 shadow-lg pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setViewMode("solo")}
                className={`px-2.5 py-1 rounded-full text-[9px] font-sans tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === "solo"
                    ? "bg-[#B89A62] text-[#1A1514] font-bold shadow-xs"
                    : "text-[#F5F0E8]/70 hover:text-[#F5F0E8]"
                }`}
                title={language === "bn" ? "একক গয়না দেখুন" : "View Solo Craft"}
              >
                💎 {language === "bn" ? "গয়না" : "Solo"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("model")}
                className={`px-2.5 py-1 rounded-full text-[9px] font-sans tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === "model"
                    ? "bg-[#B89A62] text-[#1A1514] font-bold shadow-xs"
                    : "text-[#F5F0E8]/70 hover:text-[#F5F0E8]"
                }`}
                title={language === "bn" ? "মডেলে পরিধান রূপ দেখুন" : "View on Model"}
              >
                ✨ {language === "bn" ? "মডেল" : "Model"}
              </button>
            </div>
          ) : product.inStock ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[9px] text-emerald-300 font-sans tracking-wider pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {language === "bn" ? "ইন স্টক" : "In Stock"}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-rose-950/80 backdrop-blur-md text-[9px] text-rose-300 font-sans pointer-events-none">
              {language === "bn" ? "অর্ডার নির্ভর" : "Pre-order"}
            </span>
          )}
        </div>

        {/* Category Pill & Active Angle Tag Over Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#F5F0E8]/90 drop-shadow-md">
            {catName}
          </span>
          {hasModel && (
            <span className="text-[9px] tracking-wider uppercase font-sans text-[#F5F0E8]/85 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/10 transition-all">
              {viewMode === "model"
                ? (language === "bn" ? "✨ মডেলে পরিহিত" : "✨ Worn on Model")
                : (language === "bn" ? "💎 একক গয়না" : "💎 Solo Craft")}
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <span className="px-4 py-2 rounded-full bg-[#F5F0E8]/95 text-[#1A1514] text-xs tracking-widest uppercase font-sans font-medium shadow-lg backdrop-blur-sm border border-[#B89A62]">
            {language === "bn" ? "বিস্তারিত দেখুন" : "Quick View"}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3
            onClick={onSelect}
            className="font-serif text-lg font-medium text-[#1A1514] group-hover:text-[#6D1F2A] transition-colors line-clamp-1 cursor-pointer"
          >
            {prodName}
          </h3>
          <p className="font-sans text-xs text-[#1A1514]/65 line-clamp-2 mt-1 font-light leading-relaxed">
            {prodCraft}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#B89A62]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#1A1514]/50 block">
              {language === "bn" ? "মূল্য (BDT)" : "Price (BDT)"}
            </span>
            <span className="font-serif text-lg font-semibold text-[#8C6B38]">
              {prodPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onQuickOrder}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-[#FAF5ED] text-[10px] tracking-wider uppercase font-sans font-semibold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              title={language === "bn" ? "ক্যাশ অন ডেলিভারি" : "Quick Order COD"}
            >
              <span>⚡</span>
              <span>{language === "bn" ? "অর্ডার" : "COD"}</span>
            </button>

            <button
              onClick={onOrder}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#F5F0E8] text-xs transition-colors shadow-xs hover:shadow-md cursor-pointer border border-[#B89A62]/30"
              title={language === "bn" ? "হোয়াটসঅ্যাপে অর্ডার করুন" : "Order via WhatsApp"}
            >
              💬
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeritageLifestyle() {
  const { language } = useLanguage();
  const { content, getLocalized } = useContent();
  const { openStudio } = useStudio();
  const { openOrderModal } = useOrderModal();

  const sectionData = content?.lifestyleSection;
  const categories: LifestyleCategory[] = sectionData?.categories || [];

  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<{
    product: LifestyleProduct;
    categoryName: string;
  } | null>(null);
  const [modalImageAngle, setModalImageAngle] = useState<"solo" | "model">("solo");

  if (!categories || categories.length === 0) {
    return null;
  }

  // Filter products based on active tab
  const displayedItems: { product: LifestyleProduct; category: LifestyleCategory }[] = [];
  categories.forEach((cat) => {
    if (activeCategoryTab === "all" || activeCategoryTab === cat.id) {
      cat.items.forEach((item) => {
        displayedItems.push({ product: item, category: cat });
      });
    }
  });

  const activeCategoryObj = categories.find((c) => c.id === activeCategoryTab);

  // WhatsApp click handler
  const handleWhatsAppOrder = (product: LifestyleProduct, catName: string) => {
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const prodName = getLocalized(product.name, language);
    const prodPrice = getLocalized(product.price, language);
    const text = language === "bn"
      ? `আসসালামু আলাইকুম! আমি আভরণী থেকে "${prodName}" (${catName}) সম্পর্কে জানতে ও অর্ডার করতে আগ্রহী। মূল্য: ${prodPrice}।`
      : `Hello! I would like to inquire and place an order for "${prodName}" (${catName}) priced at ${prodPrice} from Avoroni.`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section
      id="lifestyle"
      className="relative py-24 sm:py-32 bg-[#FAF7F2] text-[#1A1514] overflow-hidden border-t border-[#B89A62]/20"
    >
      {/* Decorative Gold Filigree Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#B89A62]/40 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#B89A62]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#6D1F2A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B89A62]/10 border border-[#B89A62]/30 text-[#8C6B38] text-[10px] sm:text-xs tracking-[0.28em] uppercase font-sans font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62]" />
            {getLocalized(sectionData?.pill, language) || (language === "bn" ? "অভিজাত অনুষঙ্গ ও সম্ভার" : "Curated Lifestyle Atelier")}
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1A1514] font-normal leading-tight mb-4">
            {getLocalized(sectionData?.heading, language) || (language === "bn" ? "ঐতিহ্যের রাজকীয় সাজ ও অনুপম অনুষঙ্গ" : "Royal Adornments & Heritage Accents")}
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#1A1514]/75 font-light leading-relaxed max-w-2xl mx-auto">
            {getLocalized(sectionData?.subtitle, language) || (language === "bn"
              ? "শাড়ির বাইরেও নারীর রূপ ও আভিজাত্যের পূর্ণতায়—হস্তনির্মিত কুন্দন গয়না, ভেলভেট বটুয়া, রেশমি আনস্টিচড ৩-পিস ও খাঁটি কাশ্মীরি শাল।"
              : "Beyond drapes — meticulously handcrafted jewelry, bridal potlis, unstitched silks, and pure pashminas designed for timeless poise.")}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            <button
              onClick={() => setActiveCategoryTab("all")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-sans cursor-pointer ${
                activeCategoryTab === "all"
                  ? "bg-[#1A1514] text-[#F5F0E8] shadow-md scale-105"
                  : "bg-white/80 hover:bg-white text-[#1A1514]/80 border border-[#B89A62]/25 hover:border-[#B89A62]"
              }`}
            >
              {language === "bn" ? "সব কালেকশন" : "All Curations"} ({displayedItems.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryTab(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-sans cursor-pointer ${
                  activeCategoryTab === cat.id
                    ? "bg-[#6D1F2A] text-[#F5F0E8] shadow-md scale-105 border border-[#B89A62]/40"
                    : "bg-white/80 hover:bg-white text-[#1A1514]/80 border border-[#B89A62]/25 hover:border-[#B89A62]"
                }`}
              >
                {getLocalized(cat.name, language)}
              </button>
            ))}
          </div>

          {/* Active Category Description Banner (if specific tab selected) */}
          {activeCategoryObj && (
            <div className="mt-6 inline-block py-2.5 px-6 rounded-2xl bg-gradient-to-r from-[#B89A62]/10 via-[#F5F0E8] to-[#B89A62]/10 border border-[#B89A62]/30 text-xs sm:text-sm text-[#1A1514]/85 max-w-xl">
              <span className="font-semibold text-[#8C6B38] mr-2">
                {getLocalized(activeCategoryObj.badge, language)}:
              </span>
              {getLocalized(activeCategoryObj.description, language)}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedItems.map(({ product, category }) => (
            <LifestyleProductCard
              key={product.id}
              product={product}
              category={category}
              language={language}
              getLocalized={getLocalized}
              onSelect={() => {
                setSelectedProduct({ product, categoryName: getLocalized(category.name, language) });
                setModalImageAngle("solo");
              }}
              onOrder={() => handleWhatsAppOrder(product, getLocalized(category.name, language))}
              onQuickOrder={() =>
                openOrderModal({
                  id: product.id,
                  name: getLocalized(product.name, language),
                  weave: getLocalized(product.craft, language),
                  color: getLocalized(category.name, language),
                  price: getLocalized(product.price, language),
                  image: product.image,
                })
              }
            />
          ))}
        </div>

        {/* Bottom Editorial Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#201918] to-[#120D0C] text-[#F5F0E8] border border-[#B89A62]/40 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#B89A62]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A62] font-sans block mb-2">
                {language === "bn" ? "আভরণী ব্রাইডাল কনসিয়ার্জ" : "Avoroni Bridal Concierge"}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F5F0E8]">
                {language === "bn"
                  ? "আপনার পছন্দের শাড়ির সাথে মানানসই গয়না ও ক্লাচ ম্যাচিং পরামর্শ চান?"
                  : "Need bespoke styling advice matching your drapes with royal jewelry & potlis?"}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#F5F0E8]/70 mt-2 font-light">
                {language === "bn"
                  ? "আমাদের বনানী স্টুডিওর ব্রাইডাল স্টাইলিস্টের সাথে সরাসরি কথা বলে সম্পূর্ণ বিয়ের সাজ সাজিয়ে নিন।"
                  : "Consult directly with our Dhaka bridal curators for seamless color matching & custom hampers."}
              </p>
            </div>

            <a
              href={`https://wa.me/${content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678"}?text=${encodeURIComponent(
                language === "bn"
                  ? "আসসালামু আলাইকুম! আমি আভরণী ব্রাইডাল স্টাইলিং ও অনুষঙ্গ ম্যাচিং সম্পর্কে পরামর্শ চাই।"
                  : "Hello! I would like to consult an Avoroni bridal stylist for drape & jewelry matching."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#B89A62] hover:bg-[#A38650] text-[#1A1514] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:scale-105 shadow-xl shrink-0"
            >
              <span>✨</span>
              <span>{language === "bn" ? "স্টাইলিস্টের সাথে কথা বলুন" : "Consult A Stylist"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#B89A62]/40 grid grid-cols-1 md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>

            {/* Modal Image Column with Dual-Angle Gallery */}
            <div className="relative flex flex-col bg-[#EFE9DF]">
              <div className="relative aspect-[4/5] md:aspect-auto md:h-full w-full min-h-[360px] overflow-hidden">
                <Image
                  src={
                    (modalImageAngle === "model" && selectedProduct.product.modelImage
                      ? selectedProduct.product.modelImage
                      : selectedProduct.product.image) || "/images/editorial_detail.jpg"
                  }
                  alt={getLocalized(selectedProduct.product.name, language)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-all duration-500"
                />

                {/* Badge indicating currently viewed angle */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="px-3 py-1 text-[10px] font-sans tracking-widest uppercase bg-[#1A1514]/85 backdrop-blur-md text-[#F5F0E8] border border-[#B89A62]/40 rounded-full font-medium shadow-md">
                    {modalImageAngle === "model"
                      ? (language === "bn" ? "✨ মডেলে পরিহিত রূপ" : "✨ Worn by Model")
                      : (language === "bn" ? "💎 একক গয়না কারুকাজ" : "💎 Solo Craft View")}
                  </span>
                </div>

                {/* Dual Gallery Thumbnails (Solo & Model) */}
                {selectedProduct.product.modelImage && (
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-2 p-1.5 bg-[#110D0C]/85 backdrop-blur-md rounded-2xl border border-[#B89A62]/30 shadow-lg">
                    <button
                      type="button"
                      onClick={() => setModalImageAngle("solo")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-sans transition-all cursor-pointer ${
                        modalImageAngle === "solo"
                          ? "bg-[#B89A62] text-[#1A1514] font-semibold border-[#B89A62] shadow-sm"
                          : "bg-black/30 border-transparent text-[#F5F0E8]/70 hover:text-white"
                      }`}
                    >
                      <span className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/20">
                        <Image
                          src={selectedProduct.product.image}
                          alt="Solo"
                          fill
                          className="object-cover"
                        />
                      </span>
                      <span>💎 {language === "bn" ? "একক গয়না" : "Solo Craft"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalImageAngle("model")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-sans transition-all cursor-pointer ${
                        modalImageAngle === "model"
                          ? "bg-[#B89A62] text-[#1A1514] font-semibold border-[#B89A62] shadow-sm"
                          : "bg-black/30 border-transparent text-[#F5F0E8]/70 hover:text-white"
                      }`}
                    >
                      <span className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/20">
                        <Image
                          src={selectedProduct.product.modelImage}
                          alt="Model"
                          fill
                          className="object-cover"
                        />
                      </span>
                      <span>✨ {language === "bn" ? "মডেল লুক" : "On Model"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C6B38] font-sans block mb-1">
                  {selectedProduct.categoryName}
                </span>
                <h3 className="font-serif text-2xl text-[#1A1514] font-normal mb-2">
                  {getLocalized(selectedProduct.product.name, language)}
                </h3>
                <div className="font-serif text-2xl text-[#8C6B38] font-semibold mb-4">
                  {getLocalized(selectedProduct.product.price, language)}
                </div>

                <div className="space-y-3 py-4 border-y border-[#B89A62]/20 text-xs sm:text-sm text-[#1A1514]/80 font-sans">
                  <div>
                    <span className="font-medium text-[#1A1514] block mb-0.5">
                      {language === "bn" ? "কারিগরী ও বুনন বৈশিষ্ট্য:" : "Artisanship & Craft:"}
                    </span>
                    <p className="font-light leading-relaxed">
                      {getLocalized(selectedProduct.product.craft, language)}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-[#1A1514] block mb-0.5">
                      {language === "bn" ? "ডেলিভারি ও নিশ্চয়তা:" : "Delivery & Authenticity:"}
                    </span>
                    <p className="font-light leading-relaxed text-[#1A1514]/70">
                      {language === "bn"
                        ? "🚚 সারাদেশে হোম ডেলিভারি (ঢাকা ৮০৳, ঢাকার বাইরে ১৫০৳)। শতভাগ নিখুঁত ফিনিশিং চেক ও জিরো সাইজ ঝুঁকি।"
                        : "🚚 Nationwide Express Delivery (Dhaka 80৳, Outside 150৳). 100% Quality inspected, zero fitting risk."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProduct.product;
                    openOrderModal({
                      id: prod.id,
                      name: getLocalized(prod.name, language),
                      weave: getLocalized(prod.craft, language),
                      color: selectedProduct.categoryName,
                      price: getLocalized(prod.price, language),
                      image: prod.image,
                    });
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#1A1514] to-[#302624] hover:brightness-125 text-[#FAF5ED] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg border border-[#B89A62]/40 cursor-pointer hover:scale-[1.02]"
                >
                  <span>⚡</span>
                  <span>{language === "bn" ? "ক্যাশ অন ডেলিভারিতে অর্ডার করুন" : "Order Cash on Delivery"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const prod = selectedProduct.product;
                    const cat = selectedProduct.categoryName.toLowerCase();
                    const categoryType: "saree" | "jewelry" | "clutch" | "shawl" =
                      cat.includes("গয়না") || cat.includes("jewel")
                        ? "jewelry"
                        : cat.includes("বটুয়া") || cat.includes("clutch")
                        ? "clutch"
                        : cat.includes("শাল") || cat.includes("shawl")
                        ? "shawl"
                        : "saree";

                    openStudio({
                      id: prod.id,
                      name: prod.name,
                      category: categoryType,
                      image: prod.image,
                      price: prod.price,
                      defaultScale: categoryType === "jewelry" ? 0.7 : 1.0,
                    });
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-[#F5F0E8] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg border border-[#B89A62]/40 cursor-pointer hover:scale-[1.02]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#B89A62] animate-ping" />
                  <span>✨ {language === "bn" ? "ভার্চুয়াল ট্রায়াল রুমে ট্রাই করুন" : "Try On In Virtual Mirror"}</span>
                </button>

                <button
                  onClick={() => {
                    handleWhatsAppOrder(selectedProduct.product, selectedProduct.categoryName);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#F5F0E8] font-sans text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer border border-[#B89A62]/20"
                >
                  <span>💬</span>
                  <span>{language === "bn" ? "হোয়াটসঅ্যাপে অর্ডার করুন" : "Order via WhatsApp"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
