"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function MaisonTrustBar() {
  const { t } = useLanguage();

  const trustPoints = [
    {
      id: "gi-silk-mark",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      ),
      titleKey: "trust_bar_gi_title",
      descKey: "trust_bar_gi_desc",
    },
    {
      id: "hemming",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M12.008 5.75v1.75m4.152.75l-1.536.887m3.12 4.613l-1.75-.008m-.75 4.152l-.887-1.536M12 18.25v-1.75m-4.152-.75l1.536-.887m-3.12-4.613l1.75.008M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      titleKey: "trust_bar_hemming_title",
      descKey: "trust_bar_hemming_desc",
    },
    {
      id: "pan-bd-express",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 3.75a3 3 0 013 3v4.5m-3-7.5H4.875c-.621 0-1.125.504-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125h1.5" />
        </svg>
      ),
      titleKey: "trust_bar_delivery_title",
      descKey: "trust_bar_delivery_desc",
    },
    {
      id: "video-consult",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      titleKey: "trust_bar_video_title",
      descKey: "trust_bar_video_desc",
    },
  ];

  return (
    <aside
      aria-label="Maison Craft Guarantees"
      className="relative w-full bg-[#181312] text-[#F5F0E8] border-y border-[#C5A869]/30 py-5 sm:py-6 px-4 sm:px-8 z-10 select-none shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
    >
      {/* Delicate Gold Gradient Highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#C5A869]/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {trustPoints.map((item, idx) => (
          <div
            key={item.id}
            className={`group flex items-center gap-3.5 px-3 py-2 sm:p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.04] ${
              idx !== trustPoints.length - 1 ? "lg:border-r lg:border-[#C5A869]/15" : ""
            }`}
          >
            {/* Elegant Antique Gold Icon Glyph */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6D1F2A]/40 border border-[#C5A869]/40 text-[#E5D2A4] shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs">
              {item.icon}
            </div>

            {/* Text Hierarchy */}
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[13px] sm:text-[14px] text-[#FAF5ED] font-medium tracking-wide group-hover:text-[#E5D2A4] transition-colors truncate">
                {t(item.titleKey)}
              </span>
              <span className="font-sans text-[10px] sm:text-[10.5px] text-[#EDE3D5]/65 font-light leading-snug tracking-wider">
                {t(item.descKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
