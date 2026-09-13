"use client";

import Image from "next/image";

interface BrandLogoProps {
  size?: number;
  className?: string;
  variant?: "dark" | "light" | "gold";
  showText?: boolean;
}

export default function BrandLogo({
  size = 48,
  className = "",
  variant = "dark",
  showText = false,
}: BrandLogoProps) {
  // Avoroni logo aspect ratio is 890 / 619 = ~1.44
  const width = Math.round(size * 1.44);
  const height = size;

  const imgSrc =
    variant === "light"
      ? "/images/avoroni_logo_white.png"
      : variant === "gold"
      ? "/images/avoroni_logo_gold.png"
      : "/images/avoroni_logo_dark.png";

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${className}`}
      aria-label="Avoroni - Elegant Attire Logo"
    >
      <div
        className="relative transition-transform duration-300 hover:scale-105"
        style={{ width, height }}
      >
        <Image
          src={imgSrc}
          alt="Avoroni Elegant Attire Logo"
          fill
          priority
          sizes="(max-width: 768px) 160px, 240px"
          className="object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif tracking-[0.35em] text-xs uppercase font-semibold leading-tight ${
              variant === "light" ? "text-[#F5F0E8]" : "text-[#1A1514]"
            }`}
          >
            AVORONI
          </span>
          <span
            className={`text-[8px] tracking-[0.25em] uppercase font-sans ${
              variant === "light" ? "text-[#F5F0E8]/70" : "text-[#1A1514]/60"
            }`}
          >
            Haute Maison
          </span>
        </div>
      )}
    </div>
  );
}
