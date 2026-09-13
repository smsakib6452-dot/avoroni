"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import BrandMark from "./BrandMark";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current || !markRef.current || !textRef.current) {
      setIsDone(true);
      if (onComplete) onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          if (onComplete) onComplete();
        },
      });

      // Initial state
      gsap.set(markRef.current, { opacity: 0, scale: 0.85 });
      gsap.set(textRef.current, { opacity: 0, y: 12 });
      gsap.set(".particle", { opacity: 0, scale: 0 });

      // Entrance animation: 700ms - 1000ms
      tl.to(markRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      })
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          ".particle",
          {
            opacity: 0.65,
            scale: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: "power1.out",
          },
          "-=0.6"
        )
        // Subtle pause for luxury weight
        .to({}, { duration: 0.35 })
        // Graceful curtain exit
        .to(containerRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.75,
          ease: "power3.inOut",
        });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5F0E8] overflow-hidden select-none pointer-events-auto"
      style={{ willChange: "opacity, transform" }}
    >
      {/* Subtle decorative textile particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <span
          className="particle absolute w-1.5 h-1.5 rounded-full bg-[#B89A62]/45"
          style={{ transform: "translate(-90px, -65px)" }}
        />
        <span
          className="particle absolute w-1 h-1 rounded-full bg-[#6D1F2A]/35"
          style={{ transform: "translate(95px, -50px)" }}
        />
        <span
          className="particle absolute w-2 h-2 rounded-full border border-[#B89A62]/35"
          style={{ transform: "translate(-110px, 60px)" }}
        />
        <span
          className="particle absolute w-1.5 h-1.5 rounded-full bg-[#B89A62]/55"
          style={{ transform: "translate(85px, 80px)" }}
        />
        <span
          className="particle absolute w-1 h-1 rounded-full bg-[#6D1F2A]/25"
          style={{ transform: "translate(0px, -100px)" }}
        />
      </div>

      {/* Brand mark with user's authentic Avoroni crest */}
      <div ref={markRef} className="relative z-10 flex flex-col items-center">
        <BrandMark size={56} variant="dark" />
      </div>

      {/* Brand typographic signature */}
      <div
        ref={textRef}
        className="mt-6 text-center flex flex-col items-center gap-1.5"
      >
        <span className="font-serif tracking-[0.4em] text-sm uppercase text-[#1A1514] font-medium">
          A V O R O N I
        </span>
        <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-[#1A1514]/60">
          Haute Saree Maison &bull; Heritage Weaves
        </span>
      </div>
    </div>
  );
}
