"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

interface HeroProps {
  startAnimation?: boolean;
}

export default function Hero({ startAnimation = true }: HeroProps) {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const heroData = content?.hero;
  const sectionRef = useRef<HTMLElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageScaleRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startAnimation) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            imageMaskRef.current,
            imageScaleRef.current,
            pillRef.current,
            headingRef.current,
            subtitleRef.current,
            ctaRef.current,
            statsRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0 0% 0)",
          }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Initial states
      gsap.set(imageMaskRef.current, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 1,
      });
      gsap.set(imageScaleRef.current, {
        scale: 1.10,
      });
      gsap.set(pillRef.current, { opacity: 0, y: 20 });
      gsap.set(headingRef.current, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0,
        y: 40,
      });
      gsap.set(subtitleRef.current, { opacity: 0, y: 25 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.set(statsRef.current, { opacity: 0, y: 18 });

      // Exact GSAP sequence matching reference video
      tl.to(imageMaskRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.2,
        ease: "power3.inOut",
      })
        .to(
          imageScaleRef.current,
          {
            scale: 1.0,
            duration: 1.5,
            ease: "power2.out",
          },
          0
        )
        .to(
          pillRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          headingRef.current,
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [startAnimation]);

  return (
    <section
      id="culture"
      ref={sectionRef}
      className="relative w-full h-[100dvh] min-h-[680px] max-h-[1200px] overflow-hidden bg-[#1A1514] flex flex-col justify-between select-none"
      aria-label="Culture & Heritage Hero"
    >
      {/* Background Image with Rich Crimson Silk & Model */}
      <div
        ref={imageMaskRef}
        className="absolute inset-0 w-full h-full overflow-hidden will-change-transform z-0"
        style={{ clipPath: "inset(100% 0 0 0)" }}
      >
        <div
          ref={imageScaleRef}
          className="relative w-full h-full will-change-transform"
          style={{ transform: "scale(1.10)" }}
        >
          <Image
            src={heroData?.image || "/images/hero_culture.jpg"}
            alt="Avoroni royal silk saree draped in palatial architecture"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_25%] md:object-[64%_25%] lg:object-[60%_22%]"
          />
          {/* Subtle cinematic gradient to guarantee high contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1514]/90 via-[#1A1514]/30 to-[#1A1514]/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1514]/90 via-[#1A1514]/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Spacing above content */}
      <div className="pt-24 md:pt-28" />

      {/* Main Left-Aligned Asymmetric Editorial Composition */}
      <div className="relative z-10 px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto w-full my-auto flex flex-col items-start gap-4 sm:gap-6">
        {/* Exact Eyebrow Pill: SAREES WOVEN WITH */}
        <div ref={pillRef} className="flex items-center gap-2">
          <span className="inline-block px-3.5 py-1 bg-[#6D1F2A]/80 backdrop-blur-sm border border-[#F5F0E8]/20 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#F5F0E8] font-sans font-medium">
            {getLocalized(heroData?.eyebrow, language) || t("hero_eyebrow")}
          </span>
        </div>

        {/* Giant Serif Heading: CULTURE */}
        <h1
          ref={headingRef}
          className="font-serif text-[#F5F0E8] font-light text-[22vw] sm:text-[18vw] md:text-[15vw] lg:text-[13vw] leading-[0.82] tracking-[-0.035em] uppercase"
          style={{ willChange: "clip-path, transform, opacity" }}
        >
          {getLocalized(heroData?.heading, language) || t("hero_heading")}
        </h1>

        {/* Subtitle: HEIRLOOM DRAPES FOR MODERN STORIES */}
        <div ref={subtitleRef} className="flex flex-col gap-1 max-w-md">
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#F5F0E8]/95 font-light tracking-wide uppercase leading-tight">
            {getLocalized(heroData?.subtitle_1, language) || t("hero_subtitle_1")} <br />
            {getLocalized(heroData?.subtitle_2, language) || t("hero_subtitle_2")}
          </p>
          <p className="font-sans text-[11px] sm:text-xs text-[#EDE3D5]/75 font-light leading-relaxed pt-1">
            {getLocalized(heroData?.description, language) || t("hero_description")}
          </p>
        </div>

        {/* CTA Button: EXPLORE THE COLLECTION → */}
        <div className="pt-2">
          <a
            ref={ctaRef}
            href={heroData?.ctaLink || "#new-arrivals"}
            className="group relative overflow-hidden inline-flex items-center gap-3.5 px-7 sm:px-9 py-3.5 bg-[#1A1514]/40 backdrop-blur-md border border-[#C5A869]/70 rounded-full text-[#FAF5ED] text-[10.5px] sm:text-[11px] font-sans tracking-[0.24em] uppercase transition-all duration-500 hover:bg-[#FAF5ED] hover:border-[#FAF5ED] hover:text-[#1A1514] hover:shadow-[0_6px_28px_rgba(197,168,105,0.35)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
          >
            <span className="relative z-10">{getLocalized(heroData?.cta, language) || t("hero_cta")}</span>
            <svg
              className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
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
      </div>

      {/* Exact Bottom 3-Stat Divider */}
      <div
        ref={statsRef}
        className="relative z-10 pb-8 sm:pb-12 px-6 sm:px-10 md:px-16 lg:px-20 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 border-t border-[#F5F0E8]/15 pt-6 text-[9.5px] sm:text-[10.5px] tracking-[0.25em] uppercase font-sans text-[#F5F0E8]/75">
          <span className="font-medium text-[#F5F0E8]">
            {getLocalized(heroData?.stat_1, language) || t("hero_stat_1")}
          </span>
          <span className="text-[#F5F0E8]/30">&bull;</span>
          <span>{getLocalized(heroData?.stat_2, language) || t("hero_stat_2")}</span>
          <span className="text-[#F5F0E8]/30 hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">
            {getLocalized(heroData?.stat_3, language) || t("hero_stat_3")}
          </span>
        </div>
      </div>
    </section>
  );
}
