"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BrandMark from "./BrandMark";
import { useLanguage } from "@/context/LanguageContext";
import {
  PRODUCT_FAQS,
  POPULAR_TOPIC_PILLS,
  ProductReference,
  FAQItem,
} from "@/data/productFaqs";
import { findBestFAQ, getFAQById } from "@/utils/faqMatcher";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  product?: ProductReference;
  suggestions?: FAQItem[];
}

export default function ProductChatbot() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get localized time string
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString(language === "bn" ? "bn-BD" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Initialize greeting message on first mount or language switch if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: "greeting",
        sender: "bot",
        text: t("chatbot_greeting_desc"),
        time: getCurrentTime(),
        suggestions: [
          PRODUCT_FAQS.find((f) => f.id === "jamdani-overview")!,
          PRODUCT_FAQS.find((f) => f.id === "mirpur-overview")!,
          PRODUCT_FAQS.find((f) => f.id === "saree-care-general")!,
          PRODUCT_FAQS.find((f) => f.id === "blouse-piece")!,
        ].filter(Boolean),
      };
      setMessages([initialGreeting]);
    }
  }, [language]);

  // Scroll to bottom of message list smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Auto-focus input when opened
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, isTyping]);

  // Open chatbot
  const handleOpen = () => {
    setIsOpen(true);
    setHasOpenedBefore(true);
    setShowTeaser(false);
  };

  // Close chatbot
  const handleClose = () => {
    setIsOpen(false);
  };

  // Reset conversation
  const handleReset = () => {
    const freshGreeting: ChatMessage = {
      id: `greeting-${Date.now()}`,
      sender: "bot",
      text: t("chatbot_greeting_desc"),
      time: getCurrentTime(),
      suggestions: [
        PRODUCT_FAQS.find((f) => f.id === "jamdani-overview")!,
        PRODUCT_FAQS.find((f) => f.id === "mirpur-overview")!,
        PRODUCT_FAQS.find((f) => f.id === "saree-care-general")!,
        PRODUCT_FAQS.find((f) => f.id === "blouse-piece")!,
      ].filter(Boolean),
    };
    setMessages([freshGreeting]);
  };

  // Execute bot reply with realistic typing simulation
  const executeBotReply = (query: string, explicitFAQ?: FAQItem) => {
    setIsTyping(true);

    // Simulate luxury concierge typing duration
    setTimeout(() => {
      let replyItem: FAQItem | null = explicitFAQ || null;
      let suggestions: FAQItem[] = [];

      if (!replyItem) {
        const result = findBestFAQ(query);
        replyItem = result.match;
        suggestions = result.suggestions;
      } else {
        // Find suggestions related to this explicit FAQ
        if (replyItem.followUpQuestions) {
          suggestions = replyItem.followUpQuestions
            .map((id) => getFAQById(id))
            .filter((item): item is FAQItem => Boolean(item));
        }
      }

      let replyText = "";
      if (replyItem) {
        replyText = replyItem.answer[language];
      } else {
        replyText = t("chatbot_no_match");
      }

      const newBotMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        time: getCurrentTime(),
        product: replyItem?.product,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      };

      setMessages((prev) => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 700);
  };

  // Handle user submitting free text
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    executeBotReply(query);
  };

  // Handle clicking a quick pill or suggestion
  const handleSelectTopic = (faqId: string) => {
    if (isTyping) return;
    const item = getFAQById(faqId);
    if (!item) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: item.question[language],
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    executeBotReply(item.question[language], item);
  };

  // Scroll to section on page for product previews
  const handleScrollToSection = (sectionId: string) => {
    let target = sectionId;
    if (target === "origin" && !document.getElementById("origin")) {
      target = "categories";
    }
    const el = document.getElementById(target) || document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* 01: FLOATING CONCIERGE LAUNCHER BUTTON & TEASER PILL         */}
      {/* ============================================================ */}
      <div className="fixed bottom-20 right-4 sm:bottom-7 sm:right-7 z-40 flex flex-col items-end gap-2.5 pointer-events-auto select-none">
        {/* Floating Teaser Prompt (Visible on first load on larger screens) */}
        {!isOpen && showTeaser && (
          <div
            onClick={handleOpen}
            className="group hidden sm:flex items-center gap-3 bg-[#F5F0E8]/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#B89A62]/40 shadow-xl shadow-dark/15 hover:border-[#6D1F2A]/60 transition-all duration-300 cursor-pointer animate-fade-in"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-serif font-medium tracking-[0.05em] text-[#1A1514]">
                {t("chatbot_launcher_badge")}
              </span>
              <span className="text-[9px] font-sans font-light tracking-[0.1em] text-[#1A1514]/60 uppercase">
                {t("chatbot_launcher_sub")}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="text-[#1A1514]/40 hover:text-[#1A1514] text-xs ml-1"
              aria-label="Dismiss Teaser"
            >
              ✕
            </button>
          </div>
        )}

        {/* Floating Trigger Button */}
        {!isOpen && (
          <button
            onClick={handleOpen}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#46151D] via-[#6D1F2A] to-[#1A1514] text-[#F5F0E8] shadow-2xl shadow-[#6D1F2A]/40 border border-[#B89A62]/40 hover:scale-105 active:scale-95 transition-transform duration-300 focus:outline-none group"
            aria-label="Open Avoroni Saree Concierge"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#B89A62]/30 to-[#6D1F2A]/30 blur-sm group-hover:blur-md transition-all opacity-70 animate-pulse" />

            {/* Inner Brand Icon */}
            <div className="relative flex flex-col items-center justify-center">
              <BrandMark size={22} variant="light" className="transition-transform group-hover:rotate-12 duration-300" />
              <span className="text-[7.5px] tracking-[0.2em] uppercase font-sans font-medium text-[#C8B289] mt-0.5">
                FAQ
              </span>
            </div>

            {/* Active Online Green Dot */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1A1514] rounded-full shadow-sm" />
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* 02: LUXURY CHAT WINDOW / MODAL                               */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Avoroni Textile Concierge"
          className="fixed bottom-16 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[calc(100vw-1.5rem)] sm:w-[410px] h-[580px] max-h-[82vh] sm:max-h-[90vh] bg-[#FBF8F3] rounded-[28px] shadow-2xl shadow-dark/30 border border-[#B89A62]/35 overflow-hidden transition-all duration-300 select-none animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <header className="relative flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#46151D] via-[#6D1F2A] to-[#3B1118] text-[#F5F0E8] border-b border-[#B89A62]/25">
            {/* Subtle decorative gold arch line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B89A62]/80 to-transparent" />

            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1514]/40 border border-[#B89A62]/40 shadow-inner">
                <BrandMark size={20} variant="light" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1A1514]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-light tracking-[0.05em] text-[#F5F0E8]">
                    {t("chatbot_title")}
                  </h3>
                  <span className="text-[8px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-full bg-[#B89A62]/25 text-[#E6D5B8] font-sans font-medium">
                    {t("chatbot_status")}
                  </span>
                </div>
                <p className="text-[9px] font-sans font-light tracking-[0.12em] text-[#EDE3D5]/70 uppercase">
                  {t("chatbot_subtitle")}
                </p>
              </div>
            </div>

            {/* Header Right Actions: Language Switch, Reset, Close */}
            <div className="flex items-center gap-1.5">
              {/* Inline Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="px-2 py-1 rounded-full text-[9px] font-sans font-medium tracking-[0.1em] uppercase bg-[#1A1514]/40 hover:bg-[#1A1514]/70 text-[#C8B289] border border-[#B89A62]/30 transition-colors"
                title="Switch Language [EN / বাংলা]"
              >
                {language === "en" ? "বাংলা" : "EN"}
              </button>

              {/* Reset chat */}
              <button
                onClick={handleReset}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#EDE3D5]/70 hover:text-[#EDE3D5] transition-colors"
                title={t("chatbot_reset")}
                aria-label={t("chatbot_reset")}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Close window */}
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#EDE3D5]/80 hover:text-white transition-colors"
                title={t("chatbot_close")}
                aria-label={t("chatbot_close")}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* ============================================================ */}
          {/* 03: MESSAGE STREAM                                           */}
          {/* ============================================================ */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#F5F0E8]/40 overscroll-contain text-sm font-sans">
            {/* Atelier Heritage Tag */}
            <div className="flex items-center justify-center my-1">
              <span className="text-[8.5px] tracking-[0.25em] uppercase font-sans text-[#1A1514]/40 bg-[#EDE3D5]/60 px-3 py-1 rounded-full border border-[#1A1514]/5">
                Avoroni Dhaka Atelier • Verified Weaves
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                } space-y-1.5`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#6D1F2A] text-[#F5F0E8] rounded-tr-none font-sans"
                      : "bg-[#FFFFFF] text-[#1A1514] border border-[#1A1514]/8 rounded-tl-none font-sans shadow-black/[0.03]"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Product Attachment Preview Card */}
                  {msg.product && (
                    <div className="mt-3 pt-3 border-t border-[#1A1514]/10 flex flex-col gap-2">
                      <div className="flex items-center gap-3 bg-[#F5F0E8] p-2.5 rounded-xl border border-[#B89A62]/30">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-[#1A1514]/10 bg-white">
                          <Image
                            src={msg.product.image}
                            alt={msg.product.name[language]}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-medium text-[#1A1514] truncate">
                            {msg.product.name[language]}
                          </h4>
                          <p className="text-[10px] text-[#1A1514]/65 truncate">
                            {msg.product.weave[language]}
                          </p>
                          <span className="inline-block mt-0.5 text-xs font-semibold text-[#6D1F2A]">
                            {msg.product.price[language]}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleScrollToSection(msg.product!.sectionId)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10.5px] font-sans tracking-[0.1em] uppercase font-medium bg-[#1A1514] hover:bg-[#6D1F2A] text-[#F5F0E8] rounded-lg transition-colors"
                      >
                        <span>{t("chatbot_view_product")}</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow-up / Suggestions Pills under Bot Response */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-1 max-w-[90%]">
                    <span className="text-[9px] tracking-[0.1em] uppercase text-[#1A1514]/50 font-medium">
                      {t("chatbot_related_heading")}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug) => (
                        <button
                          key={sug.id}
                          onClick={() => handleSelectTopic(sug.id)}
                          className="text-left text-[10.5px] px-2.5 py-1 rounded-full bg-[#EDE3D5]/80 hover:bg-[#B89A62]/30 border border-[#B89A62]/30 text-[#1A1514] transition-colors leading-tight"
                        >
                          {sug.question[language]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[8.5px] text-[#1A1514]/40 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Simulated Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#1A1514]/8 rounded-2xl rounded-tl-none w-fit shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A62] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-[#1A1514]/60 font-sans italic ml-1">
                  {t("chatbot_typing")}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ============================================================ */}
          {/* 04: QUICK POPULAR TOPICS CAROUSEL                            */}
          {/* ============================================================ */}
          <div className="px-4 py-2 bg-[#EDE3D5]/40 border-t border-[#1A1514]/8 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[8.5px] tracking-[0.1em] uppercase text-[#1A1514]/50 font-medium whitespace-nowrap pl-1">
              {language === "bn" ? "টপিক:" : "Topics:"}
            </span>
            {POPULAR_TOPIC_PILLS.map((pill) => (
              <button
                key={pill.id}
                onClick={() => handleSelectTopic(pill.id)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-sans font-medium bg-white hover:bg-[#6D1F2A] hover:text-[#F5F0E8] text-[#1A1514] border border-[#1A1514]/10 transition-colors flex-shrink-0 shadow-2xs"
              >
                {pill.label[language]}
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/* 05: INPUT FORM & WHATSAPP ESCALATION BAR                     */}
          {/* ============================================================ */}
          <div className="p-3.5 bg-white border-t border-[#1A1514]/10 flex flex-col gap-2">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t("chatbot_input_ph")}
                className="flex-1 bg-[#F5F0E8]/70 border border-[#1A1514]/15 rounded-full px-4 py-2 text-xs text-[#1A1514] placeholder-[#1A1514]/40 focus:outline-none focus:border-[#6D1F2A] focus:bg-white transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6D1F2A] hover:bg-[#46151D] disabled:opacity-40 text-[#F5F0E8] transition-colors flex-shrink-0 shadow-sm"
                aria-label={t("chatbot_send")}
              >
                <svg
                  className="w-3.5 h-3.5 translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            {/* Direct WhatsApp Concierge Escalate Button */}
            <div className="flex items-center justify-between pt-1 text-[9px] text-[#1A1514]/60 font-sans">
              <span className="truncate pr-2">{t("chatbot_whatsapp_help")}</span>
              <a
                href={
                  language === "bn"
                    ? `https://wa.me/8801712345678?text=${encodeURIComponent("আসসালামু আলাইকুম আভরণী ঢাকা অ্যাটেলিয়ার, শাড়ি সম্পর্কে জানতে যোগাযোগ করছি।")}`
                    : `https://wa.me/8801712345678?text=${encodeURIComponent("Hello Avoroni Dhaka Atelier, I have an inquiry about your sarees.")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-[#1E7E34] hover:underline flex-shrink-0"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.532 1.764.819 2.796.819 3.18 0 5.767-2.587 5.767-5.766.001-3.181-2.585-5.806-5.767-5.806zm7.842 5.766c-.002 4.323-3.518 7.84-7.843 7.84-1.31 0-2.576-.328-3.702-.953l-4.148 1.088 1.107-4.045c-.687-1.189-1.049-2.545-1.05-3.93.001-4.323 3.519-7.841 7.844-7.841 4.324.001 7.842 3.519 7.842 7.841z" />
                </svg>
                <span>{t("chatbot_whatsapp_btn")}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
