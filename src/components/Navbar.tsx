"use client";

import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo";
import MobileMenu from "./MobileMenu";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useStudio } from "@/context/StudioContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, t } = useLanguage();
  const { openStudio } = useStudio();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 select-none ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md py-3.5 text-[#1A1514] border-b border-[#C5A869]/20 shadow-[0_4px_24px_rgba(26,21,20,0.06)]"
            : "bg-transparent py-5 md:py-7 text-[#F5F0E8]"
        }`}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-6">
          {/* Header Left: Official Brand Logo with Responsive Luxury Scaling */}
          <a
            href="#culture"
            className="flex items-center focus:outline-none min-h-[44px] shrink-0 group py-1"
            aria-label="Avoroni Home"
          >
            {/* Mobile (Compact & Clean) */}
            <div className="block md:hidden">
              <BrandLogo
                size={isScrolled ? 34 : 42}
                variant={isScrolled ? "dark" : "light"}
                className="transition-all duration-300 group-hover:scale-105"
              />
            </div>

            {/* Desktop & Tablet (Prominent Luxury Presence) */}
            <div className="hidden md:block">
              <BrandLogo
                size={isScrolled ? 50 : 72}
                variant={isScrolled ? "dark" : "light"}
                className="transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </a>

          {/* Center Navigation: Bilingual Single-Line Haute Couture Links */}
          <nav
            className="hidden xl:flex items-center gap-5 lg:gap-7 2xl:gap-8 text-[11px] tracking-[0.22em] uppercase font-sans font-medium"
            aria-label="Main Navigation"
          >
            <a
              href="#new-arrivals"
              className={`editorial-link whitespace-nowrap py-1 transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A1514]/80 hover:text-[#6D1F2A]"
                  : "text-[#F5F0E8]/85 hover:text-[#F5F0E8]"
              }`}
            >
              {t("nav_new_arrivals")}
            </a>
            <a
              href="#lifestyle"
              className={`editorial-link whitespace-nowrap py-1 transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A1514]/80 hover:text-[#6D1F2A]"
                  : "text-[#F5F0E8]/85 hover:text-[#F5F0E8]"
              }`}
            >
              {t("nav_lifestyle")}
            </a>
            <a
              href="#categories"
              className={`editorial-link whitespace-nowrap py-1 transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A1514]/80 hover:text-[#6D1F2A]"
                  : "text-[#F5F0E8]/85 hover:text-[#F5F0E8]"
              }`}
            >
              {t("nav_shop_by_origin")}
            </a>
            <a
              href="#shop-by-color"
              className={`editorial-link whitespace-nowrap py-1 transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A1514]/80 hover:text-[#6D1F2A]"
                  : "text-[#F5F0E8]/85 hover:text-[#F5F0E8]"
              }`}
            >
              {t("nav_shop_by_color")}
            </a>
            <a
              href="#best-seller"
              className={`editorial-link whitespace-nowrap py-1 transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A1514]/80 hover:text-[#6D1F2A]"
                  : "text-[#F5F0E8]/85 hover:text-[#F5F0E8]"
              }`}
            >
              {t("nav_best_seller")}
            </a>
            <a
              href="#contact"
              className={`editorial-link whitespace-nowrap py-1 transition-colors duration-300 ${
                isScrolled
                  ? "text-[#1A1514]/80 hover:text-[#6D1F2A]"
                  : "text-[#F5F0E8]/85 hover:text-[#F5F0E8]"
              }`}
            >
              {t("nav_contact")}
            </a>
          </nav>

          {/* Header Right: Language Toggle, Haute Couture Studio CTA & Menu Trigger */}
          <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
            {/* Bilingual Language Switcher Button */}
            <LanguageToggle variant={isScrolled ? "dark" : "light"} />

            {/* Haute Couture Atelier Studio CTA Button */}
            <button
              type="button"
              onClick={() => openStudio()}
              className="group relative hidden lg:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full overflow-hidden transition-all duration-400 cursor-pointer border border-[#C5A869]/70 hover:border-[#F5F0E8] bg-gradient-to-r from-[#4A121A] via-[#6D1F2A] to-[#4A121A] shadow-[0_2px_12px_rgba(109,31,42,0.3)] hover:shadow-[0_4px_22px_rgba(197,168,105,0.45)] hover:-translate-y-0.5 active:translate-y-0 select-none"
              title={language === "bn" ? "ভার্চুয়াল ট্রায়াল রুম খুলুন" : "Open Virtual Fitting Studio"}
            >
              {/* Shimmer Light Sweep on hover */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Pulsing Champagne Beacon */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A869] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5D2A4]" />
              </span>

              {/* Text */}
              <span className="relative font-sans text-[10.5px] font-semibold tracking-[0.24em] uppercase text-[#FAF5ED] group-hover:text-white transition-colors whitespace-nowrap">
                {t("nav_atelier")}
              </span>

              {/* Sparkling Diamond Glyph */}
              <span className="text-[12px] text-[#E5D2A4] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 shrink-0">
                ✦
              </span>
            </button>

            {/* Menu Trigger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="group flex items-center gap-2.5 p-2 focus:outline-none cursor-pointer min-h-[44px] justify-end"
              aria-label="Open navigation menu"
            >
              <span
                className={`text-[9.5px] tracking-[0.3em] uppercase font-sans font-medium hidden sm:inline-block transition-colors ${
                  isScrolled
                    ? "text-[#1A1514]/75 group-hover:text-[#6D1F2A]"
                    : "text-[#F5F0E8]/75 group-hover:text-white"
                }`}
              >
                {t("nav_menu")}
              </span>
              <div className="w-5 flex flex-col gap-1.5 items-end">
                <span
                  className={`block h-[1.5px] w-5 transition-all duration-300 ${
                    isScrolled
                      ? "bg-[#1A1514] group-hover:bg-[#6D1F2A]"
                      : "bg-[#F5F0E8] group-hover:bg-[#C5A869]"
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-3.5 group-hover:w-5 transition-all duration-300 ${
                    isScrolled
                      ? "bg-[#1A1514] group-hover:bg-[#6D1F2A]"
                      : "bg-[#F5F0E8] group-hover:bg-[#C5A869]"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
