"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import BrandLogo from "./BrandLogo";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useStudio } from "@/context/StudioContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const { language, t } = useLanguage();
  const { openStudio } = useStudio();

  const menuItems = [
    { label: t("nav_home"), href: "#culture", roman: "I" },
    { label: t("nav_new_arrivals"), href: "#new-arrivals", roman: "II" },
    { label: t("nav_shop_by_origin"), href: "#categories", roman: "III" },
    { label: t("nav_lifestyle"), href: "#lifestyle", roman: "IV" },
    { label: t("nav_shop_by_color"), href: "#shop-by-color", roman: "V" },
    { label: t("nav_best_seller"), href: "#best-seller", roman: "VI" },
    { label: t("nav_contact"), href: "#contact", roman: "VII" },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const overlay = overlayRef.current;
    const items = itemsRef.current.filter(Boolean);

    if (!overlay) return;

    if (!timelineRef.current) {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
      });

      if (prefersReducedMotion) {
        tl.to(overlay, {
          opacity: 1,
          duration: 0.25,
        });
      } else {
        tl.fromTo(
          overlay,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.7,
            ease: "power3.inOut",
          }
        ).fromTo(
          items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.25"
        );
      }

      timelineRef.current = tl;
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      timelineRef.current.play();
    } else {
      document.body.style.overflow = "";
      timelineRef.current.reverse();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[9999] bg-[#F5F0E8] text-[#1A1514] flex flex-col justify-between p-6 sm:p-10 select-none ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ clipPath: "inset(0 0 100% 0)" }}
      aria-modal="true"
      role="dialog"
      aria-label="Mobile Navigation Menu"
    >
      {/* Header Bar: Logo on Left, Language Switcher & Close on Right */}
      <div className="flex items-center justify-between border-b border-[#1A1514]/10 pb-4">
        <a
          href="#culture"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("#culture");
          }}
          className="focus:outline-none flex items-center min-h-[44px]"
        >
          <BrandLogo size={34} variant="dark" />
        </a>

        <div className="flex items-center gap-3">
          <LanguageToggle variant="dark" />

          <button
            onClick={onClose}
            className="group flex items-center gap-2 text-[10px] font-sans tracking-[0.25em] uppercase py-2 px-3 text-[#1A1514] hover:text-[#6D1F2A] transition-colors focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] justify-end"
            aria-label="Close menu"
          >
            <span className="font-medium">{t("nav_close")}</span>
            <span className="text-2xl leading-none transition-transform group-hover:rotate-90 duration-300">
              &times;
            </span>
          </button>
        </div>
      </div>

      {/* Virtual Trial Studio CTA Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => {
            onClose();
            openStudio();
          }}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#6D1F2A] hover:bg-[#852735] text-[#F5F0E8] font-sans text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2.5 shadow-lg border border-[#B89A62]/40 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#B89A62] animate-ping" />
          <span>✨ {language === "bn" ? "ভার্চুয়াল ট্রায়াল স্টুডিও" : "Virtual Trial Studio"}</span>
        </button>
      </div>

      {/* Stacked Navigation Links with Large Serif Typography */}
      <nav
        className="my-auto flex flex-col gap-2.5 py-6"
        aria-label="Mobile Navigation Links"
      >
        {menuItems.map((item, index) => (
          <a
            key={item.label}
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(item.href);
            }}
            className="group flex items-baseline justify-between py-2 border-b border-[#1A1514]/5 transition-colors hover:text-[#6D1F2A] min-h-[48px]"
          >
            <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide transition-transform duration-300 group-hover:translate-x-3 text-[#1A1514] group-hover:text-[#6D1F2A]">
              {item.label}
            </span>
            <span className="font-serif text-xs tracking-[0.25em] uppercase text-[#1A1514]/40 group-hover:text-[#6D1F2A]">
              {item.roman}
            </span>
          </a>
        ))}
      </nav>

      {/* Footer / Maison Provenance */}
      <div className="border-t border-[#1A1514]/10 pt-4 flex items-center justify-between text-[9px] tracking-[0.22em] uppercase text-[#1A1514]/55 font-sans">
        <span>Atelier Banani &bull; Dhaka</span>
        <span className="text-[#6D1F2A] font-medium">&copy; Avoroni Dhaka</span>
      </div>
    </div>
  );
}
