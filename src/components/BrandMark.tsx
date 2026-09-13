"use client";

import Image from "next/image";

interface BrandMarkProps {
  size?: number;
  className?: string;
  variant?: "dark" | "light" | "gold";
}

export default function BrandMark({
  size = 40,
  className = "",
  variant = "dark",
}: BrandMarkProps) {
  const imgSrc =
    variant === "light"
      ? "/images/avoroni_crest_white.png"
      : variant === "gold"
      ? "/images/avoroni_crest_gold.png"
      : "/images/avoroni_crest_dark.png";

  // Crest aspect ratio is 455 / 319 = ~1.42
  const width = Math.round(size * 1.42);
  const height = size;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
      aria-label="Avoroni Atelier Crest"
    >
      <div className="relative w-full h-full transition-transform duration-300 hover:scale-105">
        <Image
          src={imgSrc}
          alt="Avoroni Crest"
          fill
          priority
          sizes="80px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
