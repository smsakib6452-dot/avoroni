"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "./ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export default function ContactIntro() {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const contactData = content?.contact;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formColRef = useRef<HTMLDivElement>(null);

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

      // Left column image and info entrance
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftColRef.current,
            start: "top 78%",
          },
        }
      );

      // Form entrance
      gsap.fromTo(
        formColRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formColRef.current,
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Contact and Atelier"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14 sm:gap-20">
        {/* Header from Reference Video */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center gap-3"
        >
          {/* Pill: CONTACT US */}
          <span className="inline-block px-3.5 py-1 bg-[#6D1F2A]/10 border border-[#6D1F2A]/30 rounded-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-medium">
            {getLocalized(contactData?.pill, language) || t("contact_pill")}
          </span>

          {/* Heading: We'd Love to Hear From You */}
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1514] tracking-tight leading-[0.95]">
            {getLocalized(contactData?.heading, language) || t("contact_heading")}
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm text-[#1A1514]/70 font-light max-w-lg leading-relaxed">
            {getLocalized(contactData?.subtitle, language) || t("contact_subtitle")}
          </p>
        </div>

        {/* 2-Column Split: Visual & Details (Left) + Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Two Friends Photo + Banani Dhaka Atelier Info */}
          <div ref={leftColRef} className="lg:col-span-6 flex flex-col gap-8">
            {/* Exact Photo of Two Smiling Friends from Frame 00:09 */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#EDE3D5] shadow-sm">
              <Image
                src={contactData?.image || "/images/contact_friends.jpg"}
                alt="Two smiling Bangladeshi women draped in elegant sarees enjoying conversation on terrace"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_28%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1514]/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 text-[#F5F0E8] text-[9px] tracking-[0.25em] uppercase font-sans">
                {getLocalized(contactData?.caption, language) || t("contact_friends_caption")}
              </div>
            </div>

            {/* Contact Details Grid for Dhaka */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#EDE3D5]/40 p-6 sm:p-7 rounded-3xl border border-[#1A1514]/10">
              {/* Call Us */}
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#6D1F2A] font-semibold">
                  {t("contact_call_label")}
                </span>
                <p className="font-serif text-lg text-[#1A1514]">
                  {contactData?.phone || t("contact_call_val")}
                </p>
                <span className="font-sans text-[10.5px] text-[#1A1514]/60 font-light">
                  {getLocalized(contactData?.phoneHours, language) || t("contact_call_hours")}
                </span>
              </div>

              {/* Email Us */}
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#6D1F2A] font-semibold">
                  {t("contact_email_label")}
                </span>
                <p className="font-serif text-lg text-[#1A1514]">
                  {contactData?.email || t("contact_email_val")}
                </p>
                <span className="font-sans text-[10.5px] text-[#1A1514]/60 font-light">
                  {getLocalized(contactData?.emailSub, language) || t("contact_email_sub")}
                </span>
              </div>

              {/* Visit Studio */}
              <div className="sm:col-span-2 flex flex-col gap-1 pt-2 border-t border-[#1A1514]/10">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#6D1F2A] font-semibold">
                    {t("contact_studio_label")}
                  </span>
                  <a
                    href={contactData?.mapsUrl || "https://maps.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] tracking-[0.2em] uppercase text-[#6D1F2A] hover:underline font-medium"
                  >
                    {t("contact_directions")} &rarr;
                  </a>
                </div>
                <p className="font-serif text-base text-[#1A1514]">
                  {getLocalized(contactData?.studioAddress, language) || t("contact_studio_val")}
                </p>
                {contactData?.studioHours && (
                  <span className="font-sans text-[11px] text-[#1A1514]/60 font-light pt-0.5">
                    {getLocalized(contactData?.studioHours, language)}
                  </span>
                )}
              </div>

              {/* Follow Us */}
              <div className="sm:col-span-2 flex items-center justify-between pt-2 border-t border-[#1A1514]/10 text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#1A1514]/60">
                <span>{t("contact_follow_label")}</span>
                <div className="flex items-center gap-4 text-[#1A1514]">
                  <a href="#contact" className="hover:text-[#6D1F2A] transition-colors">
                    Instagram
                  </a>
                  <span>&bull;</span>
                  <a href="#contact" className="hover:text-[#6D1F2A] transition-colors">
                    Facebook
                  </a>
                  <span>&bull;</span>
                  <a href="https://wa.me/8801712345678" target="_blank" rel="noreferrer" className="hover:text-[#6D1F2A] transition-colors">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Message Form */}
          <div ref={formColRef} className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
