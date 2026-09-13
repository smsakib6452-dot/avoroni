"use client";

import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function LanguageToggle({
  variant = "dark",
  className = "",
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const isLight = variant === "light";

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border transition-all duration-300 select-none shadow-xs ${
        isLight
          ? "border-[#C5A869]/40 bg-[#1A1514]/50 backdrop-blur-md text-[#F5F0E8] hover:border-[#C5A869]/80"
          : "border-[#C5A869]/35 bg-[#FAF7F2]/90 backdrop-blur-md text-[#1A1514] hover:border-[#C5A869]/70"
      } ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-[10px] font-sans font-medium tracking-[0.12em] transition-all duration-300 cursor-pointer ${
          language === "en"
            ? isLight
              ? "bg-[#FAF5ED] text-[#1A1514] shadow-sm font-semibold"
              : "bg-[#6D1F2A] text-[#FAF5ED] shadow-sm font-semibold"
            : isLight
            ? "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
            : "text-[#1A1514]/60 hover:text-[#1A1514]"
        }`}
        aria-pressed={language === "en"}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={`px-3 py-1 rounded-full text-[10.5px] font-sans font-medium tracking-normal transition-all duration-300 cursor-pointer ${
          language === "bn"
            ? isLight
              ? "bg-[#FAF5ED] text-[#1A1514] shadow-sm font-semibold"
              : "bg-[#6D1F2A] text-[#FAF5ED] shadow-sm font-semibold"
            : isLight
            ? "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
            : "text-[#1A1514]/60 hover:text-[#1A1514]"
        }`}
        aria-pressed={language === "bn"}
      >
        বাংলা
      </button>
    </div>
  );
}
