"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export default function ContactForm() {
  const { language, t } = useLanguage();
  const { content } = useContent();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occasion: "Bridal Trousseau",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry",
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          occasion: formData.occasion,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit inquiry");
      }
    } catch (err: any) {
      console.error("Inquiry submission error:", err);
      setError("Network error while submitting inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendViaWhatsApp = () => {
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const text =
      language === "bn"
        ? `আসসালামু আলাইকুম আভরণী ঢাকা স্টুডিও! আমি ওয়েবসাইট থেকে একটি অনুসন্ধান বার্তা পাঠিয়েছি।\n\n👤 নাম: ${formData.name}\n📞 ফোন: ${formData.phone}\n📧 ইমেইল: ${formData.email}\n💍 অনুষ্ঠান/পছন্দ: ${formData.occasion}\n📝 বার্তা: ${formData.message}`
        : `Hello Avoroni Dhaka Atelier! I have submitted an inquiry via the website.\n\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}\n📧 Email: ${formData.email}\n💍 Occasion: ${formData.occasion}\n📝 Message: ${formData.message}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full bg-[#EDE3D5]/50 p-6 sm:p-8 rounded-3xl border border-[#1A1514]/10 select-none"
      aria-label="Atelier Contact Form"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[#1A1514]/10">
        <h3 className="font-serif text-2xl font-light text-[#1A1514]">
          {t("contact_form_title")}
        </h3>
        <span className="text-[9px] tracking-[0.25em] uppercase text-[#6D1F2A] font-sans font-medium">
          {t("contact_form_badge")}
        </span>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1A1514]/70 font-medium"
        >
          {t("contact_form_name")} *
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t("contact_form_name_ph")}
          className="w-full bg-[#F5F0E8] border border-[#1A1514]/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] placeholder:text-[#1A1514]/35 focus:border-[#6D1F2A] focus:outline-none transition-colors"
        />
      </div>

      {/* Email & Phone 2-col on sm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1A1514]/70 font-medium"
          >
            {t("contact_form_email")} *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={t("contact_form_email_ph")}
            className="w-full bg-[#F5F0E8] border border-[#1A1514]/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] placeholder:text-[#1A1514]/35 focus:border-[#6D1F2A] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phone"
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1A1514]/70 font-medium"
          >
            {t("contact_form_phone")}
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder={t("contact_form_phone_ph")}
            className="w-full bg-[#F5F0E8] border border-[#1A1514]/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] placeholder:text-[#1A1514]/35 focus:border-[#6D1F2A] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Occasion / Saree Type */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="occasion"
          className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1A1514]/70 font-medium"
        >
          {t("contact_form_occasion")}
        </label>
        <select
          id="occasion"
          value={formData.occasion}
          onChange={(e) =>
            setFormData({ ...formData, occasion: e.target.value })
          }
          className="w-full bg-[#F5F0E8] border border-[#1A1514]/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] focus:border-[#6D1F2A] focus:outline-none transition-colors cursor-pointer"
        >
          <option value="Dhakai Jamdani">
            {language === "bn" ? "ঢাকাই জামদানি কালেকশন" : "Dhakai Jamdani Heirloom"}
          </option>
          <option value="Bridal Trousseau">
            {language === "bn" ? "বিয়ের ব্রাইডাল কাতান" : "Bengali Bridal Wedding Trousseau"}
          </option>
          <option value="Rajshahi Silk">
            {language === "bn" ? "রাজশাহী রেশম সিল্ক" : "Rajshahi Mulberry Silk"}
          </option>
          <option value="Festive Drape">
            {language === "bn" ? "উৎসবের ফেস্টিভ শাড়ি" : "Festive & Party Silk Drape"}
          </option>
          <option value="Banani Studio Visit">
            {language === "bn" ? "বনানী স্টুডিও ভিজিট" : "Private In-Studio Viewing (Banani, Dhaka)"}
          </option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#1A1514]/70 font-medium"
        >
          {t("contact_form_msg")} *
        </label>
        <textarea
          id="message"
          rows={3}
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder={t("contact_form_msg_ph")}
          className="w-full bg-[#F5F0E8] border border-[#1A1514]/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] placeholder:text-[#1A1514]/35 focus:border-[#6D1F2A] focus:outline-none transition-colors resize-none"
        />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
          ⚠️ {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-[#6D1F2A] hover:bg-[#46151D] text-[#F5F0E8] text-[10.5px] font-sans tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer shadow-sm disabled:opacity-50"
      >
        <span>
          {loading
            ? t("contact_form_sending")
            : submitted
            ? t("contact_form_success")
            : t("contact_form_send")}
        </span>
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {submitted && (
        <div className="flex flex-col items-center gap-2.5 pt-2">
          <p className="text-center font-serif text-sm italic text-[#6D1F2A]">
            {t("contact_form_thanks")}
          </p>

          <button
            type="button"
            onClick={handleSendViaWhatsApp}
            className="w-full py-2.5 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-medium tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>💬</span>
            <span>{language === "bn" ? "হোয়াটসঅ্যাপে সরাসরি স্টাইলিস্টের সাথে কথা বলুন" : "Chat Directly on WhatsApp"}</span>
          </button>
        </div>
      )}
    </form>
  );
}
