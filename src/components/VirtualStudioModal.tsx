"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useStudio, TrialItem } from "@/context/StudioContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import { useOrderModal } from "@/context/OrderModalContext";

// Curated Wardrobe Items referencing authentic editorial assets
const WARDROBE_ITEMS: TrialItem[] = [
  // 1. Sarees (Authentic editorial colorways & master weaves)
  {
    id: "v-saree-1",
    name: { en: "Dhakai Crimson Jamdani", bn: "ঢাকাই লাল জামদানি" },
    category: "saree",
    image: "/images/colorways/jamdani_red.jpg",
    price: { en: "৳ 9,800", bn: "৳ ৯,৮০০" },
  },
  {
    id: "v-saree-2",
    name: { en: "Mirpur Bridal Surya Katan", bn: "মিরপুর ব্রাইডাল লাল কাতান" },
    category: "saree",
    image: "/images/colorways/mirpur_red.jpg",
    price: { en: "৳ 12,500", bn: "৳ ১২,৫০০" },
  },
  {
    id: "v-saree-3",
    name: { en: "Shitalakshya Ivory Jamdani", bn: "শীতলক্ষ্যা শুভ্র আইভরি জামদানি" },
    category: "saree",
    image: "/images/colorways/jamdani_white.jpg",
    price: { en: "৳ 9,500", bn: "৳ ৯,৫০০" },
  },
  {
    id: "v-saree-4",
    name: { en: "Rajshahi Midnight Mulberry Silk", bn: "রাজশাহী নীল রেশম সিল্ক" },
    category: "saree",
    image: "/images/colorways/rajshahi_blue.jpg",
    price: { en: "৳ 8,400", bn: "৳ ৮,৪০০" },
  },
  {
    id: "v-saree-5",
    name: { en: "Kashi Brocade Royal Banarasi", bn: "কাশী রয়াল বেনারসি সিল্ক" },
    category: "saree",
    image: "/images/colorways/banaras_red.jpg",
    price: { en: "৳ 14,500", bn: "৳ ১৪,৫০০" },
  },
  {
    id: "v-saree-6",
    name: { en: "Kanchipuram Peacock Korvai Silk", bn: "কাঞ্জিভরম ময়ূরকণ্ঠী সবুজ করভাই" },
    category: "saree",
    image: "/images/colorways/kanchipuram_green.jpg",
    price: { en: "৳ 16,500", bn: "৳ ১৬,৫০০" },
  },
  {
    id: "v-saree-7",
    name: { en: "Haldi Basanti Tangail Silk", bn: "বাসন্তী হলুদ টাঙ্গাইল সিল্ক" },
    category: "saree",
    image: "/images/colorways/tangail_yellow.jpg",
    price: { en: "৳ 4,500", bn: "৳ ৪,৫০০" },
  },
  {
    id: "v-saree-8",
    name: { en: "Chanderi Ruby Sheer Tissue", bn: "চান্দেরি রুবি শিয়ার টিস্যু" },
    category: "saree",
    image: "/images/colorways/chanderi_red.jpg",
    price: { en: "৳ 7,900", bn: "৳ ৭,৯০০" },
  },
  {
    id: "v-saree-9",
    name: { en: "Emerald Noor Jamdani", bn: "পান্না সবুজ ঢাকাই জামদানি" },
    category: "saree",
    image: "/images/colorways/jamdani_green.jpg",
    price: { en: "৳ 9,200", bn: "৳ ৯,২০০" },
  },
  {
    id: "v-saree-10",
    name: { en: "Royal Jamuni Bridal Katan", bn: "গাঢ় জামুনি জরি কাতান" },
    category: "saree",
    image: "/images/colorways/mirpur_purple.jpg",
    price: { en: "৳ 12,800", bn: "৳ ১২,৮০০" },
  },

  // 2. Royal Heritage Jewelry (Authentic editorial jewelry crops)
  {
    id: "v-jewel-1",
    name: { en: "Royal Jadau Kundan Choker", bn: "রাজকীয় কুন্দন চোকার ও কানপাশা" },
    category: "jewelry",
    image: "/images/lifestyle/jewel_kundan_choker.jpg",
    price: { en: "৳ 8,500", bn: "৳ ৮,৫০০" },
  },
  {
    id: "v-jewel-2",
    name: { en: "Imperial Polki Jhumka", bn: "অ্যান্টিক পোলকি ঝুমকা সেট" },
    category: "jewelry",
    image: "/images/lifestyle/jewel_chandbali_jhumka.jpg",
    price: { en: "৳ 4,200", bn: "৳ ৪,২০০" },
  },
  {
    id: "v-jewel-3",
    name: { en: "Mughal Royal Chandrahaar", bn: "মোগল চন্দ্রহার ও সীতাহার" },
    category: "jewelry",
    image: "/images/lifestyle/jewel_chandrahaar_pendant.jpg",
    price: { en: "৳ 12,500", bn: "৳ ১২,৫০০" },
  },

  // 3. Royal Clutches & Potlis
  {
    id: "v-clutch-1",
    name: { en: "Royal Zardozi Velvet Potli", bn: "জারদৌসি ভেলভেট বটুয়া" },
    category: "clutch",
    image: "/images/lifestyle/potli_zardozi_velvet.jpg",
    price: { en: "৳ 2,800", bn: "৳ ২,৮০০" },
  },
  {
    id: "v-clutch-2",
    name: { en: "Pearl Handcrafted Box Clutch", bn: "মুক্তার ব্রাইডাল বক্স ক্লাচ" },
    category: "clutch",
    image: "/images/lifestyle/clutch_pearl_minaudiere.jpg",
    price: { en: "৳ 3,600", bn: "৳ ৩,৬০০" },
  },

  // 4. Kashmiri Shawls
  {
    id: "v-shawl-1",
    name: { en: "Authentic Kashmiri Pashmina", bn: "খাঁটি কাশ্মীরি পশমিনা শাল" },
    category: "shawl",
    image: "/images/lifestyle/shawl_kashmiri_pashmina.jpg",
    price: { en: "৳ 14,500", bn: "৳ ১৪,৫০০" },
  },
  {
    id: "v-shawl-2",
    name: { en: "Royal Antique Jamawar Shawl", bn: "মহারানী জামাওয়ার উলেন শাল" },
    category: "shawl",
    image: "/images/lifestyle/shawl_jamawar_velvet.jpg",
    price: { en: "৳ 18,500", bn: "৳ ১৮,৫০০" },
  },
];

// Transparent Saree Drape Mapping for Real-time Overlay & Backend Try-on
const SAREE_DRAPE_MAP: Record<string, string> = {
  "v-saree-1": "/images/trial/drape_jamdani_red.png",
  "v-saree-2": "/images/trial/drape_mirpur_red.png",
  "v-saree-3": "/images/trial/drape_jamdani_white.png",
  "v-saree-4": "/images/trial/drape_rajshahi_blue.png",
  "v-saree-5": "/images/trial/drape_banaras_red.png",
  "v-saree-6": "/images/trial/drape_kanchipuram_green.png",
  "v-saree-7": "/images/trial/drape_tangail_yellow.png",
  "v-saree-8": "/images/trial/drape_chanderi_red.png",
  "v-saree-9": "/images/trial/drape_jamdani_green.png",
  "v-saree-10": "/images/trial/drape_mirpur_purple.png",
};

type SourceMode = "camera" | "upload" | "model";
type CategoryFilter = "all" | "saree" | "jewelry" | "clutch" | "shawl";

export default function VirtualStudioModal() {
  const { isStudioOpen, closeStudio, activeItem } = useStudio();
  const { language } = useLanguage();
  const { content, getLocalized } = useContent();
  const { openOrderModal } = useOrderModal();

  // Source & Product Selection
  const [sourceMode, setSourceMode] = useState<SourceMode>("model");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedProduct, setSelectedProduct] = useState<TrialItem>(
    activeItem || WARDROBE_ITEMS[0]
  );

  // Photos State
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [flashTrigger, setFlashTrigger] = useState(false);

  // Interactive Fit Adjuster State
  const [fitScale, setFitScale] = useState<number>(1.25);
  const [fitOffsetX, setFitOffsetX] = useState<number>(0);
  const [fitOffsetY, setFitOffsetY] = useState<number>(60);
  const [showFitToolbar, setShowFitToolbar] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  // AI Try-On Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [aiResultImage, setAiResultImage] = useState<string | null>(null);
  const [aiEngineUsed, setAiEngineUsed] = useState<string>("");
  const [aiStylingTip, setAiStylingTip] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync activeItem if passed into context
  useEffect(() => {
    if (activeItem) {
      const match = WARDROBE_ITEMS.find(
        (w) => w.id === activeItem.id || w.name.en === activeItem.name.en
      );
      if (match) {
        setSelectedProduct(match);
      } else {
        setSelectedProduct(activeItem);
      }
      // Reset previous AI result for fresh try-on with new product
      setAiResultImage(null);
      setAiEngineUsed("");
      setAiStylingTip("");
    }
  }, [activeItem]);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraStreamActive(false);
  }, []);

  // Start Camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError("");
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("mediaDevices not supported");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCameraStreamActive(true);
    } catch (err: any) {
      console.warn("Camera device access not available:", err?.name, err?.message);
      const isNotFound =
        err?.name === "NotFoundError" ||
        err?.name === "DevicesNotFoundError" ||
        String(err?.message || "").toLowerCase().includes("not found");
      const isDenied =
        err?.name === "NotAllowedError" ||
        err?.name === "PermissionDeniedError";

      setCameraError(
        isNotFound
          ? (language === "bn"
              ? "আপনার ডিভাইসে কোনো ক্যামেরা বা ওয়েবক্যাম সংযুক্ত পাওয়া যায়নি। অনুগ্রহ করে ছবি আপলোড করুন অথবা ডেমো মডেল ব্যবহার করুন।"
              : "No camera device detected on this system. Please upload a photo or use the demo model.")
          : isDenied
          ? (language === "bn"
              ? "ক্যামেরা পারমিশন পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারে পারমিশন এলাও করুন অথবা ছবি আপলোড করুন।"
              : "Camera permission denied. Please allow camera access in your browser or upload a photo.")
          : (language === "bn"
              ? "ক্যামেরা চালু করা সম্ভব হয়নি। অনুগ্রহ করে ছবি আপলোড করুন।"
              : "Camera unavailable. Please upload a portrait photo instead.")
      );
    }
  }, [stopCamera, language]);

  // Manage Camera on Mode Change / Studio Visibility
  useEffect(() => {
    if (isStudioOpen && sourceMode === "camera" && !capturedSnapshot) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isStudioOpen, sourceMode, capturedSnapshot, startCamera, stopCamera]);

  // Instant 3:4 Portrait Snapshot from Live Camera (Eliminates Letterboxing & Face Shrinking)
  const handleSnapInstantPhoto = () => {
    if (!videoRef.current || !captureCanvasRef.current) return;
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;
    const targetAspect = 3 / 4; // 0.75 portrait aspect ratio

    let sWidth = vWidth;
    let sHeight = vHeight;
    let sx = 0;
    let sy = 0;

    if (vWidth / vHeight > targetAspect) {
      // Landscape video -> crop center 3:4 horizontally
      sWidth = Math.round(vHeight * targetAspect);
      sx = Math.round((vWidth - sWidth) / 2);
    } else {
      // Taller video -> crop center 3:4 vertically
      sHeight = Math.round(vWidth / targetAspect);
      sy = Math.round((vHeight - sHeight) / 2);
    }

    // Set canvas dimensions to clean 896x1200 portrait (3:4)
    canvas.width = 896;
    canvas.height = 1200;

    // Flip horizontally for natural mirror selfie perspective
    ctx.save();
    ctx.translate(896, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, 896, 1200);
    ctx.restore();

    // Trigger visual shutter flash
    setFlashTrigger(true);
    setTimeout(() => setFlashTrigger(false), 280);

    const snapshotDataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedSnapshot(snapshotDataUrl);
    stopCamera();
  };

  // Retake Photo
  const handleRetakePhoto = () => {
    setCapturedSnapshot(null);
    setAiResultImage(null);
    setAiEngineUsed("");
    setAiStylingTip("");
    startCamera();
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setUploadedPhoto(event.target.result);
        setSourceMode("upload");
        setAiResultImage(null);
        setAiEngineUsed("");
        setAiStylingTip("");
        // Default smart fit for selfie/portrait
        setFitScale(1.35);
        setFitOffsetY(80);
        setFitOffsetX(0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag handlers for direct interactive repositioning of the saree drape
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: fitOffsetX,
      initY: fitOffsetY,
    };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setFitOffsetX(Math.round(dragStartRef.current.initX + dx));
    setFitOffsetY(Math.round(dragStartRef.current.initY + dy));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Quick Preset Handlers
  const applyFitPreset = (preset: "selfie" | "half" | "full" | "reset") => {
    if (preset === "selfie") {
      setFitScale(1.55);
      setFitOffsetY(130);
      setFitOffsetX(0);
    } else if (preset === "half") {
      setFitScale(1.15);
      setFitOffsetY(35);
      setFitOffsetX(0);
    } else if (preset === "full") {
      setFitScale(0.88);
      setFitOffsetY(-30);
      setFitOffsetX(0);
    } else {
      setFitScale(1.0);
      setFitOffsetY(0);
      setFitOffsetX(0);
    }
  };

  // Resolve current transparent drape
  const currentDrape =
    selectedProduct.category === "saree"
      ? SAREE_DRAPE_MAP[selectedProduct.id] || "/images/trial/drape_jamdani_red.png"
      : null;

  // Determine Current User Portrait Image
  const getActiveUserImage = useCallback((): string => {
    if (sourceMode === "camera" && capturedSnapshot) {
      return capturedSnapshot;
    }
    if (sourceMode === "upload" && uploadedPhoto) {
      return uploadedPhoto;
    }
    // For demo model mode, return the selected product look or default model
    return selectedProduct.image || "/images/colorways/jamdani_red.jpg";
  }, [sourceMode, capturedSnapshot, uploadedPhoto, selectedProduct]);

  // Execute AI Virtual Try-On Generation
  const handleGenerateAiTryOn = async () => {
    setErrorMessage("");

    // If in upload mode but no photo uploaded yet, trigger file picker
    if (sourceMode === "upload" && !uploadedPhoto) {
      fileInputRef.current?.click();
      return;
    }

    // If in live camera mode but hasn't snapped yet, snap first
    if (sourceMode === "camera" && !capturedSnapshot && videoRef.current) {
      handleSnapInstantPhoto();
      return;
    }

    const userImg = getActiveUserImage();
    setIsGenerating(true);
    setGenerationStep(1);

    // Dynamic steps simulation for high-end luxury feel
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 600);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 1200);

    try {
      const res = await fetch("/api/ai/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: userImg,
          sourceMode,
          product: {
            id: selectedProduct.id,
            name: selectedProduct.name,
            image: selectedProduct.image,
            overlayImage: selectedProduct.overlayImage,
            category: selectedProduct.category,
            price: selectedProduct.price,
          },
          customFit: {
            scale: fitScale,
            offsetX: fitOffsetX,
            offsetY: fitOffsetY,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "AI generation failed");
      }

      setAiResultImage(data.resultImage);
      if (data.engine) setAiEngineUsed(data.engine);
      if (data.stylingTip) setAiStylingTip(data.stylingTip);
    } catch (err: any) {
      console.error("Try-on generation error:", err);
      setErrorMessage(
        language === "bn"
          ? "ট্রায়াল তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Failed to generate virtual try-on. Please try again."
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  // Download Generated Look
  const handleDownloadLook = () => {
    if (!aiResultImage) return;
    const link = document.createElement("a");
    link.download = `Avoroni_AI_Look_${selectedProduct.id}_${Date.now()}.jpg`;
    link.href = aiResultImage;
    link.click();
  };

  // Order via WhatsApp
  const handleOrderWhatsApp = () => {
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const prodName = getLocalized(selectedProduct.name, language);
    const prodPrice = getLocalized(selectedProduct.price, language);
    const msg =
      language === "bn"
        ? `আসসালামু আলাইকুম! আমি আভরণী এআই ভার্চুয়াল স্টুডিওতে "${prodName}" ট্রায়াল দিয়েছি। মূল্য: ${prodPrice}। আমি এটি সরাসরি অর্ডার করতে চাচ্ছি!`
        : `Hello! I generated an AI Virtual Try-On for "${prodName}" (Price: ${prodPrice}) at Avoroni Atelier. I would like to order this piece!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Reusable User Fitting Canvas with Interactive Drape Overlay & Floating Controls
  const renderUserFittingCanvas = (photoSrc: string, isCameraSnapshot: boolean) => (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none">
      {/* 1. Base User Portrait */}
      <div className="relative w-full h-full">
        <Image
          src={photoSrc}
          alt="User Portrait"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-contain"
          priority
        />
      </div>

      {/* 2. Interactive Saree Drape Overlay */}
      {currentDrape && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute inset-0 z-10 flex items-center justify-center ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          title={
            language === "bn"
              ? "ড্র্যাগ করে শাড়ির অবস্থান পরিবর্তন করুন"
              : "Drag to reposition saree drape"
          }
        >
          <div
            style={{
              transform: `translate(${fitOffsetX}px, ${fitOffsetY}px) scale(${fitScale})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.12s ease-out",
              width: "100%",
              height: "100%",
              position: "relative",
              pointerEvents: "none",
            }}
          >
            <Image
              src={currentDrape}
              alt="Saree Drape Preview"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>
        </div>
      )}

      {/* 3. Status Badge (Top-Left) */}
      <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/80 border border-[#B89A62]/40 backdrop-blur-md text-[11px] text-[#B89A62] flex items-center gap-1.5 shadow">
        <span>✓</span>
        <span>
          {isCameraSnapshot
            ? language === "bn"
              ? "ক্যামেরা ছবি প্রস্তুত"
              : "Camera Photo Ready"
            : language === "bn"
            ? "আপলোড ছবি প্রস্তুত"
            : "Uploaded Photo Ready"}
        </span>
      </div>

      {/* 4. Floating Drape Adjuster Toolbar (Top-Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2 max-w-[280px]">
        <button
          type="button"
          onClick={() => setShowFitToolbar(!showFitToolbar)}
          className="px-3 py-1.5 rounded-full bg-black/85 hover:bg-black text-[#F5F0E8] border border-[#B89A62]/50 backdrop-blur-md text-[11px] font-sans flex items-center gap-1.5 shadow-xl cursor-pointer transition-all"
        >
          <span>🎚️</span>
          <span>
            {language === "bn"
              ? showFitToolbar
                ? "টুলবার লুকান"
                : "সাইজ ও ফিটিং সমন্বয়"
              : showFitToolbar
              ? "Hide Controls"
              : "Adjust Drape Fit"}
          </span>
        </button>

        {showFitToolbar && (
          <div className="w-64 sm:w-72 p-3 rounded-2xl bg-black/92 border border-[#B89A62]/40 backdrop-blur-lg shadow-2xl text-[11px] flex flex-col gap-2.5 animate-fadeIn">
            {/* Quick Presets */}
            <div className="flex items-center justify-between gap-1 pb-2 border-b border-[#B89A62]/20">
              <button
                type="button"
                onClick={() => applyFitPreset("selfie")}
                className="px-2 py-1 rounded-lg bg-[#2A171A] hover:bg-[#3D1E23] text-[#F5F0E8] border border-[#B89A62]/30 text-[10px] cursor-pointer"
              >
                🤳 {language === "bn" ? "সেলফি" : "Selfie"}
              </button>
              <button
                type="button"
                onClick={() => applyFitPreset("half")}
                className="px-2 py-1 rounded-lg bg-[#2A171A] hover:bg-[#3D1E23] text-[#F5F0E8] border border-[#B89A62]/30 text-[10px] cursor-pointer"
              >
                👤 {language === "bn" ? "হাফ বডি" : "Half"}
              </button>
              <button
                type="button"
                onClick={() => applyFitPreset("full")}
                className="px-2 py-1 rounded-lg bg-[#2A171A] hover:bg-[#3D1E23] text-[#F5F0E8] border border-[#B89A62]/30 text-[10px] cursor-pointer"
              >
                🧍 {language === "bn" ? "ফুল বডি" : "Full"}
              </button>
              <button
                type="button"
                onClick={() => applyFitPreset("reset")}
                className="px-2 py-1 rounded-lg bg-[#1F1B1A] hover:bg-[#2B2524] text-[#B89A62] border border-[#B89A62]/20 text-[10px] cursor-pointer"
              >
                🔄 {language === "bn" ? "রিসেট" : "Reset"}
              </button>
            </div>

            {/* Precision Sliders */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-[#F5F0E8]/80">
                  <span>🔍 {language === "bn" ? "আকার / জুম" : "Drape Scale"}</span>
                  <span className="text-[#C5A869] font-mono font-semibold">{fitScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.4"
                  step="0.05"
                  value={fitScale}
                  onChange={(e) => setFitScale(parseFloat(e.target.value))}
                  className="w-full accent-[#B89A62] cursor-pointer h-1.5 bg-[#2A2422] rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-[#F5F0E8]/80">
                  <span>↕️ {language === "bn" ? "উচ্চতা (উপরে/নিচে)" : "Height (Y)"}</span>
                  <span className="text-[#C5A869] font-mono font-semibold">
                    {fitOffsetY > 0 ? `+${fitOffsetY}` : fitOffsetY}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={fitOffsetY}
                  onChange={(e) => setFitOffsetY(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B89A62] cursor-pointer h-1.5 bg-[#2A2422] rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-[#F5F0E8]/80">
                  <span>↔️ {language === "bn" ? "পাশাপাশি (ডানে/বায়ে)" : "Position (X)"}</span>
                  <span className="text-[#C5A869] font-mono font-semibold">
                    {fitOffsetX > 0 ? `+${fitOffsetX}` : fitOffsetX}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={fitOffsetX}
                  onChange={(e) => setFitOffsetX(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B89A62] cursor-pointer h-1.5 bg-[#2A2422] rounded-lg"
                />
              </div>
            </div>

            <p className="text-[9px] text-[#F5F0E8]/50 text-center italic">
              💡 {language === "bn" ? "শাড়িটি সরাসরি হাত দিয়ে ড্র্যাগ করেও বসাতে পারেন" : "You can also drag the drape directly with mouse or touch"}
            </p>
          </div>
        )}
      </div>

      {/* 5. Bottom Retake / Change Photo Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {isCameraSnapshot ? (
          <button
            onClick={handleRetakePhoto}
            className="px-4 py-2 rounded-full bg-black/80 hover:bg-black text-[#F5F0E8] border border-[#B89A62]/40 flex items-center gap-1.5 text-xs cursor-pointer shadow transition-all hover:scale-105"
          >
            <span>🔄</span>
            <span>{language === "bn" ? "পুনরায় ছবি তুলুন" : "Retake Photo"}</span>
          </button>
        ) : (
          <label className="px-4 py-2 rounded-full bg-black/80 hover:bg-black text-[#F5F0E8] border border-[#B89A62]/40 flex items-center gap-1.5 text-xs cursor-pointer shadow transition-all hover:scale-105">
            <span>📁</span>
            <span>{language === "bn" ? "অন্য ছবি আপলোড" : "Change Photo"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );

  if (!isStudioOpen) return null;

  const filteredWardrobe = WARDROBE_ITEMS.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      {/* Hidden Offscreen Canvas for Snapshot Capture */}
      <canvas ref={captureCanvasRef} className="hidden" />

      {/* Main Atelier Studio Modal Frame */}
      <div className="relative w-full max-w-5xl h-[94vh] max-h-[860px] bg-[#14100F] border border-[#B89A62]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-[#F5F0E8]">
        {/* Close Button */}
        <button
          onClick={closeStudio}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-[#F5F0E8] border border-[#B89A62]/40 flex items-center justify-center text-sm transition-all cursor-pointer shadow-lg hover:scale-105"
          title={language === "bn" ? "স্টুডিও বন্ধ করুন" : "Close Studio"}
        >
          ✕
        </button>

        {/* LEFT COLUMN: THE PHOTOREALISTIC AI MIRROR VIEW */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 relative bg-gradient-to-b from-[#1C1716] to-[#120E0D] border-b md:border-b-0 md:border-r border-[#B89A62]/20">
          {/* Studio Header & Source Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B89A62] animate-pulse" />
              <span className="font-serif text-sm sm:text-base tracking-wider text-[#F5F0E8]">
                {language === "bn"
                  ? "আভরণী এআই ভার্চুয়াল স্টুডিও"
                  : "Avoroni AI Virtual Fitting Atelier"}
              </span>
            </div>

            {/* Source Switcher */}
            <div className="flex items-center bg-[#0D0A0A] p-1 rounded-full border border-[#B89A62]/30 text-[10px] sm:text-xs">
              <button
                onClick={() => {
                  setSourceMode("camera");
                  setCapturedSnapshot(null);
                  setAiResultImage(null);
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  sourceMode === "camera"
                    ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                    : "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
                }`}
              >
                <span>📸</span>
                <span>{language === "bn" ? "লাইভ ক্যামেরা" : "Live Camera"}</span>
              </button>

              <label
                className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  sourceMode === "upload"
                    ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                    : "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
                }`}
              >
                <span>📁</span>
                <span>{language === "bn" ? "ছবি আপলোড" : "Upload Photo"}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => {
                  setSourceMode("model");
                  setAiResultImage(null);
                  stopCamera();
                }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                  sourceMode === "model"
                    ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                    : "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
                }`}
              >
                <span>👤</span>
                <span>{language === "bn" ? "ডেমো মডেল" : "Demo Model"}</span>
              </button>
            </div>
          </div>

          {/* Camera Access Error Alert */}
          {cameraError && sourceMode === "camera" && (
            <div className="mb-2 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 text-center">
              {cameraError}
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-2 p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-300 text-center">
              {errorMessage}
            </div>
          )}

          {/* CENTER VIEWPORT: CAMERA / PHOTO / AI GENERATED RESULT */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border-2 border-[#B89A62]/40 shadow-inner flex items-center justify-center bg-black">
            {/* Shutter Flash Animation */}
            {flashTrigger && (
              <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-ping duration-300 opacity-80" />
            )}

            {/* SCENARIO A: AI RESULT GENERATED (THE WOW SCREEN) */}
            {aiResultImage && (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <div className="relative w-full h-full">
                  <Image
                    src={isComparing ? getActiveUserImage() : aiResultImage}
                    alt="AI Virtual Try-On"
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Compare Button Floating Over Result */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <button
                    type="button"
                    onMouseDown={() => setIsComparing(true)}
                    onMouseUp={() => setIsComparing(false)}
                    onTouchStart={() => setIsComparing(true)}
                    onTouchEnd={() => setIsComparing(false)}
                    className="px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-sans border border-[#B89A62]/50 bg-black/75 hover:bg-black text-[#F5F0E8] backdrop-blur-md transition-all cursor-pointer shadow-lg"
                    title={
                      language === "bn"
                        ? "চেপে ধরে আসল ছবি দেখুন"
                        : "Hold to view original photo"
                    }
                  >
                    👁️{" "}
                    {isComparing
                      ? language === "bn"
                        ? "আসল ছবি"
                        : "Original"
                      : language === "bn"
                      ? "তুলনা করুন (Hold)"
                      : "Compare (Hold)"}
                  </button>
                </div>

                {/* AI Badge Overlay */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#6D1F2A]/90 border border-[#B89A62]/40 backdrop-blur-md text-[11px] text-[#F5F0E8] flex items-center gap-1.5 shadow">
                  <span className="text-xs">✨</span>
                  <span>
                    {aiEngineUsed
                      ? aiEngineUsed
                      : language === "bn"
                      ? "এআই ভার্চুয়াল লুক সম্পন্ন"
                      : "AI Try-On Ready"}
                  </span>
                </div>

                {/* Gemini Luxury Fashion Stylist Tip Box */}
                {aiStylingTip && (
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 border border-[#B89A62]/40 backdrop-blur-md text-xs text-[#F5F0E8] flex items-start gap-2.5 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-base text-amber-400 shrink-0">✨</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#B89A62] font-semibold">
                        {language === "bn" ? "অ্যাটেলিয়ার ফ্যাশন স্টাইলিস্ট" : "Haute Couture Stylist Tip"}
                      </span>
                      <p className="text-xs text-[#F5F0E8]/90 italic leading-relaxed">
                        {aiStylingTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENARIO B: LIVE CAMERA VIEW */}
            {!aiResultImage && sourceMode === "camera" && !capturedSnapshot && (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                {cameraError ? (
                  <div className="p-8 max-w-md text-center flex flex-col items-center justify-center gap-4 bg-[#171312] border border-[#B89A62]/30 rounded-2xl mx-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-serif text-lg text-[#F5F0E8]">
                        {language === "bn" ? "ক্যামেরা সংযোগ পাওয়া যায়নি" : "Camera Not Connected"}
                      </h4>
                      <p className="text-xs text-[#F5F0E8]/70 leading-relaxed">
                        {cameraError}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSourceMode("upload");
                          setTimeout(() => fileInputRef.current?.click(), 100);
                        }}
                        className="px-5 py-2.5 rounded-full bg-[#6D1F2A] hover:bg-[#852735] text-xs font-semibold text-white transition-colors cursor-pointer shadow flex items-center gap-1.5"
                      >
                        <span>📁</span>
                        <span>{language === "bn" ? "ছবি আপলোড করুন" : "Upload Photo"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSourceMode("model");
                          setCameraError("");
                        }}
                        className="px-5 py-2.5 rounded-full bg-[#1E1917] hover:bg-[#2A2321] text-xs font-medium text-[#B89A62] border border-[#B89A62]/30 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>👤</span>
                        <span>{language === "bn" ? "ডেমো মডেলে দেখুন" : "View on Demo Model"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover -scale-x-100"
                    />

                    {/* Luxury Silhouette / Face Framing Guide */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-52 h-72 rounded-[50%] border-2 border-dashed border-[#B89A62]/60 shadow-[0_0_30px_rgba(184,154,98,0.2)] flex flex-col items-center justify-center relative">
                        <span className="text-[10px] text-[#B89A62] uppercase tracking-widest bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-[#B89A62]/30">
                          {language === "bn" ? "মুখমন্ডল ফ্রেম করুন" : "Frame Your Face"}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#F5F0E8]/70 mt-3 bg-black/60 px-3 py-1 rounded-full border border-[#B89A62]/20">
                        {language === "bn"
                          ? "ক্যামেরার দিকে তাকিয়ে নিচের বাটনে চাপ দিন"
                          : "Look directly into camera & click button below"}
                      </span>
                    </div>

                    {/* Live Shutter Button Floating at Bottom */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                      <button
                        onClick={handleSnapInstantPhoto}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#6D1F2A] via-[#8B2635] to-[#6D1F2A] hover:brightness-110 text-[#F5F0E8] font-serif tracking-wider border-2 border-[#B89A62] flex items-center gap-2.5 shadow-[0_0_25px_rgba(184,154,98,0.4)] cursor-pointer transform hover:scale-105 active:scale-95 transition-all text-sm sm:text-base font-semibold"
                      >
                        <span className="text-lg">📸</span>
                        <span>
                          {language === "bn"
                            ? "তাৎক্ষণিক ছবি তুলুন"
                            : "Take Instant Photo"}
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* SCENARIO C: SNAPSHOT TAKEN FROM CAMERA */}
            {!aiResultImage &&
              sourceMode === "camera" &&
              capturedSnapshot &&
              renderUserFittingCanvas(capturedSnapshot, true)}

            {/* SCENARIO D: UPLOADED PHOTO */}
            {!aiResultImage &&
              sourceMode === "upload" &&
              (uploadedPhoto ? (
                renderUserFittingCanvas(uploadedPhoto, false)
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-[#B89A62]/40 rounded-2xl cursor-pointer hover:border-[#B89A62] transition-colors">
                  <span className="text-4xl">📁</span>
                  <span className="font-serif text-sm text-[#F5F0E8]">
                    {language === "bn"
                      ? "ফোন বা কম্পিউটার থেকে নিজের ছবি নির্বাচন করুন"
                      : "Choose your portrait from phone or PC"}
                  </span>
                  <span className="text-xs text-[#B89A62]">
                    {language === "bn"
                      ? "ক্লিক করুন বা ফাইল ড্র্যাগ করুন (JPG/PNG)"
                      : "Click to browse or drop file (JPG/PNG)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              ))}

            {/* SCENARIO E: DEMO MODEL PORTRAIT */}
            {!aiResultImage && sourceMode === "model" && (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <div className="relative w-full h-full">
                  <Image
                    src={selectedProduct.image}
                    alt={getLocalized(selectedProduct.name, language)}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 border border-[#B89A62]/40 backdrop-blur-md text-[11px] text-[#B89A62] flex items-center gap-1.5">
                  <span>👤</span>
                  <span>
                    {language === "bn" ? "আভরণী ডেমো মডেল" : "Avoroni Model"}
                  </span>
                </div>
              </div>
            )}

            {/* NEURAL AI GENERATION PROGRESS OVERLAY */}
            {isGenerating && (
              <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                {/* Neural Spinner */}
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#B89A62] border-r-transparent border-b-[#6D1F2A] border-l-transparent animate-spin" />
                  <div className="w-12 h-12 rounded-full bg-[#1A1514] border border-[#B89A62]/50 flex items-center justify-center text-xl">
                    ✨
                  </div>
                </div>

                <h3 className="font-serif text-lg sm:text-xl text-[#F5F0E8] mb-2 tracking-wide">
                  {language === "bn"
                    ? "এআই ভার্চুয়াল ট্রায়াল তৈরি হচ্ছে..."
                    : "Synthesizing AI Virtual Atelier Look..."}
                </h3>

                <div className="flex flex-col gap-2 max-w-sm text-xs text-[#F5F0E8]/70">
                  <p
                    className={`transition-all duration-300 ${
                      generationStep >= 1
                        ? "text-[#B89A62] font-semibold"
                        : "opacity-40"
                    }`}
                  >
                    🔍{" "}
                    {language === "bn"
                      ? "১. মুখের আকৃতি ও ত্বকের স্কিনটোন বিশ্লেষণ সম্পন্ন"
                      : "1. Analyzing facial geometry & skin tone"}
                  </p>
                  <p
                    className={`transition-all duration-300 ${
                      generationStep >= 2
                        ? "text-[#B89A62] font-semibold"
                        : "opacity-40"
                    }`}
                  >
                    🧵{" "}
                    {language === "bn"
                      ? "২. রাজকীয় তাঁতের টেক্সচার ও ড্র্যাপ সিন্থেসিস"
                      : "2. Heritage fabric drape & texture synthesis"}
                  </p>
                  <p
                    className={`transition-all duration-300 ${
                      generationStep >= 3
                        ? "text-[#B89A62] font-semibold"
                        : "opacity-40"
                    }`}
                  >
                    💎{" "}
                    {language === "bn"
                      ? "৩. স্টুডিও লাইটিং ও শ্যাডো রেন্ডারিং সম্পন্ন"
                      : "3. Studio editorial lighting & shadow harmonization"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM ATELIER ACTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-[#B89A62]/20 text-xs">
            {aiResultImage ? (
              // Actions when AI Result is Ready
              <div className="w-full flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setAiResultImage(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1E1917] hover:bg-[#28211E] text-[#B89A62] border border-[#B89A62]/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>🔄</span>
                  <span>
                    {language === "bn" ? "অন্য পোশাক ট্রায়াল" : "Try Another Piece"}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadLook}
                    className="px-4 py-2.5 rounded-xl bg-[#1E1917] hover:bg-[#28211E] text-[#F5F0E8] border border-[#B89A62]/30 flex items-center gap-1.5 cursor-pointer transition-colors shadow"
                  >
                    <span>💾</span>
                    <span>
                      {language === "bn" ? "লুক ডাউনলোড" : "Download HD Look"}
                    </span>
                  </button>

                  <button
                    onClick={handleOrderWhatsApp}
                    className="px-5 py-2.5 rounded-xl bg-[#6D1F2A] hover:bg-[#852735] text-[#F5F0E8] font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg hover:scale-105"
                  >
                    <span>💬</span>
                    <span>
                      {language === "bn"
                        ? "এই লুকে অর্ডার করুন"
                        : "Order This Look"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              // Actions before AI Result is Generated
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#F5F0E8]/60 hidden sm:inline">
                  {language === "bn"
                    ? "✨ এআই প্রযুক্তিতে আসল ফটোশুটের মতো রিয়েলিস্টিক ফিটিং"
                    : "✨ AI synthesized realistic editorial drape"}
                </span>

                <button
                  onClick={handleGenerateAiTryOn}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6D1F2A] via-[#852735] to-[#6D1F2A] hover:brightness-110 text-[#F5F0E8] font-serif tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(109,31,42,0.6)] border border-[#B89A62]/50 hover:scale-105"
                >
                  <span className="text-base">
                    {sourceMode === "upload" && !uploadedPhoto
                      ? "📁"
                      : sourceMode === "camera" && !capturedSnapshot
                      ? "📸"
                      : "✨"}
                  </span>
                  <span>
                    {sourceMode === "upload" && !uploadedPhoto
                      ? language === "bn"
                        ? "ছবি আপলোড করুন"
                        : "Upload Photo First"
                      : sourceMode === "camera" && !capturedSnapshot
                      ? language === "bn"
                        ? "তাৎক্ষণিক ছবি তুলুন"
                        : "Take Photo First"
                      : language === "bn"
                      ? "এআই ভার্চুয়াল ট্রায়াল তৈরি করুন"
                      : "Generate AI Virtual Look"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WARDROBE SELECTOR & ATELIER INFO */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col justify-between p-4 sm:p-6 bg-[#14100F] shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Active Selected Product Card */}
            <div className="p-3.5 rounded-2xl bg-[#1C1716] border border-[#B89A62]/30 flex items-center gap-3">
              <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-[#B89A62]/20">
                <Image
                  src={selectedProduct.image}
                  alt={getLocalized(selectedProduct.name, language)}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase tracking-widest text-[#B89A62] block font-mono">
                  {language === "bn" ? "নির্বাচিত পোশাক" : "Selected Piece"}
                </span>
                <h4 className="font-serif text-sm text-[#F5F0E8] truncate font-medium">
                  {getLocalized(selectedProduct.name, language)}
                </h4>
                <span className="font-serif text-sm font-semibold text-[#C5A869]">
                  {getLocalized(selectedProduct.price, language)}
                </span>
              </div>
            </div>

            {/* Direct 1-Click Buy / Order on WhatsApp for Selected Piece */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  openOrderModal({
                    id: selectedProduct.id,
                    name: getLocalized(selectedProduct.name, language),
                    price: getLocalized(selectedProduct.price, language),
                    image: selectedProduct.image,
                  });
                  closeStudio();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#6D1F2A] to-[#852735] hover:brightness-110 text-[#FAF5ED] text-[10.5px] font-sans font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>⚡</span>
                <span>{language === "bn" ? "ক্যাশ অন ডেলিভারি" : "1-Click COD"}</span>
              </button>

              <button
                type="button"
                onClick={handleOrderWhatsApp}
                className="py-2 px-3 rounded-xl bg-[#1C1716] hover:bg-[#28211E] text-[#B89A62] border border-[#B89A62]/30 text-[10.5px] font-sans font-medium tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title={language === "bn" ? "হোয়াটসঅ্যাপে অর্ডার" : "Order via WhatsApp"}
              >
                <span>💬</span>
                <span className="hidden sm:inline">{language === "bn" ? "হোয়াটসঅ্যাপ" : "WhatsApp"}</span>
              </button>
            </div>

            {/* Wardrobe Collection Header & Category Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#B89A62] font-semibold">
                  {language === "bn" ? "কালেকশন নির্বাচন" : "Select Collection"}
                </span>
                <span className="text-[10px] text-[#F5F0E8]/50 font-mono">
                  {filteredWardrobe.length}{" "}
                  {language === "bn" ? "আইটেম" : "Items"}
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-[10px] mb-3">
                {[
                  { id: "all", label: language === "bn" ? "সব" : "All" },
                  { id: "saree", label: language === "bn" ? "শাড়ি" : "Sarees" },
                  { id: "jewelry", label: language === "bn" ? "গয়না" : "Jewelry" },
                  { id: "clutch", label: language === "bn" ? "বটুয়া" : "Potli" },
                  { id: "shawl", label: language === "bn" ? "শাল" : "Shawls" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-sans ${
                      activeCategory === tab.id
                        ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold shadow"
                        : "bg-[#1A1514] text-[#F5F0E8]/60 hover:text-[#F5F0E8] hover:bg-[#221C1B]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Wardrobe Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredWardrobe.map((item) => {
                  const isSelected = selectedProduct.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setAiResultImage(null);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? "bg-[#2A171A] border-[#B89A62] shadow-md ring-1 ring-[#B89A62]/60"
                          : "bg-[#171312] border-[#B89A62]/20 hover:border-[#B89A62]/50 hover:bg-[#1E1917]"
                      }`}
                    >
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40">
                        <Image
                          src={item.image}
                          alt={getLocalized(item.name, language)}
                          fill
                          sizes="(max-width: 640px) 33vw, 120px"
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#6D1F2A] text-white flex items-center justify-center text-[9px] shadow border border-[#B89A62]">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-serif text-[#F5F0E8] block truncate">
                          {getLocalized(item.name, language)}
                        </span>
                        <span className="text-[10px] text-[#C5A869] font-semibold">
                          {getLocalized(item.price, language)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Try-on Instructions Card */}
            <div className="p-3 rounded-xl bg-[#1A1514] border border-[#B89A62]/20 text-[11px] text-[#F5F0E8]/70 flex flex-col gap-1.5">
              <span className="font-semibold text-[#B89A62] flex items-center gap-1.5">
                <span>💡</span>
                <span>{language === "bn" ? "টিপস" : "Tips for Best Result"}</span>
              </span>
              <p>
                {language === "bn"
                  ? "উজ্জ্বল আলোতে সোজা মুখ রেখে ছবি তুলুন অথবা আপলোড করুন। এআই নিখুঁতভাবে আপনার শরীরে শাড়ির ড্র্যাপ বসিয়ে দেবে।"
                  : "Snap or upload a portrait in good lighting facing forward for flawless AI fabric fitting."}
              </p>
            </div>
          </div>

          {/* Atelier Trust Footer */}
          <div className="pt-3 border-t border-[#B89A62]/20 text-[10px] text-[#F5F0E8]/50 flex items-center justify-between">
            <span>✨ ১০০% প্রাইভেট ও সুরক্ষিত</span>
            <span>ঢাকা স্টুডিও • ১৮৯২</span>
          </div>
        </div>
      </div>
    </div>
  );
}
