"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useStudio } from "@/context/StudioContext";

export default function MobileStickyBar() {
  const { language, t } = useLanguage();
  const { openStudio } = useStudio();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once user scrolls past hero section (~350px)
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      role="region"
      aria-label="Mobile Quick Actions"
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-40 block md:hidden bg-[#181312]/95 backdrop-blur-xl border-t border-[#C5A869]/35 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.45)] select-none transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Virtual Studio Mirror Action */}
        <button
          type="button"
          onClick={() => openStudio()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-gradient-to-r from-[#6D1F2A] to-[#4A121A] text-[#FAF5ED] text-[11px] font-sans font-medium tracking-wider uppercase border border-[#C5A869]/50 shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5D2A4] animate-ping" />
          <span>✦ {t("mobile_bar_studio")}</span>
        </button>

        {/* WhatsApp VIP Concierge Action */}
        <a
          href={`https://wa.me/8801712345678?text=${encodeURIComponent(
            language === "bn"
              ? "আসসালামু আলাইকুম! আমি আভরণী বনানী স্টুডিওর শাড়ি কালেকশন ও অর্ডার সম্পর্কে জানতে চাই।"
              : "Hello! I would like to inquire about Avoroni sarees and bespoke atelier styling."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#E5D2A4] text-[11px] font-sans font-medium tracking-wider uppercase border border-[#C5A869]/30 active:scale-95 transition-transform"
        >
          <span className="text-emerald-400">💬</span>
          <span>{t("mobile_bar_chat")}</span>
        </a>
      </div>
    </aside>
  );
}
