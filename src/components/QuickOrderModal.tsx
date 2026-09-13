"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useOrderModal } from "@/context/OrderModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";

export default function QuickOrderModal() {
  const { isOpen, product, closeOrderModal } = useOrderModal();
  const { language, t } = useLanguage();
  const { content } = useContent();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryZone: "inside_dhaka" as "inside_dhaka" | "outside_dhaka",
    paymentMethod: "cod" as "cod" | "bkash",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Extract numeric price from formatted price string e.g. "৳ 9,500" -> 9500
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    // Map Bengali digits to English digits
    const bnToEnMap: Record<string, string> = {
      "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
      "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    };
    const normalized = priceStr.replace(/[০-৯]/g, (digit) => bnToEnMap[digit] || digit);
    const num = parseInt(normalized.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const unitPrice = product ? parsePrice(product.price) : 0;
  const isFreeDelivery = unitPrice >= 10000;
  const deliveryFee = isFreeDelivery
    ? 0
    : formData.deliveryZone === "inside_dhaka"
    ? 80
    : 150;
  const totalAmount = unitPrice + deliveryFee;

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setCompletedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim().replace(/[- ]/g, "");
    const trimmedAddress = formData.address.trim();

    if (!trimmedName) {
      setErrorMessage(language === "bn" ? "অনুগ্রহ করে আপনার নাম লিখুন" : "Please enter your name");
      return;
    }

    // Validate Bangladesh mobile number (e.g. 01712345678, +8801712345678)
    const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(trimmedPhone)) {
      setErrorMessage(
        language === "bn"
          ? "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)"
          : "Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)"
      );
      return;
    }

    if (!trimmedAddress || trimmedAddress.length < 5) {
      setErrorMessage(
        language === "bn"
          ? "অনুগ্রহ করে পূর্ণাঙ্গ ডেলিভারি ঠিকানা লিখুন"
          : "Please enter a complete delivery address"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          customerName: trimmedName,
          phone: trimmedPhone,
          address: trimmedAddress,
          deliveryZone: isFreeDelivery ? "free" : formData.deliveryZone,
          deliveryFee,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes.trim(),
          totalAmount,
          product: {
            id: product.id,
            name: product.name,
            weave: product.weave,
            color: product.color,
            price: product.price,
            numericPrice: unitPrice,
            image: product.image,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCompletedOrder(data.record);
      } else {
        setErrorMessage(data.error || "Failed to place order. Please try again.");
      }
    } catch (err: any) {
      console.error("Order placement error:", err);
      setErrorMessage(
        language === "bn"
          ? "নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন অথবা হোয়াটসঅ্যাপে জানান।"
          : "Network error. Please try again or reach out on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppForward = () => {
    if (!completedOrder) return;
    const phone = content?.contact?.whatsapp?.replace(/[^0-9]/g, "") || "8801712345678";
    const msg =
      language === "bn"
        ? `আসসালামু আলাইকুম আভরণী ঢাকা স্টুডিও! আমি ওয়েবসাইটে একটি অর্ডার প্লেস করেছি।\n\n📌 অর্ডার আইডি: ${completedOrder.id}\n👗 শাড়ির নাম: ${product.name} (${product.color || ""})\n💰 মূল্য: ${product.price} (সর্বমোট: ৳ ${totalAmount.toLocaleString()})\n👤 নাম: ${completedOrder.customerName}\n📞 মোবাইল: ${completedOrder.phone}\n📍 ঠিকানা: ${completedOrder.address}\n\nদয়া করে অর্ডারটি দ্রুত কনফার্ম করবেন। ধন্যবাদ!`
        : `Hello Avoroni Dhaka Atelier! I have placed an order on the website.\n\n📌 Order ID: ${completedOrder.id}\n👗 Piece: ${product.name} (${product.color || ""})\n💰 Price: ${product.price} (Total: ৳ ${totalAmount.toLocaleString()})\n👤 Name: ${completedOrder.customerName}\n📞 Phone: ${completedOrder.phone}\n📍 Address: ${completedOrder.address}\n\nPlease confirm and dispatch my order. Thank you!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
      onClick={closeOrderModal}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-[#C5A869]/40 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1A1514] text-[#FAF5ED] border-b border-[#C5A869]/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-light tracking-wide">
                {t("quick_order")}
              </h3>
              <p className="text-[10px] font-sans text-[#C5A869] tracking-wider uppercase">
                {t("quick_order_subtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeOrderModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {completedOrder ? (
            // ==========================================
            // SUCCESS CONFIRMATION STATE
            // ==========================================
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 text-3xl shadow-lg">
                ✓
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-[#6D1F2A] font-semibold">
                  {completedOrder.id}
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#1A1514] font-medium">
                  {t("order_success_title")}
                </h4>
                <p className="text-xs sm:text-sm font-sans text-[#1A1514]/70 max-w-md mx-auto leading-relaxed mt-1">
                  {t("order_success_msg")}
                </p>
              </div>

              {/* Order Voucher Card */}
              <div className="w-full max-w-md bg-[#EDE3D5]/60 rounded-2xl p-4 sm:p-5 border border-[#C5A869]/30 flex flex-col gap-3 text-left my-2 text-xs font-sans">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1A1514]/10">
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-black/10 shrink-0 border border-[#C5A869]/30">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-serif text-base text-[#1A1514] truncate font-medium">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-[#6D1F2A]">{product.weave || product.color}</p>
                    <p className="text-xs font-semibold text-[#8C6B38] mt-0.5">{product.price}</p>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1514]/10">
                  <span className="text-[#1A1514]/60">{language === "bn" ? "গ্রাহক:" : "Customer:"}</span>
                  <span className="font-medium text-[#1A1514]">{completedOrder.customerName} ({completedOrder.phone})</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1514]/10">
                  <span className="text-[#1A1514]/60">{language === "bn" ? "ডেলিভারি ঠিকানা:" : "Delivery Address:"}</span>
                  <span className="font-medium text-[#1A1514] text-right max-w-[200px] truncate">{completedOrder.address}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#1A1514]/10">
                  <span className="text-[#1A1514]/60">{language === "bn" ? "পেমেন্ট পদ্ধতি:" : "Payment:"}</span>
                  <span className="font-medium text-[#1A1514]">
                    {completedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "bKash / Nagad"}
                  </span>
                </div>

                <div className="flex justify-between pt-1 font-serif text-sm sm:text-base font-bold text-[#6D1F2A]">
                  <span>{t("total_payable")}:</span>
                  <span>৳ {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppForward}
                  className="w-full sm:flex-1 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>💬</span>
                  <span>{t("chat_whatsapp_order")}</span>
                </button>

                <button
                  type="button"
                  onClick={closeOrderModal}
                  className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#1A1514] hover:bg-[#2A2220] text-[#FAF5ED] font-sans text-xs tracking-wider uppercase font-medium transition-all cursor-pointer"
                >
                  {t("continue_shopping")}
                </button>
              </div>
            </div>
          ) : (
            // ==========================================
            // ORDER FORM
            // ==========================================
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Product Brief Capsule */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#EDE3D5]/50 border border-[#C5A869]/30">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-[#C5A869]/40 shadow-xs">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-sans text-[#6D1F2A] font-semibold">
                    <span>{product.weave || "Authentic Handloom"}</span>
                    {product.color && <span>&bull; {product.color}</span>}
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-medium text-[#1A1514] truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-serif text-base font-semibold text-[#8C6B38]">
                      {product.price}
                    </span>
                    <span className="text-[9px] tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                      {language === "bn" ? "ইন স্টক • রেডি টু ডেলিভারি" : "In Atelier • Ready to Dispatch"}
                    </span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Input Row: Name & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-wider uppercase font-sans text-[#1A1514]/70 font-semibold">
                    {t("customer_name")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("customer_name_ph")}
                    className="w-full bg-white border border-[#1A1514]/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] focus:border-[#6D1F2A] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] tracking-wider uppercase font-sans text-[#1A1514]/70 font-semibold">
                    {t("customer_phone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("customer_phone_ph")}
                    className="w-full bg-white border border-[#1A1514]/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-sans text-[#1A1514] focus:border-[#6D1F2A] focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Delivery Zone Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-wider uppercase font-sans text-[#1A1514]/70 font-semibold">
                  {t("delivery_zone")} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryZone: "inside_dhaka" })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      formData.deliveryZone === "inside_dhaka"
                        ? "bg-[#6D1F2A]/10 border-[#6D1F2A] text-[#1A1514] font-medium"
                        : "bg-white border-[#1A1514]/15 text-[#1A1514]/70 hover:border-[#1A1514]/30"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">{language === "bn" ? "ঢাকার ভিতরে" : "Inside Dhaka"}</p>
                      <p className="text-[10.5px] text-[#1A1514]/60">২৪–৪৮ ঘণ্টা এক্সপ্রেস ডেলিভারি</p>
                    </div>
                    <span className="text-xs font-serif font-bold text-[#6D1F2A]">
                      {isFreeDelivery ? (language === "bn" ? "ফ্রি" : "FREE") : "৳ ৮০"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryZone: "outside_dhaka" })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      formData.deliveryZone === "outside_dhaka"
                        ? "bg-[#6D1F2A]/10 border-[#6D1F2A] text-[#1A1514] font-medium"
                        : "bg-white border-[#1A1514]/15 text-[#1A1514]/70 hover:border-[#1A1514]/30"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold">{language === "bn" ? "ঢাকার বাইরে" : "Outside Dhaka"}</p>
                      <p className="text-[10.5px] text-[#1A1514]/60">২–৪ দিন নিশ্চিত হোম ডেলিভারি</p>
                    </div>
                    <span className="text-xs font-serif font-bold text-[#6D1F2A]">
                      {isFreeDelivery ? (language === "bn" ? "ফ্রি" : "FREE") : "৳ ১৫০"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-wider uppercase font-sans text-[#1A1514]/70 font-semibold">
                  {t("delivery_address")} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t("delivery_address_ph")}
                  className="w-full bg-white border border-[#1A1514]/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-sans text-[#1A1514] focus:border-[#6D1F2A] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-wider uppercase font-sans text-[#1A1514]/70 font-semibold">
                  {t("payment_method")}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      formData.paymentMethod === "cod"
                        ? "bg-white border-[#6D1F2A] shadow-xs"
                        : "bg-white/50 border-[#1A1514]/15 text-[#1A1514]/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className="accent-[#6D1F2A]"
                    />
                    <span className="text-xs font-sans font-medium">{t("payment_cod")}</span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      formData.paymentMethod === "bkash"
                        ? "bg-white border-[#6D1F2A] shadow-xs"
                        : "bg-white/50 border-[#1A1514]/15 text-[#1A1514]/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === "bkash"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "bkash" })}
                      className="accent-[#6D1F2A]"
                    />
                    <span className="text-xs font-sans font-medium">{t("payment_bkash")}</span>
                  </label>
                </div>
              </div>

              {/* Order Financial Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#EDE3D5]/40 border border-[#1A1514]/10 flex flex-col gap-1.5 text-xs font-sans">
                <div className="flex justify-between text-[#1A1514]/70">
                  <span>{t("subtotal")}:</span>
                  <span>{product.price}</span>
                </div>
                <div className="flex justify-between text-[#1A1514]/70">
                  <span>{t("delivery_charge")}:</span>
                  <span className={deliveryFee === 0 ? "text-emerald-700 font-semibold" : ""}>
                    {deliveryFee === 0 ? (language === "bn" ? "ফ্রি (৳০)" : "FREE") : `৳ ${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 mt-1 border-t border-[#1A1514]/10 flex justify-between font-serif text-base sm:text-lg font-bold text-[#6D1F2A]">
                  <span>{t("total_payable")}:</span>
                  <span>৳ {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#6D1F2A] via-[#852735] to-[#6D1F2A] hover:brightness-110 text-[#FAF5ED] text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "⏳" : "⚡"}</span>
                <span>{isSubmitting ? t("order_submitting") : t("place_order_btn")}</span>
              </button>

              {/* Guarantees Badge */}
              <div className="flex items-center justify-center gap-4 text-[9.5px] font-sans text-[#1A1514]/55 tracking-wider uppercase pt-1">
                <span>🛡️ ১০০% আসল তাঁত</span>
                <span>•</span>
                <span>📦 ওপেন বক্স ডেলিভারি</span>
                <span>•</span>
                <span>🔄 ৭ দিনের এক্সচেঞ্জ</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
