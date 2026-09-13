"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EditorialCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingGroupRef = useRef<HTMLDivElement>(null);
  const plate1Ref = useRef<HTMLDivElement>(null);
  const plate1ImgRef = useRef<HTMLImageElement>(null);
  const plate2Ref = useRef<HTMLDivElement>(null);
  const plate2ImgRef = useRef<HTMLImageElement>(null);
  const plate3Ref = useRef<HTMLDivElement>(null);
  const plate3ImgRef = useRef<HTMLImageElement>(null);
  const essayRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Heading sequence with power3.out
      gsap.fromTo(
        headingGroupRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingGroupRef.current,
            start: "top 85%",
          },
        }
      );

      // 2. Editorial Plates: Masked clip-path + scale 1.1 -> 1.0 + subtle parallax
      const plates = [
        { wrapper: plate1Ref.current, img: plate1ImgRef.current },
        { wrapper: plate2Ref.current, img: plate2ImgRef.current },
        { wrapper: plate3Ref.current, img: plate3ImgRef.current },
      ];

      plates.forEach(({ wrapper, img }) => {
        if (!wrapper || !img) return;

        // Masked reveal: clip-path inset + scale transition (1.1 -> 1.0)
        gsap.fromTo(
          wrapper,
          {
            clipPath: "inset(16% 0 16% 0)",
            opacity: 0.8,
          },
          {
            clipPath: "inset(0% 0 0% 0)",
            opacity: 1,
            duration: 1.35,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 82%",
            },
          }
        );

        gsap.fromTo(
          img,
          { scale: 1.10 },
          {
            scale: 1.0,
            duration: 1.45,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 82%",
            },
          }
        );

        // Subtle restrained parallax
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // 3. Editorial Essay & Quotes stagger fade-in (power3.out)
      [essayRef.current, quoteRef.current].forEach((textEl) => {
        if (!textEl) return;
        gsap.fromTo(
          textEl,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textEl,
              start: "top 82%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="editorial"
      ref={sectionRef}
      className="relative w-full bg-[#F5F0E8] text-[#1A1514] py-36 sm:py-48 lg:py-56 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Editorial Collection"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-28 sm:gap-40">
        {/* Editorial Section Eyebrow & Title (Generous Whitespace, No Borders) */}
        <div
          ref={headingGroupRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[9.5px] tracking-[0.38em] uppercase text-[#6D1F2A] font-medium">
              Editorial Feature &bull; Vol. IX
            </span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-[#1A1514] tracking-tight leading-[0.95]">
              The Architecture of Drape
            </h2>
          </div>

          <p className="font-sans text-xs tracking-wider text-[#1A1514]/55 max-w-xs font-light leading-relaxed">
            Six yards of unbroken handloom geometry. Preserving ancient loom
            structures from the holy ghats of Kashi.
          </p>
        </div>

        {/* Movement I: Asymmetric Spread (Plate I Sits Raw, Monograph & Plate II Float in Negative Space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Plate I: Dominant Tall Focal Image (7 cols) - Raw on Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              ref={plate1Ref}
              className="relative w-full aspect-[10/14] overflow-hidden"
              style={{ clipPath: "inset(16% 0 16% 0)" }}
            >
              <Image
                ref={plate1ImgRef}
                src="/images/editorial_large.jpg"
                alt="Avoroni royal Banarasi silk saree editorial in ancient haveli corridor"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center will-change-transform scale-110"
              />
            </div>

            <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-[#1A1514]/45 font-sans pt-1">
              <span>Plate I &bull; Imperial Kashi Brocade</span>
              <span className="text-[#6D1F2A]">Kashi Silk Archive</span>
            </div>
          </div>

          {/* Right Column: Generous Negative Space, Floating Monograph, and Offset Macro Detail */}
          <div className="lg:col-span-5 flex flex-col gap-20 lg:pt-12">
            {/* Curatorial Essay */}
            <div ref={essayRef} className="flex flex-col gap-6 max-w-md">
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#B89A62] font-semibold">
                Curator&rsquo;s Monograph
              </span>

              <h3 className="font-serif text-3xl sm:text-4xl font-light leading-snug text-[#1A1514]">
                &ldquo;In Indian handloom philosophy, the uncut fabric is sacred.
                To shear it is to diminish its cosmic continuum.&rdquo;
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#1A1514]/70 font-light leading-relaxed">
                Every warp and weft woven at Avoroni honors the discipline of
                continuous gold thread filigree. Our master artisans in
                Varanasi practice pit-loom weaving where each leaf motif is
                interlocked by hand, requiring months of silent devotion.
              </p>

              <div className="pt-2">
                <a
                  href="#shop-by-color"
                  className="editorial-link font-sans text-[11px] tracking-[0.28em] uppercase text-[#6D1F2A] font-medium"
                >
                  Discover The Palette &rarr;
                </a>
              </div>
            </div>

            {/* Plate II: Macro Detail Shot Floating In Asymmetric Negative Space - Raw on Canvas */}
            <div className="flex flex-col gap-3 self-end w-full sm:w-4/5 lg:w-full">
              <div
                ref={plate2Ref}
                className="relative w-full aspect-square overflow-hidden"
                style={{ clipPath: "inset(16% 0 16% 0)" }}
              >
                <Image
                  ref={plate2ImgRef}
                  src="/images/editorial_detail.jpg"
                  alt="24 Karat gold zari metallic thread hand-woven into crimson raw silk"
                  fill
                  sizes="(max-width: 1024px) 70vw, 35vw"
                  className="object-cover will-change-transform scale-110"
                />
              </div>

              <div className="flex items-center justify-between text-[9px] tracking-[0.25em] uppercase text-[#1A1514]/45 font-sans">
                <span>Plate II &bull; 24k Zari Filament</span>
                <span>180 Handloom Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Movement II: Asymmetric Cascading Spread (Offset Plate III + Poetic Editorial Quote) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center pt-8 sm:pt-16">
          {/* Poetic Quote Column (Left on desktop - 5 cols) */}
          <div
            ref={quoteRef}
            className="lg:col-span-5 flex flex-col gap-6 lg:pr-8 order-2 lg:order-1"
          >
            <div className="h-[1px] w-12 bg-[#B89A62]/60" />
            <blockquote className="font-serif text-3xl sm:text-4xl text-[#1A1514]/90 font-light italic leading-snug">
              &ldquo;The gold does not fade; it merely learns the contours of
              the wearer, softening into a family heirloom across
              centuries.&rdquo;
            </blockquote>
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#1A1514]/40">
              The Heritage Weaving Registry
            </span>
          </div>

          {/* Plate III: Offset Portrait Plate (Right on desktop - 7 cols) - Raw on Canvas */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div
              ref={plate3Ref}
              className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden"
              style={{ clipPath: "inset(16% 0 16% 0)" }}
            >
              <Image
                ref={plate3ImgRef}
                src="/images/editorial_portrait.jpg"
                alt="Model draped in emerald green Kanchipuram silk saree"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-[center_top] will-change-transform scale-110"
              />
            </div>

            <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-[#1A1514]/45 font-sans pt-2">
              <span>Plate III &bull; Peacock Emerald Kanchipuram</span>
              <span className="text-[#6D1F2A]">Pure Zari Twill</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
