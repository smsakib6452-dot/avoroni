"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GalleryPiece {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  weave: string;
  provenance: string;
  hours: string;
  image: string;
}

const GALLERY_PIECES: GalleryPiece[] = [
  {
    id: "maharani-crimson",
    number: "Plate N° 01",
    title: "The Maharani Crimson Brocade",
    subtitle: "Imperial Banarasi Silk with 24k Antique Gold Kadwa Weave",
    weave: "Pure Kashi Mulberry Silk",
    provenance: "Varanasi Atelier",
    hours: "210 Handloom Hours",
    image: "/images/hero_culture.jpg",
  },
  {
    id: "kora-tissue",
    number: "Plate N° 02",
    title: "The Kora Tissue Drape",
    subtitle: "Natural Unbleached Silk Woven with Spun Silver Filaments",
    weave: "Raw Mulberry Tissue",
    provenance: "Chanderi Atelier",
    hours: "165 Handloom Hours",
    image: "/images/contact_intro.jpg",
  },
  {
    id: "padmavati-emerald",
    number: "Plate N° 03",
    title: "The Padmavati Emerald Korvai",
    subtitle: "Temple Border Kanchipuram with Sacred Lotus Borders",
    weave: "Double Warp Kanchipuram Twill",
    provenance: "Tamil Nadu Master Weavers",
    hours: "240 Handloom Hours",
    image: "/images/editorial_portrait.jpg",
  },
  {
    id: "gulabi-organza",
    number: "Plate N° 04",
    title: "The Gulabi Organza Drape",
    subtitle: "Sheer Rose Silk Featuring Hand-Beaten Gold Zardozi Medallions",
    weave: "Handloom Sheer Organza",
    provenance: "Varanasi Silk Archive",
    hours: "185 Handloom Hours",
    image: "/images/swatch_rose.jpg",
  },
];

export default function ProductGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header entrance with power3.out
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 82%",
          },
        }
      );

      // Vertically stacked dominant image reveals (clip-path + scale 1.1 -> 1.0)
      gsap.utils.toArray<HTMLElement>(".gallery-plate-item").forEach((item) => {
        const imgBox = item.querySelector(".gallery-img-box");
        const img = item.querySelector(".gallery-img");
        const meta = item.querySelector(".gallery-meta-box");

        if (imgBox) {
          gsap.fromTo(
            imgBox,
            {
              opacity: 0.8,
              clipPath: "inset(14% 0 14% 0)",
            },
            {
              opacity: 1,
              clipPath: "inset(0% 0 0% 0)",
              duration: 1.35,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 78%",
              },
            }
          );
        }

        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.10, yPercent: -3 },
            {
              scale: 1.0,
              yPercent: 3,
              duration: 1.45,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }

        if (meta) {
          gsap.fromTo(
            meta,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: meta,
                start: "top 85%",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-36 sm:py-48 lg:py-56 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Product Gallery"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-24 sm:gap-36">
        {/* Section Header */}
        <div
          ref={titleRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-2.5">
            <span className="font-sans text-[9.5px] tracking-[0.38em] uppercase text-[#6D1F2A] font-medium">
              Curated Lookbook &bull; Masterpiece Archive
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1514] tracking-tight leading-[0.92]">
              Product Gallery
            </h2>
          </div>

          <span className="font-sans text-[9.5px] tracking-[0.3em] uppercase text-[#1A1514]/45">
            Image &gt; Typography &gt; Metadata
          </span>
        </div>

        {/* Vertically Stacked Editorial Gallery: Raw on Canvas */}
        <div className="flex flex-col gap-32 sm:gap-48">
          {GALLERY_PIECES.map((piece, index) => {
            const isEven = index % 2 === 1;
            return (
              <article
                key={piece.id}
                className="gallery-plate-item flex flex-col gap-6 max-w-5xl mx-auto w-full"
              >
                {/* Viewport-Dominating Large Image (Raw on Canvas) */}
                <div
                  className="gallery-img-box relative w-full h-[70vh] sm:h-[80vh] max-h-[860px] overflow-hidden"
                  style={{ clipPath: "inset(14% 0 14% 0)" }}
                >
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 85vw"
                    className="gallery-img object-cover object-[center_top] scale-110 will-change-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1514]/45 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Curatorial Tag */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-[#F5F0E8] text-[9px] tracking-[0.28em] uppercase font-sans">
                    <span>{piece.provenance}</span>
                    <span className="text-[#B89A62]">{piece.hours}</span>
                  </div>
                </div>

                {/* Minimal Editorial Metadata Directly Beneath Image */}
                <div
                  className={`gallery-meta-box flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pt-1 ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1.5 max-w-xl">
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#6D1F2A] font-semibold">
                      {piece.number}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1514]">
                      {piece.title}
                    </h3>
                    <p className="font-sans text-xs text-[#1A1514]/70 font-light pt-0.5 leading-relaxed">
                      {piece.subtitle} &bull; {piece.weave}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-0">
                    <a
                      href="#contact"
                      className="editorial-link inline-block font-sans text-[10.5px] tracking-[0.28em] uppercase text-[#1A1514] hover:text-[#6D1F2A] font-medium py-2 min-h-[44px]"
                    >
                      Inquire &rarr;
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
