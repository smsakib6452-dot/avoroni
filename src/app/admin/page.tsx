"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import {
  SiteContent,
  DEFAULT_SITE_CONTENT,
  OriginRegion,
  SareeColorway,
  ArrivalCard,
  BestSellerItem,
  ColorCapsule,
  LifestyleCategory,
  LifestyleProduct,
} from "@/data/defaultContent";

type TabType =
  | "overview"
  | "orders"
  | "hero"
  | "arrivals"
  | "origins"
  | "lifestyle"
  | "colors"
  | "bestsellers"
  | "contact"
  | "footer"
  | "aiStudio"
  | "media";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [editLang, setEditLang] = useState<"en" | "bn">("bn");

  // Content state
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Origin section editing state
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [selectedLifestyleCatIndex, setSelectedLifestyleCatIndex] = useState<number>(0);

  // Inquiries / Orders CRM state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "order" | "inquiry">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gemini API testing state
  const [geminiTestStatus, setGeminiTestStatus] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);

  const handleTestGeminiKey = async () => {
    const key = content.aiEngine?.geminiApiKey || "";
    setGeminiTestStatus({ loading: true, message: "গুগল জেমিনি সার্ভারের সাথে সংযোগ পরীক্ষা করা হচ্ছে..." });
    try {
      const res = await fetch("/api/admin/test-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();
      setGeminiTestStatus({
        loading: false,
        success: data.success,
        message: data.message || (data.success ? "সংযুক্ত হয়েছে!" : "ব্যর্থ হয়েছে।"),
      });
    } catch (e: any) {
      setGeminiTestStatus({
        loading: false,
        success: false,
        message: "কানেকশন এরর: " + e.message,
      });
    }
  };

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        showToast("success", "স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে!");
      }
    } catch {
      showToast("error", "স্ট্যাটাস পরিবর্তন করা যায়নি");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই রেকর্ডটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        showToast("success", "রেকর্ড সফলভাবে মুছে ফেলা হয়েছে!");
      }
    } catch {
      showToast("error", "মুছে ফেলা সম্ভব হয়নি");
    }
  };

  // Check auth session
  useEffect(() => {
    const authSession = sessionStorage.getItem("avoroni_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch current content
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero) {
          setContent(data);
        }
      })
      .catch((err) => console.error("Failed to load content:", err));

    fetchInquiries();
  }, [isAuthenticated]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("avoroni_admin_auth", "true");
      } else {
        setAuthError(data.error || "ভুল পাসকোড! দয়া করে সঠিক পাসকোড দিন।");
      }
    } catch {
      setAuthError("সার্ভার কানেকশন এরর। আবার চেষ্টা করুন।");
    }
  };

  // Save All Changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", "সম্পূর্ণ ওয়েবসাইটের পরিবর্তনসমূহ সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        showToast("error", data.error || "সংরক্ষণ করা সম্ভব হয়নি");
      }
    } catch {
      showToast("error", "নেটওয়ার্ক সমস্যা। সেভ করা যায়নি।");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset Defaults
  const handleResetDefaults = async () => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে সব ডেটা ফ্যাক্টরি ডিফল্টে ফিরিয়ে নিতে চান?")) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent(data.content);
        showToast("success", "ওয়েবসাইট সফলভাবে ফ্যাক্টরি ডিফল্টে রিস্টোর করা হয়েছে।");
      }
    } catch {
      showToast("error", "রিসেট করা যায়নি");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete?: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", "ছবি সফলভাবে আপলোড হয়েছে!");
        setUploadedImages((prev) => [data.url, ...prev]);
        if (onComplete) onComplete(data.url);
      } else {
        showToast("error", data.error || "ছবি আপলোড ব্যর্থ হয়েছে");
      }
    } catch {
      showToast("error", "ছবি আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#141110] text-[#F5F0E8] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none">
        {/* Decorative Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6D1F2A]/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 w-full max-w-md bg-[#1C1817] border border-[#B89A62]/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#6D1F2A]/20 border border-[#B89A62]/40 flex items-center justify-center text-[#B89A62]">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B89A62] font-semibold">
              Maison Atelier Portal
            </span>
            <h1 className="font-serif text-3xl font-light text-[#F5F0E8]">
              আভরণী অ্যাডমিন প্যানেল
            </h1>
            <p className="text-xs text-[#F5F0E8]/60 font-light pt-1">
              ওয়েবসাইটের যেকোনো টেক্সট, ছবি ও শাড়ির কালেকশন সরাসরি এডিট করতে পাসকোড দিন।
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col text-left gap-1.5">
              <label className="text-[11px] tracking-wider uppercase text-[#EDE3D5]/75 font-medium">
                অ্যাডমিন পাসকোড (Admin Passcode)
              </label>
              <div className="relative w-full">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="পাসকোড লিখুন..."
                  className="w-full pl-4 pr-11 py-3 bg-[#141110] border border-[#B89A62]/30 rounded-xl text-[#F5F0E8] text-sm focus:outline-none focus:border-[#B89A62] transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B89A62]/70 hover:text-[#B89A62] p-1 cursor-pointer focus:outline-none"
                  title={showPasscode ? "লুকান" : "দেখুন"}
                >
                  {showPasscode ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {authError && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-lg text-left">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#6D1F2A] hover:bg-[#852735] text-[#F5F0E8] rounded-xl text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-lg cursor-pointer mt-2"
            >
              প্রবেশ করুন &rarr;
            </button>
          </form>

          <div className="text-[10px] text-[#F5F0E8]/40 border-t border-[#F5F0E8]/10 pt-4 w-full flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#B89A62]/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              এনক্রিপ্টেড সিকিউর পোর্টাল
            </span>
            <Link href="/" className="hover:text-[#F5F0E8] transition-colors">ওয়েবসাইটে ফিরুন &rarr;</Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  const regions = content.regionalSarees.regions;
  const currentRegion = regions[selectedRegionIndex] || regions[0];
  const lifestyleCategories: LifestyleCategory[] = content.lifestyleSection?.categories || [];
  const currentLifestyleCat = lifestyleCategories[selectedLifestyleCatIndex] || lifestyleCategories[0];

  return (
    <div className="min-h-screen bg-[#110D0C] text-[#F5F0E8] flex font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-medium tracking-wide flex items-center gap-3 animate-fade-in border ${
            toast.type === "success"
              ? "bg-[#1F4E3B] text-emerald-100 border-emerald-500/30"
              : "bg-rose-950 text-rose-100 border-rose-500/30"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 sm:w-72 bg-[#171312] border-r border-[#B89A62]/20 flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#B89A62]/20 flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <BrandLogo size={34} variant="light" />
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#B89A62]">
                  Atelier CMS Panel
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono font-medium" title="Supabase Cloud PostgreSQL Active">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase Cloud
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>📊</span>
              <span>ওভারভিউ (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span>📦</span>
                <span>অর্ডার ও ইনকোয়ারি (CRM)</span>
              </div>
              {inquiries.filter((i) => i.status === "pending").length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                  {inquiries.filter((i) => i.status === "pending").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("hero")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "hero"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>👑</span>
              <span>হিরো সেকশন (Hero Banner)</span>
            </button>

            <button
              onClick={() => setActiveTab("arrivals")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "arrivals"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>🌟</span>
              <span>নতুন আগমন (New Arrivals)</span>
            </button>

            <button
              onClick={() => setActiveTab("origins")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "origins"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>🏛️</span>
              <span>৭টি অঞ্চল ও ৪৩টি শাড়ি (Origins)</span>
            </button>

            <button
              onClick={() => setActiveTab("lifestyle")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "lifestyle"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>💎</span>
              <span>অনুষঙ্গ ও কালেকশন (Lifestyle)</span>
            </button>

            <button
              onClick={() => setActiveTab("colors")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "colors"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>🎨</span>
              <span>রঙ অনুযায়ী শাড়ি (Shop by Color)</span>
            </button>

            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "bestsellers"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>💎</span>
              <span>বেস্ট সেলার (Best Sellers)</span>
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "contact"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>📍</span>
              <span>বনানী স্টুডিও ও যোগাযোগ</span>
            </button>

            <button
              onClick={() => setActiveTab("footer")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "footer"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>📜</span>
              <span>ফুটার ও ব্র্যান্ড পাসকোড</span>
            </button>

            <button
              onClick={() => setActiveTab("aiStudio")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "aiStudio"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>✨</span>
              <span>এআই স্টুডিও সেটিংস (AI Studio)</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                activeTab === "media"
                  ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold"
                  : "text-[#EDE3D5]/70 hover:bg-[#1E1917] hover:text-[#F5F0E8]"
              }`}
            >
              <span>🖼️</span>
              <span>মিডিয়া ও ইমেজ আপলোড</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#B89A62]/20 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2.5 px-4 rounded-xl bg-[#1E1917] hover:bg-[#2A2321] text-xs text-[#B89A62] border border-[#B89A62]/30 flex items-center justify-between transition-colors"
          >
            <span>লাইভ ওয়েবসাইট দেখুন</span>
            <span>↗</span>
          </Link>

          <button
            onClick={() => {
              sessionStorage.removeItem("avoroni_admin_auth");
              setIsAuthenticated(false);
            }}
            className="text-[11px] text-rose-400/80 hover:text-rose-300 py-1 text-center cursor-pointer"
          >
            লগআউট করুন (Log out)
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Sticky Header with Language Switcher & Save Button */}
        <header className="sticky top-0 z-40 bg-[#171312]/95 backdrop-blur-md border-b border-[#B89A62]/20 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#B89A62] font-medium hidden sm:inline-block">
              ভাষা সিলেক্ট করুন:
            </span>
            <div className="flex items-center bg-[#110D0C] p-1 rounded-full border border-[#B89A62]/30 text-xs">
              <button
                onClick={() => setEditLang("bn")}
                className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                  editLang === "bn" ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold" : "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
                }`}
              >
                বাংলা (BN)
              </button>
              <button
                onClick={() => setEditLang("en")}
                className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                  editLang === "en" ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold" : "text-[#F5F0E8]/60 hover:text-[#F5F0E8]"
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl text-xs text-rose-300/80 hover:bg-rose-950/40 border border-rose-900/30 transition-colors cursor-pointer"
              title="ফ্যাক্টরি ডিফল্টে রিস্টোর করুন"
            >
              রিসেট
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#B89A62] hover:bg-[#C9A96E] text-[#141110] font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#141110] border-t-transparent rounded-full animate-spin" />
                  <span>সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>পরিবর্তন সেভ করুন</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="p-6 sm:p-10 max-w-5xl w-full mx-auto flex flex-col gap-8">
          {/* ========================================================= */}
          {/* 1. OVERVIEW TAB */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-3xl text-[#F5F0E8] font-light">
                  আভরণী অ্যাটেলিয়ার ওভারভিউ
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  সম্পূর্ণ ওয়েবসাইটের লাইভ পরিসংখ্যান ও তাৎক্ষণিক অ্যাকশন সামারি।
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-2">
                  <span className="text-xs text-[#B89A62] tracking-wider uppercase font-medium">৭টি ঐতিহ্যবাহী অঞ্চল</span>
                  <span className="font-serif text-3xl font-light text-[#F5F0E8]">{regions.length} টি</span>
                  <span className="text-[11px] text-[#F5F0E8]/50">বাংলাদেশ ও ভারতীয় ঐতিহ্য</span>
                </div>

                <div className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-2">
                  <span className="text-xs text-[#B89A62] tracking-wider uppercase font-medium">আসল AI মডেল শাড়ি</span>
                  <span className="font-serif text-3xl font-light text-emerald-400">৪৩ / ৪৩ টি</span>
                  <span className="text-[11px] text-[#F5F0E8]/50">১০০% রিয়েল AI মডেল সম্পন্ন</span>
                </div>

                <div className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-2">
                  <span className="text-xs text-[#B89A62] tracking-wider uppercase font-medium">রঙের ক্যাপসুল</span>
                  <span className="font-serif text-3xl font-light text-[#F5F0E8]">{content.colorCapsules.capsules.length} টি</span>
                  <span className="text-[11px] text-[#F5F0E8]/50">৬টি বৈচিত্র্যময় প্যালেট</span>
                </div>

                <div className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-2">
                  <span className="text-xs text-[#B89A62] tracking-wider uppercase font-medium">বেস্ট সেলার ও নতুন</span>
                  <span className="font-serif text-3xl font-light text-[#F5F0E8]">
                    {content.newArrivals.items.length + content.bestSellers.items.length} টি
                  </span>
                  <span className="text-[11px] text-[#F5F0E8]/50">হাইলাইট ড্রেপস</span>
                </div>

                <div
                  onClick={() => setActiveTab("orders")}
                  className="bg-[#171312] hover:bg-[#1E1917] border border-[#B89A62]/30 p-5 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all hover:border-[#B89A62]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#B89A62] tracking-wider uppercase font-medium">অর্ডার ও লিড</span>
                    {inquiries.filter((i) => i.status === "pending").length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <span className="font-serif text-3xl font-light text-[#F5F0E8]">{inquiries.length} টি</span>
                  <span className="text-[11px] text-amber-400">
                    {inquiries.filter((i) => i.status === "pending").length} টি নতুন অপেক্ষমান
                  </span>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                <div
                  onClick={() => setActiveTab("orders")}
                  className="bg-gradient-to-r from-[#201816] via-[#1E1917] to-[#251D1C] hover:border-[#B89A62] border border-[#B89A62]/30 p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-all col-span-1 md:col-span-2 shadow-lg"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl text-[#F5F0E8]">📦 লাইভ অর্ডার ও কাস্টমার সিআরএম (Orders CRM)</span>
                      {inquiries.filter((i) => i.status === "pending").length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-semibold">
                          {inquiries.filter((i) => i.status === "pending").length} টি নতুন অর্ডার
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#F5F0E8]/70">
                      ক্যাশ অন ডেলিভারি (COD) অর্ডার তালিকা, গ্রাহকের ঠিকানা ও ফোন নম্বর, এবং ১-ক্লিকে হোয়াটসঅ্যাপে অর্ডার কনফার্মেশন।
                    </span>
                  </div>
                  <span className="text-xl text-[#B89A62] font-mono">&rarr;</span>
                </div>

                <div
                  onClick={() => setActiveTab("origins")}
                  className="bg-[#171312] hover:bg-[#1E1917] border border-[#B89A62]/20 hover:border-[#B89A62]/50 p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-xl text-[#F5F0E8]">শাড়ির দাম ও কালারওয়ে এডিট</span>
                    <span className="text-xs text-[#F5F0E8]/60">৪৩টি শাড়ির প্রতিটির নাম, দাম ও ইমেজ পরিবর্তন করুন</span>
                  </div>
                  <span className="text-xl text-[#B89A62]">&rarr;</span>
                </div>

                <div
                  onClick={() => setActiveTab("hero")}
                  className="bg-[#171312] hover:bg-[#1E1917] border border-[#B89A62]/20 hover:border-[#B89A62]/50 p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-xl text-[#F5F0E8]">হিরো ব্যানার ও টেক্সট পরিবর্তন</span>
                    <span className="text-xs text-[#F5F0E8]/60">প্রধান শিরোনাম, ব্যানার ছবি ও বর্ণনা আপডেট করুন</span>
                  </div>
                  <span className="text-xl text-[#B89A62]">&rarr;</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ORDERS & INQUIRIES CRM TAB */}
          {/* ========================================================= */}
          {activeTab === "orders" && (() => {
            const isOrderRecord = (i: any) => i.type === "order" || i.type === "quick_order" || Boolean(i.product);
            const ordersOnly = inquiries.filter(isOrderRecord);
            const inquiriesOnly = inquiries.filter((i) => !isOrderRecord(i));
            const pendingCount = inquiries.filter((i) => i.status === "pending").length;
            const completedCount = inquiries.filter((i) => i.status === "completed" || i.status === "shipped").length;

            const totalRevenue = ordersOnly.reduce((sum, item) => {
              const amount = typeof item.totalAmount === "number"
                ? item.totalAmount
                : (parseInt(String(item.totalAmount || item.product?.numericPrice || "0").replace(/\D/g, ""), 10) || 0);
              return sum + amount;
            }, 0);

            const filteredList = inquiries.filter((item) => {
              const isOrder = isOrderRecord(item);
              const matchesType =
                inquiryFilter === "all"
                  ? true
                  : inquiryFilter === "order"
                  ? isOrder
                  : !isOrder;
              const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
              const q = searchQuery.trim().toLowerCase();
              const phone = item.customerPhone || item.phone || "";
              const pName = item.productName || item.product?.name || "";
              const addr = item.deliveryAddress || item.address || item.city || "";
              const matchesSearch =
                !q ||
                (item.customerName && item.customerName.toLowerCase().includes(q)) ||
                phone.includes(q) ||
                pName.toLowerCase().includes(q) ||
                (item.id && item.id.toLowerCase().includes(q)) ||
                addr.toLowerCase().includes(q);
              return matchesType && matchesStatus && matchesSearch;
            });

            const getStatusBadgeClass = (status: string) => {
              switch (status) {
                case "pending":
                  return "bg-amber-500/15 text-amber-300 border-amber-500/40";
                case "confirmed":
                  return "bg-blue-500/15 text-blue-300 border-blue-500/40";
                case "shipped":
                  return "bg-purple-500/15 text-purple-300 border-purple-500/40";
                case "completed":
                  return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
                case "cancelled":
                  return "bg-rose-500/15 text-rose-300 border-rose-500/40";
                default:
                  return "bg-neutral-800 text-neutral-300 border-neutral-700";
              }
            };

            const getStatusLabel = (status: string) => {
              switch (status) {
                case "pending":
                  return "অপেক্ষমান (Pending)";
                case "confirmed":
                  return "নিশ্চিত (Confirmed)";
                case "shipped":
                  return "ডেলিভারিতে (Shipped)";
                case "completed":
                  return "সম্পন্ন (Completed)";
                case "cancelled":
                  return "বাতিল (Cancelled)";
                default:
                  return status;
              }
            };

            const getWhatsAppLink = (item: any) => {
              let phone = String(item.customerPhone || item.phone || "").replace(/\D/g, "");
              if (phone.startsWith("0")) {
                phone = "88" + phone;
              } else if (!phone.startsWith("88") && phone.length === 10) {
                phone = "880" + phone;
              }
              const isOrder = isOrderRecord(item);
              const pName = item.productName || item.product?.name || "শাড়ি";
              const pColor = item.selectedColor || item.product?.color || "";
              const addr = item.deliveryAddress || item.address || item.city || "";
              const totalVal = item.totalAmount || item.product?.numericPrice || 0;
              const text =
                isOrder
                  ? `আসসালামু আলাইকুম ${item.customerName || "শ্রদ্ধেয় গ্রাহক"}, আভরণী (Avoroni Atelier) থেকে আপনার অর্ডারটি কনফার্ম করতে যোগাযোগ করছি।\n\n📦 অর্ডার আইডি: #${item.id}\n👗 শাড়ির নাম: ${pName}${pColor ? " (" + pColor + ")" : ""}\n💰 মোট প্রদেয় মূল্য: ৳ ${Number(totalVal).toLocaleString("en-US")}\n📍 ডেলিভারি ঠিকানা: ${addr}\n\nঅর্ডারটি কি কনফার্ম করে পার্সেল বুকিং পাঠিয়ে দেব? ধন্যবাদ!`
                  : `আসসালামু আলাইকুম ${item.customerName || "শ্রদ্ধেয় গ্রাহক"}, আভরণী (Avoroni Atelier) থেকে আপনার বার্তা/ইনকোয়ারির প্রেক্ষিতে যোগাযোগ করছি। কীভাবে আপনাকে সহায়তা করতে পারি?`;
              return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
            };

            return (
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl text-[#F5F0E8] font-light">
                      অর্ডার ও ইনকোয়ারি সিআরএম (Orders & CRM)
                    </h2>
                    <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                      ওয়েবসাইট থেকে সরাসরি প্রাপ্ত সকল ক্যাশ অন ডেলিভারি (COD) অর্ডার ও ইনকোয়ারি পরিচালনা করুন।
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchInquiries}
                      disabled={isLoadingInquiries}
                      className="px-4 py-2.5 rounded-xl bg-[#1E1917] hover:bg-[#2A2321] text-xs text-[#EDE3D5] border border-[#B89A62]/30 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className={isLoadingInquiries ? "animate-spin" : ""}>🔄</span>
                      <span>রিফ্রেশ</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-1.5">
                    <span className="text-xs text-[#B89A62] uppercase tracking-wider font-medium">মোট অর্ডার ও লিড</span>
                    <span className="font-serif text-3xl font-light text-[#F5F0E8]">{inquiries.length} টি</span>
                    <span className="text-[11px] text-[#F5F0E8]/50">
                      {ordersOnly.length} টি সিওডি অর্ডার • {inquiriesOnly.length} টি ইনকোয়ারি
                    </span>
                  </div>

                  <div className="bg-[#171312] border border-amber-500/30 p-5 rounded-2xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 uppercase tracking-wider font-medium">নতুন অপেক্ষমান</span>
                      {pendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          জরুরি
                        </span>
                      )}
                    </div>
                    <span className="font-serif text-3xl font-light text-amber-300">{pendingCount} টি</span>
                    <span className="text-[11px] text-[#F5F0E8]/50">গ্রাহকের ফোন/হোয়াটসঅ্যাপে নিশ্চিতকরণ প্রয়োজন</span>
                  </div>

                  <div className="bg-[#171312] border border-emerald-500/30 p-5 rounded-2xl flex flex-col gap-1.5">
                    <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium">নিশ্চিত / ডেলিভারি</span>
                    <span className="font-serif text-3xl font-light text-emerald-300">{completedCount} টি</span>
                    <span className="text-[11px] text-[#F5F0E8]/50">কনফার্মড ও ডেলিভারি সম্পন্ন</span>
                  </div>

                  <div className="bg-[#171312] border border-[#B89A62]/30 p-5 rounded-2xl flex flex-col gap-1.5">
                    <span className="text-xs text-[#B89A62] uppercase tracking-wider font-medium">মোট অর্ডার মূল্য</span>
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#F5F0E8]">
                      ৳ {totalRevenue.toLocaleString("en-US")}
                    </span>
                    <span className="text-[11px] text-[#F5F0E8]/50">ক্যাশ অন ডেলিভারি আনুমানিক বিক্রয়</span>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-[#171312] border border-[#B89A62]/20 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                  {/* Type Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setInquiryFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        inquiryFilter === "all"
                          ? "bg-[#6D1F2A] text-white"
                          : "bg-[#1E1917] text-[#EDE3D5]/70 hover:text-white"
                      }`}
                    >
                      সব রেকর্ড ({inquiries.length})
                    </button>
                    <button
                      onClick={() => setInquiryFilter("order")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        inquiryFilter === "order"
                          ? "bg-[#6D1F2A] text-white"
                          : "bg-[#1E1917] text-[#EDE3D5]/70 hover:text-white"
                      }`}
                    >
                      ⚡ ক্যাশ অন ডেলিভারি ({ordersOnly.length})
                    </button>
                    <button
                      onClick={() => setInquiryFilter("inquiry")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        inquiryFilter === "inquiry"
                          ? "bg-[#6D1F2A] text-white"
                          : "bg-[#1E1917] text-[#EDE3D5]/70 hover:text-white"
                      }`}
                    >
                      💬 ইনকোয়ারি ও ব্রাইডাল ({inquiriesOnly.length})
                    </button>
                  </div>

                  {/* Status & Search */}
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/30 rounded-xl text-xs text-[#EDE3D5] outline-none cursor-pointer"
                    >
                      <option value="all">সকল স্ট্যাটাস</option>
                      <option value="pending">অপেক্ষমান (Pending)</option>
                      <option value="confirmed">নিশ্চিত (Confirmed)</option>
                      <option value="shipped">ডেলিভারিতে (Shipped)</option>
                      <option value="completed">সম্পন্ন (Completed)</option>
                      <option value="cancelled">বাতিল (Cancelled)</option>
                    </select>

                    <div className="relative flex-1 md:w-56">
                      <input
                        type="text"
                        placeholder="নাম, ফোন বা শাড়ি দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-[#110D0C] border border-[#B89A62]/30 rounded-xl text-xs text-[#EDE3D5] placeholder-[#EDE3D5]/30 focus:border-[#B89A62] outline-none"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#EDE3D5]/40 hover:text-white"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Orders & Inquiries List */}
                <div className="flex flex-col gap-4">
                  {filteredList.length === 0 ? (
                    <div className="bg-[#171312] border border-[#B89A62]/20 p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">📭</span>
                      <h3 className="font-serif text-lg text-[#F5F0E8]">কোনো রেকর্ড পাওয়া যায়নি</h3>
                      <p className="text-xs text-[#F5F0E8]/50 max-w-sm">
                        বর্তমান ফিল্টারে কোনো অর্ডার বা মেসেজ নেই। নতুন অর্ডার আসলে তা স্বয়ংক্রিয়ভাবে এখানে তালিকাভুক্ত হবে।
                      </p>
                    </div>
                  ) : (
                    filteredList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#171312] border border-[#B89A62]/20 hover:border-[#B89A62]/40 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 transition-all shadow-md"
                      >
                        {/* Top Bar: Order ID, Type Badge, Date, Status Selector */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#B89A62]/15">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs font-bold text-[#B89A62] bg-[#B89A62]/10 px-2.5 py-1 rounded-lg border border-[#B89A62]/20">
                              #{item.id}
                            </span>
                            {item.type === "quick_order" || item.type === "order" || Boolean(item.product) ? (
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium">
                                ⚡ ১-ক্লিক ক্যাশ অন ডেলিভারি (COD)
                              </span>
                            ) : item.type === "bridal_consultation" ? (
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#6D1F2A]/30 border border-[#6D1F2A]/60 text-rose-200 font-medium">
                                👰 ব্রাইডাল কনসালটেন্সি
                              </span>
                            ) : (
                              <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 font-medium">
                                💬 সাধারণ ইনকোয়ারি
                              </span>
                            )}
                            <span className="text-[11px] text-[#F5F0E8]/40">
                              {item.createdAt ? new Date(item.createdAt).toLocaleString("bn-BD") : "তারিখ পাওয়া যায়নি"}
                            </span>
                          </div>

                          {/* Status Badge & Selector */}
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${getStatusBadgeClass(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                            <select
                              value={item.status}
                              onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                              className="px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/30 rounded-lg text-xs text-[#EDE3D5] outline-none cursor-pointer"
                            >
                              <option value="pending">স্ট্যাটাস: পেন্ডিং</option>
                              <option value="confirmed">স্ট্যাটাস: নিশ্চিত</option>
                              <option value="shipped">স্ট্যাটাস: ডেলিভারিতে</option>
                              <option value="completed">স্ট্যাটাস: সম্পন্ন</option>
                              <option value="cancelled">স্ট্যাটাস: বাতিল</option>
                            </select>
                          </div>
                        </div>

                        {/* Middle Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Col 1: Customer Details */}
                          <div className="flex flex-col gap-2">
                            <span className="text-[11px] uppercase tracking-wider text-[#B89A62] font-semibold">
                              👤 গ্রাহকের বিবরণ
                            </span>
                            <div className="text-sm font-medium text-[#F5F0E8]">
                              {item.customerName || "নাম উল্লেখ নেই"}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#F5F0E8]/70">ফোন:</span>
                              <a
                                href={`tel:${item.customerPhone || item.phone}`}
                                className="text-xs font-mono font-bold text-[#B89A62] hover:underline"
                              >
                                {item.customerPhone || item.phone || "ফোন নম্বর নেই"}
                              </a>
                            </div>
                            {item.customerEmail && (
                              <div className="text-xs text-[#F5F0E8]/60 truncate">
                                ইমেইল: {item.customerEmail}
                              </div>
                            )}
                            <div className="text-xs text-[#F5F0E8]/80 bg-[#110D0C] p-2.5 rounded-xl border border-[#B89A62]/15 mt-1">
                              <div className="font-medium text-[#B89A62] mb-0.5">ডেলিভারি ঠিকানা:</div>
                              {item.deliveryAddress || item.address || item.city || "ঠিকানা উল্লেখ নেই"}
                              {item.deliveryZone && (
                                <div className="mt-1 text-[10px] text-amber-300/80">
                                  {item.deliveryZone === "inside_dhaka" ? "📍 ঢাকার ভেতরে (৳৮০)" : "🚚 ঢাকার বাইরে (৳১৫০)"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Col 2: Saree & Order Items */}
                          <div className="flex flex-col gap-2">
                            <span className="text-[11px] uppercase tracking-wider text-[#B89A62] font-semibold">
                              👗 শাড়ি ও অর্ডারের তথ্য
                            </span>
                            {item.productName || item.product?.name ? (
                              <div className="flex flex-col gap-1.5">
                                <div className="text-sm font-medium text-[#F5F0E8]">
                                  {item.productName || item.product?.name}
                                </div>
                                {(item.selectedColor || item.product?.color) && (
                                  <div className="flex items-center gap-2 text-xs text-[#F5F0E8]/70">
                                    <span>নির্বাচিত রঙ:</span>
                                    <span className="px-2 py-0.5 rounded bg-[#1E1917] border border-[#B89A62]/30 text-[#EDE3D5]">
                                      {item.selectedColor || item.product?.color}
                                    </span>
                                  </div>
                                )}
                                {item.quantity && (
                                  <div className="text-xs text-[#F5F0E8]/70">
                                    পরিমাণ: <span className="font-semibold text-white">{item.quantity} টি</span>
                                  </div>
                                )}
                                <div className="mt-1 p-2.5 rounded-xl bg-[#110D0C] border border-[#B89A62]/15 flex flex-col gap-1 text-xs">
                                  <div className="flex justify-between text-[#F5F0E8]/70">
                                    <span>শাড়ির মূল্য:</span>
                                    <span>{item.productPrice || item.product?.price || "আলোচনা সাপেক্ষে"}</span>
                                  </div>
                                  {item.deliveryFee !== undefined && (
                                    <div className="flex justify-between text-[#F5F0E8]/70">
                                      <span>ডেলিভারি চার্জ:</span>
                                      <span>৳ {item.deliveryFee}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-bold text-[#B89A62] border-t border-[#B89A62]/20 pt-1 mt-0.5">
                                    <span>মোট প্রদেয়:</span>
                                    <span>
                                      {item.totalAmount ? `৳ ${Number(item.totalAmount).toLocaleString("en-US")}` : item.product?.numericPrice ? `৳ ${Number(item.product.numericPrice).toLocaleString("en-US")}` : item.productPrice || "N/A"}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-emerald-400 mt-0.5">
                                    পেমেন্ট: {item.paymentMethod === "bkash" ? "বিকাশ (bKash)" : "ক্যাশ অন ডেলিভারি (COD)"}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-[#F5F0E8]/60 bg-[#110D0C] p-3 rounded-xl border border-[#B89A62]/15 italic">
                                &ldquo;{item.message || item.customerNote || item.notes || "কোনো বিশেষ বার্তা নেই"}&rdquo;
                              </div>
                            )}
                          </div>

                          {/* Col 3: Direct Actions */}
                          <div className="flex flex-col gap-2.5 justify-center">
                            <span className="text-[11px] uppercase tracking-wider text-[#B89A62] font-semibold">
                              ⚡ তাৎক্ষণিক অ্যাকশন
                            </span>

                            {/* 1-Click WhatsApp Confirmation */}
                            <a
                              href={getWhatsAppLink(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 transition-colors text-xs font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                            >
                              <span>💬</span>
                              <span>হোয়াটসঅ্যাপে কনফার্ম করুন</span>
                            </a>

                            {/* Direct Call */}
                            <a
                              href={`tel:${item.customerPhone || item.phone}`}
                              className="w-full py-2.5 px-4 rounded-xl bg-[#1E1917] hover:bg-[#2A2321] text-[#EDE3D5] border border-[#B89A62]/30 hover:border-[#B89A62] transition-colors text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>📞</span>
                              <span>সরাসরি কল দিন</span>
                            </a>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteInquiry(item.id)}
                              className="w-full py-2 px-4 rounded-xl bg-rose-950/20 hover:bg-rose-900/50 text-rose-300 border border-rose-800/30 transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer mt-1"
                            >
                              <span>🗑️</span>
                              <span>রেকর্ড মুছুন</span>
                            </button>
                          </div>
                        </div>

                        {/* Customer note if exists */}
                        {(item.customerNote || item.notes) && (item.productName || item.product?.name) && (
                          <div className="text-xs bg-[#110D0C] p-3 rounded-xl border border-[#B89A62]/15 text-[#F5F0E8]/70">
                            <span className="font-semibold text-[#B89A62]">গ্রাহকের বিশেষ নোট: </span>
                            &ldquo;{item.customerNote || item.notes}&rdquo;
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* 2. HERO SECTION TAB */}
          {/* ========================================================= */}
          {activeTab === "hero" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  হিরো ব্যানার এডিটর ({editLang === "bn" ? "বাংলা" : "English"})
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  হোমপেজের সর্বপ্রথম দৃশ্যমান ব্যানার, টেক্সট এবং ছবি নিয়ন্ত্রণ করুন।
                </p>
              </div>

              <div className="bg-[#171312] border border-[#B89A62]/20 p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                {/* Eyebrow Pill */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    আইব্রো পিল (Eyebrow Badge)
                  </label>
                  <input
                    type="text"
                    value={content.hero.eyebrow[editLang]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          eyebrow: { ...content.hero.eyebrow, [editLang]: e.target.value },
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm text-[#F5F0E8] focus:border-[#B89A62] outline-none"
                  />
                </div>

                {/* Main Heading */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    মূল শিরোনাম (Giant Heading)
                  </label>
                  <input
                    type="text"
                    value={content.hero.heading[editLang]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          heading: { ...content.hero.heading, [editLang]: e.target.value },
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm text-[#F5F0E8] focus:border-[#B89A62] outline-none"
                  />
                </div>

                {/* Subtitle Lines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      সাবটাইটেল লাইন ১
                    </label>
                    <input
                      type="text"
                      value={content.hero.subtitle_1[editLang]}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            subtitle_1: { ...content.hero.subtitle_1, [editLang]: e.target.value },
                          },
                        })
                      }
                      className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm text-[#F5F0E8] focus:border-[#B89A62] outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      সাবটাইটেল লাইন ২
                    </label>
                    <input
                      type="text"
                      value={content.hero.subtitle_2[editLang]}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            subtitle_2: { ...content.hero.subtitle_2, [editLang]: e.target.value },
                          },
                        })
                      }
                      className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm text-[#F5F0E8] focus:border-[#B89A62] outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    বর্ণনা (Hero Story / Description)
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.description[editLang]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          description: { ...content.hero.description, [editLang]: e.target.value },
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm text-[#F5F0E8] focus:border-[#B89A62] outline-none"
                  />
                </div>

                {/* Hero Image */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#B89A62]/15">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    হিরো ব্যাকগ্রাউন্ড ছবি (Hero Background Image)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-[#110D0C] border border-[#B89A62]/30 shrink-0">
                      <Image
                        src={content.hero.image}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-2">
                      <input
                        type="text"
                        value={content.hero.image}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, image: e.target.value },
                          })
                        }
                        placeholder="/images/hero_culture.jpg"
                        className="w-full px-4 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8] outline-none"
                      />
                      <label className="inline-flex items-center gap-2 text-xs text-[#B89A62] hover:text-[#F5F0E8] cursor-pointer">
                        <span>📤 নতুন ছবি আপলোড করুন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, (url) => {
                              setContent({
                                ...content,
                                hero: { ...content.hero, image: url },
                              });
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. NEW ARRIVALS TAB */}
          {/* ========================================================= */}
          {activeTab === "arrivals" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                    নতুন আগমন (New Arrivals)
                  </h2>
                  <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                    হোমপেজের নতুন কালেকশন কার্ড ও দাম এডিট করুন।
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newItem: ArrivalCard = {
                      id: `item-${Date.now()}`,
                      name: { en: "New Luxury Saree", bn: "নতুন আভিজাত্য শাড়ি" },
                      weave: { en: "Pure Handloom Silk", bn: "খাঁটি তাঁত সিল্ক" },
                      price: { en: "৳ 5,500", bn: "৳ ৫,৫০০" },
                      image: "/images/editorial_portrait.jpg",
                    };
                    setContent({
                      ...content,
                      newArrivals: {
                        ...content.newArrivals,
                        items: [...content.newArrivals.items, newItem],
                      },
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6D1F2A] hover:bg-[#852735] text-xs text-[#F5F0E8] font-medium cursor-pointer"
                >
                  + নতুন শাড়ি যোগ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.newArrivals.items.map((item, idx) => (
                  <div key={item.id} className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif text-[#B89A62]">শাড়ি #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = content.newArrivals.items.filter((_, i) => i !== idx);
                          setContent({
                            ...content,
                            newArrivals: { ...content.newArrivals, items: updated },
                          });
                        }}
                        className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        মুছুন
                      </button>
                    </div>

                    <div className="flex gap-4">
                      <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-[#110D0C] border border-[#B89A62]/30 shrink-0">
                        <Image src={item.image} alt={item.name[editLang]} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 flex flex-col gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-[#B89A62] uppercase">শাড়ির নাম ({editLang}):</label>
                          <input
                            type="text"
                            value={item.name[editLang]}
                            onChange={(e) => {
                              const updated = [...content.newArrivals.items];
                              updated[idx].name[editLang] = e.target.value;
                              setContent({ ...content, newArrivals: { ...content.newArrivals, items: updated } });
                            }}
                            className="w-full px-3 py-1.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#B89A62] uppercase">বুনন/কাপড় ({editLang}):</label>
                          <input
                            type="text"
                            value={item.weave[editLang]}
                            onChange={(e) => {
                              const updated = [...content.newArrivals.items];
                              updated[idx].weave[editLang] = e.target.value;
                              setContent({ ...content, newArrivals: { ...content.newArrivals, items: updated } });
                            }}
                            className="w-full px-3 py-1.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#B89A62] uppercase">মূল্য ৳ BDT ({editLang}):</label>
                          <input
                            type="text"
                            value={item.price[editLang]}
                            onChange={(e) => {
                              const updated = [...content.newArrivals.items];
                              updated[idx].price[editLang] = e.target.value;
                              setContent({ ...content, newArrivals: { ...content.newArrivals, items: updated } });
                            }}
                            className="w-full px-3 py-1.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="inline-flex items-center gap-1.5 text-[10px] text-[#B89A62] hover:text-[#F5F0E8] cursor-pointer pt-1">
                            <span>📤 ছবি আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (url) => {
                                  const updated = [...content.newArrivals.items];
                                  updated[idx].image = url;
                                  setContent({ ...content, newArrivals: { ...content.newArrivals, items: updated } });
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. SAREES BY ORIGIN (7 REGIONS & 43 COLORWAYS) */}
          {/* ========================================================= */}
          {activeTab === "origins" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  ৭টি ঐতিহ্যবাহী অঞ্চল ও ৪৩টি আসল AI কালারওয়ে
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  প্রতিটি অঞ্চলের শাড়ির নাম, অবস্থান, বিবরণ এবং এর ভেতরের প্রতিটি রঙের দাম ও ছবি পরিবর্তন করুন।
                </p>
              </div>

              {/* Region Selector Pills */}
              <div className="flex flex-wrap gap-2 pb-2">
                {regions.map((reg, idx) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegionIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedRegionIndex === idx
                        ? "bg-[#B89A62] text-[#141110] font-semibold shadow-md"
                        : "bg-[#171312] text-[#EDE3D5]/80 border border-[#B89A62]/20 hover:border-[#B89A62]/50"
                    }`}
                  >
                    <span>{reg.name[editLang]}</span>
                    <span className="ml-1.5 text-[10px] opacity-70">({reg.colorways.length} রঙ)</span>
                  </button>
                ))}
              </div>

              {/* Active Region Metadata Editor */}
              <div className="bg-[#171312] border border-[#B89A62]/20 p-6 rounded-2xl flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#B89A62]/15">
                  <span className="text-sm font-serif text-[#B89A62] uppercase tracking-wider">
                    {currentRegion.name[editLang]} — অঞ্চলের তথ্য ({editLang})
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    ✓ {currentRegion.colorways.length}টি আসল কালারওয়ে সক্রিয়
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-[#B89A62]">অঞ্চলের নাম ({editLang}):</label>
                    <input
                      type="text"
                      value={currentRegion.name[editLang]}
                      onChange={(e) => {
                        const updated = [...regions];
                        updated[selectedRegionIndex].name[editLang] = e.target.value;
                        setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                      }}
                      className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-[#B89A62]">অবস্থান / তাঁত পল্লী ({editLang}):</label>
                    <input
                      type="text"
                      value={currentRegion.location[editLang]}
                      onChange={(e) => {
                        const updated = [...regions];
                        updated[selectedRegionIndex].location[editLang] = e.target.value;
                        setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                      }}
                      className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase text-[#B89A62]">ঐতিহাসিক বিবরণ ({editLang}):</label>
                  <textarea
                    rows={2}
                    value={currentRegion.description[editLang]}
                    onChange={(e) => {
                      const updated = [...regions];
                      updated[selectedRegionIndex].description[editLang] = e.target.value;
                      setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                    }}
                    className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Colorways List for Current Region */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-[#F5F0E8]">
                    {currentRegion.name[editLang]} এর রঙসমূহ ({currentRegion.colorways.length} Colorways)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentRegion.colorways.map((cw, cIdx) => (
                    <div
                      key={cw.id}
                      className="bg-[#171312] border border-[#B89A62]/20 hover:border-[#B89A62]/40 p-4 rounded-2xl flex flex-col gap-3 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: cw.hex }}
                          />
                          <span className="font-medium text-xs text-[#F5F0E8]">{cw.name[editLang]}</span>
                        </div>
                        <span className="text-[10px] text-[#B89A62] font-mono">{cw.id}</span>
                      </div>

                      {/* Image Preview & Upload */}
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#110D0C] border border-[#B89A62]/20">
                        <Image
                          src={cw.image}
                          alt={cw.name[editLang]}
                          fill
                          className="object-cover object-[center_top]"
                          unoptimized
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#141110]/80 backdrop-blur-sm rounded-md text-[10px] font-mono text-[#F5F0E8]">
                          {cw.price[editLang]}
                        </div>
                      </div>

                      {/* Edit Fields */}
                      <div className="flex flex-col gap-2 text-xs">
                        <div>
                          <label className="text-[9px] uppercase text-[#B89A62]">রঙের নাম ({editLang}):</label>
                          <input
                            type="text"
                            value={cw.name[editLang]}
                            onChange={(e) => {
                              const updated = [...regions];
                              updated[selectedRegionIndex].colorways[cIdx].name[editLang] = e.target.value;
                              setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                            }}
                            className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase text-[#B89A62]">মূল্য ৳ BDT ({editLang}):</label>
                          <input
                            type="text"
                            value={cw.price[editLang]}
                            onChange={(e) => {
                              const updated = [...regions];
                              updated[selectedRegionIndex].colorways[cIdx].price[editLang] = e.target.value;
                              setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                            }}
                            className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase text-[#B89A62]">ছবির পাথ (Image Path):</label>
                          <input
                            type="text"
                            value={cw.image}
                            onChange={(e) => {
                              const updated = [...regions];
                              updated[selectedRegionIndex].colorways[cIdx].image = e.target.value;
                              setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                            }}
                            className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-[11px] font-mono text-[#F5F0E8]/80"
                          />
                        </div>

                        <label className="inline-flex items-center gap-1.5 text-[10px] text-[#B89A62] hover:text-[#F5F0E8] cursor-pointer pt-1">
                          <span>📤 নতুন AI মডেল ইমেজ আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => {
                                const updated = [...regions];
                                updated[selectedRegionIndex].colorways[cIdx].image = url;
                                setContent({ ...content, regionalSarees: { ...content.regionalSarees, regions: updated } });
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. LIFESTYLE & ACCESSORIES TAB (Jewelry, Clutches, 3-Piece, Shawls) */}
          {/* ========================================================= */}
          {activeTab === "lifestyle" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                    লাইফস্টাইল ও অনুষঙ্গ (Lifestyle & Accessories)
                  </h2>
                  <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                    গয়না, বটুয়া/ক্লাচ, আনস্টিচড ৩-পিস ও শাল—প্রতিটি ক্যাটাগরি ও প্রোডাক্ট লাইভ এডিট করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newCatId = `cat-${Date.now()}`;
                    const newCategory: LifestyleCategory = {
                      id: newCatId,
                      slug: `category-${Date.now()}`,
                      name: { en: "New Luxury Category", bn: "নতুন রাজকীয় ক্যাটাগরি" },
                      tagline: { en: "Artisanal Heirloom", bn: "অনুপম কারুকাজ" },
                      description: { en: "Curated boutique pieces handcrafted for perfection.", bn: "হস্তশিল্পের অপূর্ব সমাহার ও নান্দনিক রূপ।" },
                      badge: { en: "Exclusive", bn: "এক্সক্লুসিভ" },
                      coverImage: "/images/editorial_detail.jpg",
                      items: [],
                    };
                    const updatedCats = [...lifestyleCategories, newCategory];
                    setContent({
                      ...content,
                      lifestyleSection: {
                        ...(content.lifestyleSection || {
                          pill: { en: "Curated Lifestyle Atelier", bn: "অভিজাত অনুষঙ্গ ও সম্ভার" },
                          heading: { en: "Royal Adornments & Heritage Accents", bn: "ঐতিহ্যের রাজকীয় সাজ ও অনুপম অনুষঙ্গ" },
                          subtitle: { en: "Beyond drapes", bn: "শাড়ির বাইরেও" },
                          ctaText: { en: "Inquire via WhatsApp", bn: "হোয়াটসঅ্যাপে অর্ডার" },
                          categories: [],
                        }),
                        categories: updatedCats,
                      },
                    });
                    setSelectedLifestyleCatIndex(updatedCats.length - 1);
                    showToast("success", "নতুন ক্যাটাগরি সফলভাবে যোগ করা হয়েছে!");
                  }}
                  className="px-4 py-2 bg-[#1E1917] hover:bg-[#2A2321] text-xs text-[#B89A62] border border-[#B89A62]/30 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shrink-0"
                >
                  <span>+</span>
                  <span>নতুন ক্যাটাগরি যোগ করুন</span>
                </button>
              </div>

              {/* Category Selector Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[#B89A62]/20 pb-4">
                {lifestyleCategories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedLifestyleCatIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs transition-all cursor-pointer font-sans ${
                      selectedLifestyleCatIndex === idx
                        ? "bg-[#6D1F2A] text-[#F5F0E8] font-semibold shadow-md border border-[#B89A62]/40"
                        : "bg-[#171312] text-[#F5F0E8]/70 hover:text-[#F5F0E8] border border-[#B89A62]/20"
                    }`}
                  >
                    <span>{cat.name[editLang] || cat.name.bn}</span>
                    <span className="ml-2 text-[10px] opacity-75">({cat.items.length})</span>
                  </button>
                ))}
              </div>

              {currentLifestyleCat && (
                <div className="flex flex-col gap-6">
                  {/* Category Metadata Card */}
                  <div className="bg-[#171312] border border-[#B89A62]/20 p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-[#B89A62] font-semibold">
                        ক্যাটাগরি তথ্য ({editLang === "bn" ? "বাংলা" : "English"})
                      </span>

                      {lifestyleCategories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`আপনি কি "${currentLifestyleCat.name[editLang]}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) return;
                            const updatedCats = lifestyleCategories.filter((_, i) => i !== selectedLifestyleCatIndex);
                            setContent({
                              ...content,
                              lifestyleSection: {
                                ...content.lifestyleSection!,
                                categories: updatedCats,
                              },
                            });
                            setSelectedLifestyleCatIndex(0);
                            showToast("success", "ক্যাটাগরি মুছে ফেলা হয়েছে");
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 py-1 px-3 rounded-lg bg-rose-950/20 border border-rose-900/30 cursor-pointer"
                        >
                          🗑️ এই ক্যাটাগরি ডিলিট করুন
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-[10px] uppercase text-[#B89A62]">ক্যাটাগরির নাম ({editLang}):</label>
                        <input
                          type="text"
                          value={currentLifestyleCat.name[editLang]}
                          onChange={(e) => {
                            const updated = [...lifestyleCategories];
                            updated[selectedLifestyleCatIndex].name[editLang] = e.target.value;
                            setContent({
                              ...content,
                              lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-[#B89A62]">ট্যাগলাইন ({editLang}):</label>
                        <input
                          type="text"
                          value={currentLifestyleCat.tagline[editLang]}
                          onChange={(e) => {
                            const updated = [...lifestyleCategories];
                            updated[selectedLifestyleCatIndex].tagline[editLang] = e.target.value;
                            setContent({
                              ...content,
                              lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-[#B89A62]">ব্যাজ টেক্সট ({editLang}):</label>
                        <input
                          type="text"
                          value={currentLifestyleCat.badge[editLang]}
                          onChange={(e) => {
                            const updated = [...lifestyleCategories];
                            updated[selectedLifestyleCatIndex].badge[editLang] = e.target.value;
                            setContent({
                              ...content,
                              lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-[#B89A62]">বর্ণনা ({editLang}):</label>
                        <input
                          type="text"
                          value={currentLifestyleCat.description[editLang]}
                          onChange={(e) => {
                            const updated = [...lifestyleCategories];
                            updated[selectedLifestyleCatIndex].description[editLang] = e.target.value;
                            setContent({
                              ...content,
                              lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products Header & Add Button */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h3 className="font-serif text-xl text-[#F5F0E8]">
                        {currentLifestyleCat.name[editLang]} এর প্রোডাক্টসমূহ ({currentLifestyleCat.items.length} টি)
                      </h3>
                      <span className="text-xs text-[#F5F0E8]/50">প্রতিটি পণ্যের নাম, দাম, ছবি ও স্টক কন্ট্রোল করুন</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newProduct: LifestyleProduct = {
                          id: `prod-${Date.now()}`,
                          name: { en: "Royal Artisan Piece", bn: "রাজকীয় হস্তশিল্প পণ্য" },
                          craft: { en: "Handcrafted Heritage Weave", bn: "হস্তনির্মিত রাজকীয় কারুকাজ" },
                          price: { en: "৳ 4,500", bn: "৳ ৪,৫০০" },
                          image: "/images/editorial_detail.jpg",
                          tag: { en: "New Arrival", bn: "নতুন কালেকশন" },
                          inStock: true,
                        };
                        const updated = [...lifestyleCategories];
                        updated[selectedLifestyleCatIndex].items = [newProduct, ...updated[selectedLifestyleCatIndex].items];
                        setContent({
                          ...content,
                          lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                        });
                        showToast("success", "নতুন পণ্য সফলভাবে যোগ করা হয়েছে!");
                      }}
                      className="px-4 py-2.5 bg-[#6D1F2A] hover:bg-[#852735] text-xs text-[#F5F0E8] rounded-xl flex items-center gap-2 cursor-pointer shadow transition-all shrink-0"
                    >
                      <span>+</span>
                      <span>নতুন পণ্য যোগ করুন</span>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {currentLifestyleCat.items.map((prod, pIdx) => (
                      <div
                        key={prod.id}
                        className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex gap-4 relative group hover:border-[#B89A62]/50 transition-all"
                      >
                        {/* Image Preview & Upload */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-[#110D0C] border border-[#B89A62]/20">
                            <Image
                              src={prod.image}
                              alt={prod.name[editLang] || "Product"}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>

                          <label className="text-[10px] text-center text-[#B89A62] hover:text-[#F5F0E8] py-1 px-2 rounded-lg bg-[#110D0C] border border-[#B89A62]/20 cursor-pointer block">
                            <span>📤 ছবি বদলান</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (url) => {
                                  const updated = [...lifestyleCategories];
                                  updated[selectedLifestyleCatIndex].items[pIdx].image = url;
                                  setContent({
                                    ...content,
                                    lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                  });
                                })
                              }
                            />
                          </label>
                        </div>

                        {/* Product Fields */}
                        <div className="flex-1 flex flex-col justify-between gap-3 text-xs">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[#B89A62] font-mono">আইটেম #{pIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!window.confirm(`আপনি কি "${prod.name[editLang]}" মুছে ফেলতে চান?`)) return;
                                  const updated = [...lifestyleCategories];
                                  updated[selectedLifestyleCatIndex].items = updated[selectedLifestyleCatIndex].items.filter((_, i) => i !== pIdx);
                                  setContent({
                                    ...content,
                                    lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                  });
                                  showToast("success", "পণ্যটি ডিলিট করা হয়েছে");
                                }}
                                className="text-rose-400 hover:text-rose-300 text-xs cursor-pointer p-1"
                                title="পণ্যটি মুছুন"
                              >
                                ✕
                              </button>
                            </div>

                            <div>
                              <label className="text-[9px] uppercase text-[#B89A62]">পণ্যের নাম ({editLang}):</label>
                              <input
                                type="text"
                                value={prod.name[editLang]}
                                onChange={(e) => {
                                  const updated = [...lifestyleCategories];
                                  updated[selectedLifestyleCatIndex].items[pIdx].name[editLang] = e.target.value;
                                  setContent({
                                    ...content,
                                    lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                  });
                                }}
                                className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs text-[#F5F0E8]"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] uppercase text-[#B89A62]">কারিগরী বিবরণ ({editLang}):</label>
                              <input
                                type="text"
                                value={prod.craft[editLang]}
                                onChange={(e) => {
                                  const updated = [...lifestyleCategories];
                                  updated[selectedLifestyleCatIndex].items[pIdx].craft[editLang] = e.target.value;
                                  setContent({
                                    ...content,
                                    lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                  });
                                }}
                                className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-[11px] text-[#F5F0E8]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] uppercase text-[#B89A62]">মূল্য ({editLang}):</label>
                                <input
                                  type="text"
                                  value={prod.price[editLang]}
                                  onChange={(e) => {
                                    const updated = [...lifestyleCategories];
                                    updated[selectedLifestyleCatIndex].items[pIdx].price[editLang] = e.target.value;
                                    setContent({
                                      ...content,
                                      lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs font-semibold text-[#8C6B38]"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] uppercase text-[#B89A62]">ট্যাগ/ব্যাজ ({editLang}):</label>
                                <input
                                  type="text"
                                  value={prod.tag[editLang]}
                                  onChange={(e) => {
                                    const updated = [...lifestyleCategories];
                                    updated[selectedLifestyleCatIndex].items[pIdx].tag[editLang] = e.target.value;
                                    setContent({
                                      ...content,
                                      lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                    });
                                  }}
                                  className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-[11px] text-[#F5F0E8]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] uppercase text-[#B89A62]">ছবির পাথ:</label>
                              <input
                                type="text"
                                value={prod.image}
                                onChange={(e) => {
                                  const updated = [...lifestyleCategories];
                                  updated[selectedLifestyleCatIndex].items[pIdx].image = e.target.value;
                                  setContent({
                                    ...content,
                                    lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                  });
                                }}
                                className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-[10px] font-mono text-[#F5F0E8]/70"
                              />
                            </div>
                          </div>

                          {/* In Stock Toggle */}
                          <div className="pt-2 border-t border-[#B89A62]/10 flex items-center justify-between">
                            <span className="text-[10px] text-[#F5F0E8]/70">স্টক স্ট্যাটাস:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...lifestyleCategories];
                                updated[selectedLifestyleCatIndex].items[pIdx].inStock = !prod.inStock;
                                setContent({
                                  ...content,
                                  lifestyleSection: { ...content.lifestyleSection!, categories: updated },
                                });
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                                prod.inStock
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                  : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                              }`}
                            >
                              {prod.inStock ? "✓ ইন স্টক (In Stock)" : "✕ স্টক আউট (Out of Stock)"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. SHOP BY COLOR TAB */}
          {/* ========================================================= */}
          {activeTab === "colors" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  রঙ অনুযায়ী শাড়ি (Shop By Color — ৬টি ক্যাপসুল)
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  লাল, সবুজ, হলুদ, নীল, গোলাপী ও বেগুনি ক্যাপসুলের শিরোনাম, বুনন ও ডিসপ্লে ছবি পরিবর্তন করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.colorCapsules.capsules.map((cap, cIdx) => (
                  <div key={cap.id} className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: cap.colorHex }} />
                        <span className="font-serif text-sm font-medium text-[#F5F0E8]">{cap.name[editLang]}</span>
                      </div>
                      <span className="text-xs text-[#B89A62] font-mono">ক্যাপসুল #{cIdx + 1}</span>
                    </div>

                    <div className="flex gap-4">
                      <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-[#110D0C] border border-[#B89A62]/20 shrink-0">
                        <Image src={cap.image} alt={cap.title[editLang]} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 flex flex-col gap-2 text-xs">
                        <div>
                          <label className="text-[9px] uppercase text-[#B89A62]">ক্যাপসুল শিরোনাম ({editLang}):</label>
                          <input
                            type="text"
                            value={cap.title[editLang]}
                            onChange={(e) => {
                              const updated = [...content.colorCapsules.capsules];
                              updated[cIdx].title[editLang] = e.target.value;
                              setContent({ ...content, colorCapsules: { ...content.colorCapsules, capsules: updated } });
                            }}
                            className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] uppercase text-[#B89A62]">বুনন ও জরি বিবরণ ({editLang}):</label>
                          <input
                            type="text"
                            value={cap.weave[editLang]}
                            onChange={(e) => {
                              const updated = [...content.colorCapsules.capsules];
                              updated[cIdx].weave[editLang] = e.target.value;
                              setContent({ ...content, colorCapsules: { ...content.colorCapsules, capsules: updated } });
                            }}
                            className="w-full px-2.5 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="inline-flex items-center gap-1.5 text-[10px] text-[#B89A62] hover:text-[#F5F0E8] cursor-pointer pt-1">
                            <span>📤 নতুন ছবি আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (url) => {
                                  const updated = [...content.colorCapsules.capsules];
                                  updated[cIdx].image = url;
                                  setContent({ ...content, colorCapsules: { ...content.colorCapsules, capsules: updated } });
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. BEST SELLERS TAB */}
          {/* ========================================================= */}
          {activeTab === "bestsellers" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                    বেস্ট সেলার কালেকশন (Best Sellers)
                  </h2>
                  <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                    হোমপেজের আর্চড উইন্ডো বেস্ট সেলার শাড়িসমূহ এডিট করুন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.bestSellers.items.map((item, idx) => (
                  <div key={item.id} className="bg-[#171312] border border-[#B89A62]/20 p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif text-[#B89A62]">বেস্ট সেলার #{idx + 1}</span>
                      <span className="text-xs text-amber-400">★ {item.rating[editLang]}</span>
                    </div>

                    <div className="flex gap-4">
                      <div className="relative w-24 h-32 rounded-t-full rounded-b-xl overflow-hidden bg-[#110D0C] border border-[#B89A62]/30 shrink-0">
                        <Image src={item.image} alt={item.name[editLang]} fill className="object-cover" unoptimized />
                      </div>

                      <div className="flex-1 flex flex-col gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-[#B89A62] uppercase">নাম ({editLang}):</label>
                          <input
                            type="text"
                            value={item.name[editLang]}
                            onChange={(e) => {
                              const updated = [...content.bestSellers.items];
                              updated[idx].name[editLang] = e.target.value;
                              setContent({ ...content, bestSellers: { ...content.bestSellers, items: updated } });
                            }}
                            className="w-full px-3 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-[#B89A62] uppercase">মূল্য ৳ BDT ({editLang}):</label>
                          <input
                            type="text"
                            value={item.price[editLang]}
                            onChange={(e) => {
                              const updated = [...content.bestSellers.items];
                              updated[idx].price[editLang] = e.target.value;
                              setContent({ ...content, bestSellers: { ...content.bestSellers, items: updated } });
                            }}
                            className="w-full px-3 py-1 bg-[#110D0C] border border-[#B89A62]/20 rounded-lg text-xs"
                          />
                        </div>

                        <label className="inline-flex items-center gap-1.5 text-[10px] text-[#B89A62] hover:text-[#F5F0E8] cursor-pointer pt-1">
                          <span>📤 ছবি পরিবর্তন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => {
                                const updated = [...content.bestSellers.items];
                                updated[idx].image = url;
                                setContent({ ...content, bestSellers: { ...content.bestSellers, items: updated } });
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. CONTACT & STUDIO TAB */}
          {/* ========================================================= */}
          {activeTab === "contact" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  বনানী স্টুডিও ও যোগাযোগের তথ্য
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  ফোন নম্বর, হোয়াটসঅ্যাপ, ইমেইল ও বনানী স্টুডিওর ঠিকানা এডিট করুন।
                </p>
              </div>

              <div className="bg-[#171312] border border-[#B89A62]/20 p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      ফোন নম্বর (Call Phone)
                    </label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, phone: e.target.value },
                        })
                      }
                      className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      হোয়াটসঅ্যাপ নম্বর (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={content.contact.whatsapp}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, whatsapp: e.target.value },
                        })
                      }
                      className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      ইমেইল ঠিকানা (Email)
                    </label>
                    <input
                      type="text"
                      value={content.contact.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, email: e.target.value },
                        })
                      }
                      className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      গুগল ম্যাপস লিংক (Google Maps URL)
                    </label>
                    <input
                      type="text"
                      value={content.contact.mapsUrl}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, mapsUrl: e.target.value },
                        })
                      }
                      className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    বনানী স্টুডিওর ঠিকানা ({editLang})
                  </label>
                  <input
                    type="text"
                    value={content.contact.studioAddress[editLang]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          studioAddress: {
                            ...content.contact.studioAddress,
                            [editLang]: e.target.value,
                          },
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    খোলা থাকার সময় ({editLang})
                  </label>
                  <input
                    type="text"
                    value={content.contact.studioHours[editLang]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: {
                          ...content.contact,
                          studioHours: {
                            ...content.contact.studioHours,
                            [editLang]: e.target.value,
                          },
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. FOOTER & BRAND TAB */}
          {/* ========================================================= */}
          {activeTab === "footer" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  ফুটার, সোশ্যাল মিডিয়া ও অ্যাডমিন পাসকোড
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  ব্র্যান্ডের কোট, সোশ্যাল লিংক এবং অ্যাডমিন প্যানেলে লগইনের পাসকোড পরিবর্তন করুন।
                </p>
              </div>

              <div className="bg-[#171312] border border-[#B89A62]/20 p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                {/* Admin Passcode Change */}
                <div className="p-4 rounded-xl bg-[#6D1F2A]/20 border border-[#6D1F2A]/40 flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-rose-300 font-semibold">
                    🔐 অ্যাডমিন পাসকোড পরিবর্তন করুন (Admin Passcode)
                  </label>
                  <input
                    type="text"
                    value={content.brand.adminPasscode}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        brand: { ...content.brand, adminPasscode: e.target.value },
                      })
                    }
                    className="px-4 py-2.5 bg-[#141110] border border-rose-500/30 rounded-xl text-sm font-mono text-[#F5F0E8]"
                  />
                  <span className="text-[10px] text-rose-200/70">
                    * সতর্ক থাকুন: নতুন পাসকোডটি মনে রাখুন। সেভ করার পর পরবর্তীতে এই নতুন পাসকোড দিয়ে লগইন করতে হবে।
                  </span>
                </div>

                {/* Heritage Quote */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    হেরিটেজ কোট (Maison Quote — {editLang})
                  </label>
                  <textarea
                    rows={2}
                    value={content.footer.quote[editLang]}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        footer: {
                          ...content.footer,
                          quote: { ...content.footer.quote, [editLang]: e.target.value },
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-sm text-[#F5F0E8]"
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      ইনস্টাগ্রাম (Instagram URL)
                    </label>
                    <input
                      type="text"
                      value={content.brand.socials.instagram}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          brand: {
                            ...content.brand,
                            socials: { ...content.brand.socials, instagram: e.target.value },
                          },
                        })
                      }
                      className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      ফেসবুক (Facebook URL)
                    </label>
                    <input
                      type="text"
                      value={content.brand.socials.facebook}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          brand: {
                            ...content.brand,
                            socials: { ...content.brand.socials, facebook: e.target.value },
                          },
                        })
                      }
                      className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                      পিন্টারেস্ট (Pinterest URL)
                    </label>
                    <input
                      type="text"
                      value={content.brand.socials.pinterest}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          brand: {
                            ...content.brand,
                            socials: { ...content.brand.socials, pinterest: e.target.value },
                          },
                        })
                      }
                      className="px-3 py-2 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. AI STUDIO SETTINGS TAB */}
          {/* ========================================================= */}
          {activeTab === "aiStudio" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  এআই ভার্চুয়াল ট্রায়াল স্টুডিও ইঞ্জিন (AI Studio Engine)
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  কাস্টমারদের লাইভ ক্যামেরা স্ন্যাপশট এবং আপলোড করা ছবির উপর ফটো-রিয়েলিস্টিক শাড়ি ও জুয়েলারি ফিটিং নিয়ন্ত্রণ করুন।
                </p>
              </div>

              {/* Status Overview Card */}
              <div className="bg-[#171312] border border-[#B89A62]/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#6D1F2A]/40 border border-[#B89A62]/50 flex items-center justify-center text-xl">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#F5F0E8]">
                      আভরণী হাই-রেজোলিউশন নিউরাল অ্যাটেলিয়ার ইঞ্জিন
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 pt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>১০০% কার্যকর ও সক্রিয় (Zero Friction Built-in Active)</span>
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  target="_blank"
                  className="px-5 py-2.5 bg-[#B89A62] hover:bg-[#C9A96E] text-[#141110] font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow"
                >
                  স্টুডিও টেস্ট করুন ↗
                </Link>
              </div>

              {/* API Keys Configuration Card */}
              <div className="bg-[#171312] border border-[#B89A62]/20 p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
                <div className="border-b border-[#B89A62]/10 pb-3">
                  <h3 className="font-serif text-lg text-[#F5F0E8]">
                    ক্লাউড জেনারেটিভ এআই সেটিংস (ঐচ্ছিক)
                  </h3>
                  <p className="text-xs text-[#F5F0E8]/50 pt-1">
                    যেকোনো সময় আপনার নিজস্ব Google Gemini বা Replicate API কি যুক্ত করে ক্লাউড মডেল সক্রিয় করতে পারেন। কি না দিলেও বিল্ট-ইন ইঞ্জিন স্বয়ংক্রিয়ভাবে কাজ করবে।
                  </p>
                </div>

                {/* Model Engine Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    এআই প্রসেসিং মোড (Processing Mode)
                  </label>
                  <select
                    value={content.aiEngine?.modelType || "auto"}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        aiEngine: {
                          ...(content.aiEngine || {
                            geminiApiKey: "",
                            replicateApiKey: "",
                            modelType: "auto",
                            statusNote: "",
                          }),
                          modelType: e.target.value as any,
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8] focus:border-[#B89A62] outline-none cursor-pointer"
                  >
                    <option value="auto">
                      স্বয়ংক্রিয় (Auto - বিল্ট-ইন নিউরাল অ্যাটেলিয়ার ও ক্লাউড সিঙ্ক)
                    </option>
                    <option value="neural-composite">
                      বিল্ট-ইন হাইপার-রিয়েলিস্টিক ইঞ্জিন (জিরো কস্ট ও দ্রুততম)
                    </option>
                    <option value="gemini">
                      Google Gemini 2.0 Multimodal Studio
                    </option>
                    <option value="replicate">
                      Replicate IDM-VTON Virtual Garment Engine
                    </option>
                  </select>
                </div>

                {/* Google Gemini API Key */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium flex items-center justify-between">
                    <span>Google Gemini API Key</span>
                    <span className="text-[10px] text-[#F5F0E8]/40 lowercase font-mono">
                      (optional)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="AIzaSy... or AQ...."
                      value={content.aiEngine?.geminiApiKey || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          aiEngine: {
                            ...(content.aiEngine || {
                              geminiApiKey: "",
                              replicateApiKey: "",
                              modelType: "auto",
                              statusNote: "",
                            }),
                            geminiApiKey: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8] font-mono focus:border-[#B89A62] outline-none placeholder:text-[#F5F0E8]/20"
                    />
                    <button
                      type="button"
                      onClick={handleTestGeminiKey}
                      disabled={geminiTestStatus?.loading}
                      className="px-3.5 py-2.5 rounded-xl bg-[#6D1F2A] hover:bg-[#852735] text-[#F5F0E8] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      <span>⚡</span>
                      <span>{geminiTestStatus?.loading ? "পরীক্ষা হচ্ছে..." : "টেস্ট কানেকশন"}</span>
                    </button>
                  </div>

                  {geminiTestStatus?.message && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-start gap-2 border animate-in fade-in duration-200 ${
                        geminiTestStatus.success
                          ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                          : "bg-amber-950/60 border-amber-500/40 text-amber-200"
                      }`}
                    >
                      <span className="text-base shrink-0">{geminiTestStatus.success ? "✅" : "⚠️"}</span>
                      <p className="leading-relaxed">{geminiTestStatus.message}</p>
                    </div>
                  )}
                </div>

                {/* Replicate API Token */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium flex items-center justify-between">
                    <span>Replicate API Token (IDM-VTON)</span>
                    <span className="text-[10px] text-[#F5F0E8]/40 lowercase font-mono">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="r8_..."
                    value={content.aiEngine?.replicateApiKey || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        aiEngine: {
                          ...(content.aiEngine || {
                            geminiApiKey: "",
                            replicateApiKey: "",
                            modelType: "auto",
                            statusNote: "",
                          }),
                          replicateApiKey: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8] font-mono focus:border-[#B89A62] outline-none placeholder:text-[#F5F0E8]/20"
                  />
                </div>

                {/* Status Note */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#B89A62] font-medium">
                    স্টুডিও স্ট্যাটাস বার্তা (Status Note)
                  </label>
                  <input
                    type="text"
                    value={content.aiEngine?.statusNote || "Avoroni Haute Couture Atelier Active"}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        aiEngine: {
                          ...(content.aiEngine || {
                            geminiApiKey: "",
                            replicateApiKey: "",
                            modelType: "auto",
                            statusNote: "",
                          }),
                          statusNote: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-2.5 bg-[#110D0C] border border-[#B89A62]/20 rounded-xl text-xs text-[#F5F0E8] focus:border-[#B89A62] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. MEDIA & UPLOADS TAB */}
          {/* ========================================================= */}
          {activeTab === "media" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-[#F5F0E8] font-light">
                  মিডিয়া ও ইমেজ আপলোডার (Media Manager)
                </h2>
                <p className="text-xs text-[#F5F0E8]/60 pt-1 font-light">
                  সরাসরি আপনার কম্পিউটার থেকে নতুন ছবি আপলোড করুন এবং যেকোনো শাড়িতে ব্যবহারের জন্য ইউআরএল কপি করুন।
                </p>
              </div>

              {/* Upload Box */}
              <div className="bg-[#171312] border-2 border-dashed border-[#B89A62]/40 hover:border-[#B89A62] p-10 rounded-2xl flex flex-col items-center justify-center text-center gap-4 transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#B89A62]/10 border border-[#B89A62]/30 flex items-center justify-center text-2xl">
                  📁
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-serif text-lg text-[#F5F0E8]">নতুন ছবি সিলেক্ট বা ড্র্যাগ করুন</span>
                  <span className="text-xs text-[#F5F0E8]/50">JPG, PNG, WebP ফরম্যাট সমর্থিত</span>
                </div>

                <label className="px-6 py-2.5 bg-[#6D1F2A] hover:bg-[#852735] text-[#F5F0E8] rounded-xl text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all shadow-md">
                  <span>{isUploading ? "আপলোড হচ্ছে..." : "ছবি নির্বাচন করুন"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => handleImageUpload(e)}
                  />
                </label>
              </div>

              {/* Uploaded History */}
              {uploadedImages.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-serif text-lg text-[#B89A62]">এই সেশনে আপলোডকৃত ছবিসমূহ:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((url, i) => (
                      <div key={i} className="bg-[#171312] border border-[#B89A62]/20 p-2.5 rounded-xl flex flex-col gap-2">
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#110D0C]">
                          <Image src={url} alt="Uploaded preview" fill className="object-cover" unoptimized />
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            showToast("success", "লিংক কপি হয়েছে!");
                          }}
                          className="w-full py-1 text-[10px] bg-[#1E1917] hover:bg-[#B89A62] hover:text-[#141110] text-[#EDE3D5] rounded-md transition-colors font-mono truncate"
                        >
                          📋 লিংক কপি করুন
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
