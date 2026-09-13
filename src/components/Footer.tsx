"use client";

import BrandLogo from "./BrandLogo";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export default function Footer() {
  const { language, t } = useLanguage();
  const { content, getLocalized } = useContent();
  const footerData = content?.footer;

  return (
    <footer
      className="relative w-full bg-[#1A1514] text-[#F5F0E8] pt-24 pb-12 px-6 sm:px-10 md:px-16 overflow-hidden select-none"
      aria-label="Avoroni Footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Top Header: Brand Identity & Maison Heritage Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[#F5F0E8]/10">
          <div className="flex flex-col gap-4">
            <div className="block md:hidden">
              <BrandLogo size={46} variant="light" />
            </div>
            <div className="hidden md:block">
              <BrandLogo size={66} variant="light" />
            </div>
            <p className="font-serif text-xl sm:text-2xl text-[#F5F0E8]/85 italic max-w-lg font-light leading-relaxed">
              {getLocalized(footerData?.quote, language) || t("footer_quote")}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-[9.5px] tracking-[0.25em] uppercase font-sans text-[#F5F0E8]/60">
            <span>{getLocalized(footerData?.registerText, language) || t("footer_register")}</span>
            <span className="text-[#B89A62]">{getLocalized(footerData?.certText, language) || t("footer_cert")}</span>
          </div>
        </div>

        {/* 4-Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-xs font-sans">
          {/* Col 1 */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A62] font-medium">
              {language === "bn" ? "নেভিগেশন" : "Navigation"}
            </span>
            <ul className="flex flex-col gap-2 text-[#F5F0E8]/70 font-light">
              <li>
                <a href="#culture" className="hover:text-[#F5F0E8] transition-colors">
                  {t("nav_home")}
                </a>
              </li>
              <li>
                <a href="#new-arrivals" className="hover:text-[#F5F0E8] transition-colors">
                  {t("nav_new_arrivals")}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F5F0E8] transition-colors">
                  {t("nav_categories")}
                </a>
              </li>
              <li>
                <a href="#shop-by-color" className="hover:text-[#F5F0E8] transition-colors">
                  {t("nav_shop_by_color")}
                </a>
              </li>
              <li>
                <a href="#best-seller" className="hover:text-[#F5F0E8] transition-colors">
                  {t("nav_best_seller")}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F5F0E8] transition-colors">
                  {t("nav_contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A62] font-medium">
              {language === "bn" ? "ঐতিহ্যবাহী বুনন" : "Heirloom Weaves"}
            </span>
            <ul className="flex flex-col gap-2 text-[#F5F0E8]/70 font-light">
              <li>
                <a href="#categories" className="hover:text-[#F5F0E8] transition-colors">
                  {language === "bn" ? "ঢাকাই জামদানি" : "Dhakai Jamdani"}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F5F0E8] transition-colors">
                  {language === "bn" ? "রাজশাহী সিল্ক" : "Rajshahi Mulberry Silk"}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F5F0E8] transition-colors">
                  {language === "bn" ? "মিরপুর বিয়ের কাতান" : "Mirpur Bridal Katan"}
                </a>
              </li>
              <li>
                <a href="#shop-by-color" className="hover:text-[#F5F0E8] transition-colors">
                  {language === "bn" ? "টাঙ্গাইল তাঁত সিল্ক" : "Tangail Handloom Silk"}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F5F0E8] transition-colors">
                  {language === "bn" ? "ব্রাইডাল ট্রাউসো" : "Bespoke Bridal Drape"}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A62] font-medium">
              {language === "bn" ? "ঢাকা ফ্ল্যাগশিপ" : "Dhaka Flagship"}
            </span>
            <div className="flex flex-col gap-2 text-[#F5F0E8]/70 font-light leading-relaxed">
              <strong className="font-normal text-[#F5F0E8]">
                {language === "bn" ? "আভরণী স্টুডিও বনানী" : "Avoroni Banani Studio"}
              </strong>
              <span>House 42, Road 11, Block D</span>
              <span>Banani, Dhaka-1213</span>
              <span>Tel: +880 1712-345678</span>
              <span className="pt-2 text-[10px] text-[#B89A62]">
                {language === "bn" ? "সোম – শনি: সকাল ১০টা – রাত ৮টা" : "Mon – Sat: 10am – 8pm BST"}
              </span>
            </div>
          </div>

          {/* Col 4: Gazette */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B89A62] font-medium">
              {t("footer_gazette_title")}
            </span>
            <p className="text-[11px] text-[#F5F0E8]/60 font-light leading-relaxed">
              {t("footer_gazette_desc")}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  language === "bn"
                    ? "আভরণী বার্তায় সাবস্ক্রাইব করার জন্য ধন্যবাদ।"
                    : "Thank you for subscribing to the Avoroni Gazette."
                );
              }}
              className="flex flex-col gap-2 pt-1"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-[#F5F0E8]/20 py-2 text-xs font-sans text-[#F5F0E8] placeholder:text-[#F5F0E8]/35 focus:border-[#B89A62] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="self-start text-[9.5px] tracking-[0.2em] uppercase text-[#B89A62] font-medium py-1 hover:underline cursor-pointer"
              >
                {t("footer_gazette_sub")} &rarr;
              </button>
            </form>
          </div>
        </div>

        {/* Historic Dhaka Architectural Heritage Graphic (Ahsan Manzil & Lalbagh Silhouette) */}
        <div className="flex flex-col items-center pt-8 border-t border-[#F5F0E8]/10">
          <div className="w-full max-w-3xl opacity-25 hover:opacity-40 transition-opacity duration-500 flex justify-center">
            <svg
              viewBox="0 0 800 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto text-[#EDE3D5]"
            >
              {/* Ground base line */}
              <line x1="0" y1="115" x2="800" y2="115" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              
              {/* Left Lalbagh Fort gateway arches and battlements */}
              <path d="M50 115V80H70V115M70 80C70 70 85 70 85 80V115M85 80H105V115" stroke="currentColor" strokeWidth="1" />
              <rect x="120" y="65" width="28" height="50" stroke="currentColor" strokeWidth="1" />
              <path d="M134 45L120 65H148L134 45Z" stroke="currentColor" strokeWidth="1" />
              <path d="M170 115V75C170 65 188 65 188 75V115" stroke="currentColor" strokeWidth="1" />

              {/* Central Iconic Ahsan Manzil Grand Dome & Colonaded Palace Facade */}
              {/* Left Wing Colonnade */}
              <rect x="290" y="65" width="60" height="50" stroke="currentColor" strokeWidth="1" />
              <path d="M300 115V80C300 75 310 75 310 80V115" stroke="currentColor" strokeWidth="0.8" />
              <path d="M320 115V80C320 75 330 75 330 80V115" stroke="currentColor" strokeWidth="0.8" />
              <path d="M340 115V80C340 75 350 75 350 80V115" stroke="currentColor" strokeWidth="0.8" />

              {/* Center Grand Pediment & Majestic Dome */}
              <rect x="350" y="50" width="100" height="65" stroke="currentColor" strokeWidth="1.2" />
              {/* Grand Central Stairs */}
              <path d="M370 115L380 90H420L430 115" stroke="currentColor" strokeWidth="1" />
              <path d="M388 90V68C388 62 412 62 412 68V90" stroke="currentColor" strokeWidth="1.2" />
              {/* Classical Triangular Pediment */}
              <path d="M365 50L400 32L435 50Z" stroke="currentColor" strokeWidth="1.2" />
              {/* The Iconic Ahsan Manzil Octagonal Drum & Grand Dome */}
              <rect x="382" y="24" width="36" height="8" stroke="currentColor" strokeWidth="1.2" />
              <path d="M380 24C380 8 400 3 400 3C400 3 420 8 420 24" stroke="currentColor" strokeWidth="1.2" />
              <line x1="400" y1="3" x2="400" y2="0" stroke="currentColor" strokeWidth="1.5" />

              {/* Right Wing Colonnade */}
              <rect x="450" y="65" width="60" height="50" stroke="currentColor" strokeWidth="1" />
              <path d="M460 115V80C460 75 470 75 470 80V115" stroke="currentColor" strokeWidth="0.8" />
              <path d="M480 115V80C480 75 490 75 490 80V115" stroke="currentColor" strokeWidth="0.8" />
              <path d="M500 115V80C500 75 510 75 510 80V115" stroke="currentColor" strokeWidth="0.8" />

              {/* Right Lalbagh & Curzon Hall Minarets */}
              <path d="M625 115V75C625 65 642 65 642 75V115" stroke="currentColor" strokeWidth="1" />
              <rect x="660" y="65" width="28" height="50" stroke="currentColor" strokeWidth="1" />
              <path d="M674 45L660 65H688L674 45Z" stroke="currentColor" strokeWidth="1" />
              <path d="M710 115V80H730V115M730 80C730 70 745 70 745 80V115" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* City Stamp */}
          <span className="font-serif text-xl sm:text-2xl tracking-[0.55em] uppercase text-[#F5F0E8]/50 pt-3">
            {t("footer_city")}
          </span>
        </div>

        {/* Bottom Copyright & Bangladesh Trust Badges */}
        <div className="border-t border-[#F5F0E8]/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-[9px] tracking-[0.25em] uppercase text-[#F5F0E8]/40 gap-4">
          <span>&copy; {new Date().getFullYear()} {t("footer_copy")}</span>
          <div className="flex items-center gap-6">
            <span>{t("footer_trust_1")}</span>
            <span>{t("footer_trust_2")}</span>
            <span>{t("footer_trust_3")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
