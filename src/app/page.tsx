"use client";

import { useState } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { ContentProvider } from "@/context/ContentContext";
import { StudioProvider } from "@/context/StudioContext";
import { OrderModalProvider } from "@/context/OrderModalContext";
import QuickOrderModal from "@/components/QuickOrderModal";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MaisonTrustBar from "@/components/MaisonTrustBar";
import NewArrivals from "@/components/NewArrivals";
import SareesByOrigin from "@/components/SareesByOrigin";
import HeritageLifestyle from "@/components/HeritageLifestyle";
import ShopByColor from "@/components/ShopByColor";
import BestSellers from "@/components/BestSellers";
import ClientAccolades from "@/components/ClientAccolades";
import ContactIntro from "@/components/ContactIntro";
import Footer from "@/components/Footer";
import ProductChatbot from "@/components/ProductChatbot";
import VirtualStudioModal from "@/components/VirtualStudioModal";
import MobileStickyBar from "@/components/MobileStickyBar";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <LanguageProvider>
      <ContentProvider>
        <StudioProvider>
          <OrderModalProvider>
            <SmoothScroll>
              {/* 01 — Preloader with Avoroni Logo & Transition */}
              <Preloader onComplete={() => setPreloaderDone(true)} />

              {/* 02 — Global Navigation, Language Switcher [EN | বাংলা] & Mobile Drawer */}
              <Navbar />

              <main className="relative flex flex-col w-full bg-[#F5F0E8] overflow-hidden">
                {/* 03 — Hero / CULTURE */}
                <Hero startAnimation={preloaderDone} />

                {/* 04 — Maison Assurance & Craft Guarantees Ribbon */}
                <MaisonTrustBar />

                {/* 05 — New Arrivals: Fresh Weaves, Timeless Grace (with ৳ BDT & 1-Click Order) */}
                <NewArrivals />

                {/* 06 — Sarees By Origin: Dhakai Jamdani, Rajshahi Silk, Mirpur Katan */}
                <SareesByOrigin />

                {/* 07 — Lifestyle & Accessories: Heritage Jewelry, Clutches, Unstitched Suits, Pashminas */}
                <HeritageLifestyle />

                {/* 08 — Shop By Color: Red, Green, Yellow, Blue, Pink, Purple */}
                <ShopByColor />

                {/* 09 — Best Sellers: The Most Loved, 4 Arched Cards (with ৳ BDT & 1-Click Order) */}
                <BestSellers />

                {/* 10 — Patrons & Bridal Acclaim: High-Society Reviews & Verified Testimonials */}
                <ClientAccolades />

                {/* 11 — Contact & Atelier: Banani Dhaka Studio & Message Form */}
                <ContactIntro />

                {/* 12 — Maison Footer: Historic Dhaka Ahsan Manzil Skyline Silhouette */}
                <Footer />
              </main>

              {/* 13 — Interactive Virtual Trial Studio Modal (Live Camera & Photo Fit) */}
              <VirtualStudioModal />

              {/* 14 — Saree FAQ & Products Concierge Chatbot */}
              <ProductChatbot />

              {/* 15 — Mobile Sticky VIP Concierge & Studio Action Bar */}
              <MobileStickyBar />

              {/* 16 — 1-Click Cash on Delivery / Quick Order Modal */}
              <QuickOrderModal />
            </SmoothScroll>
          </OrderModalProvider>
        </StudioProvider>
      </ContentProvider>
    </LanguageProvider>
  );
}

